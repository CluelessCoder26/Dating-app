import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { eloQueue } from '../queues.js';
import redisClient from '../redis.js';

const router = express.Router();

// POST /api/swipe
router.post('/', authenticateToken, async (req, res) => {
  const { targetId, rating } = req.body;
  const swiperId = req.userId;

  if (!targetId || !['like', 'nope'].includes(rating)) {
    return res.status(400).json({ error: 'targetId and rating (like or nope) are required' });
  }

  if (swiperId === targetId) {
    return res.status(400).json({ error: 'You cannot swipe on yourself' });
  }

  try {
    // 1. Check if the target user profile exists
    const targetProfile = await prisma.profile.findUnique({
      where: { userId: targetId }
    });

    if (!targetProfile) {
      return res.status(404).json({ error: 'Target profile not found' });
    }

    // 2. Record the swipe in PostgreSQL
    const swipe = await prisma.swipe.upsert({
      where: {
        swiperId_targetId: {
          swiperId,
          targetId
        }
      },
      update: { rating },
      create: { swiperId, targetId, rating }
    });

    // 3. Queue ELO recalculation job with synchronous DB fallback if Redis is offline
    try {
      await eloQueue.add('recalculate', { swiperId, targetId, rating });
    } catch (qErr) {
      console.warn('⚠️ Failed to queue ELO recalculation on Redis, processing synchronously in database:', qErr.message);
      try {
        const actualA = rating === 'like' ? 1 : 0;
        const K = 32;
        const targetAdjustment = rating === 'like' ? 16 : -8;

        // Fetch current swiper profile to get their ELO
        const swiperProfile = await prisma.profile.findUnique({ where: { userId: swiperId } });
        if (swiperProfile) {
          const expA = 1 / (1 + Math.pow(10, (targetProfile.elo - swiperProfile.elo) / 400));
          const newEloA = Math.max(800, swiperProfile.elo + Math.round(K * (actualA - expA)));
          const newEloB = Math.max(800, targetProfile.elo + targetAdjustment);

          await Promise.all([
            prisma.profile.update({ where: { userId: swiperId }, data: { elo: newEloA } }),
            prisma.profile.update({ where: { userId: targetId }, data: { elo: newEloB } })
          ]);
          console.log(`[Sync ELO Fallback] Swiper ELO updated to ${newEloA}, Target ELO to ${newEloB}`);
        }
      } catch (syncErr) {
        console.error('Failed to run sync ELO fallback calculation:', syncErr.message);
      }
    }

    let isMatch = false;
    let match = null;

    // 4. Handle mutual match detection
    if (rating === 'like') {
      const targetSwipe = await prisma.swipe.findUnique({
        where: {
          swiperId_targetId: {
            swiperId: targetId,
            targetId: swiperId
          }
        }
      });

      if (targetSwipe && targetSwipe.rating === 'like') {
        isMatch = true;

        // Check for existing match
        const existingMatch = await prisma.match.findFirst({
          where: {
            OR: [
              { user1Id: swiperId, user2Id: targetId },
              { user1Id: targetId, user2Id: swiperId }
            ]
          }
        });

        if (!existingMatch) {
          match = await prisma.match.create({
            data: {
              user1Id: swiperId,
              user2Id: targetId
            }
          });

          // Publish match event to Redis PubSub
          if (redisClient.isOpen) {
            try {
              await redisClient.publish('match_events', JSON.stringify({
                matchId: match.id,
                user1Id: swiperId,
                user2Id: targetId
              }));
            } catch (pubErr) {
              console.error('Failed to publish match event to Redis:', pubErr.message);
            }
          }
        } else {
          match = existingMatch;
        }
      }
    }

    res.json({
      message: isMatch ? 'It is a Match!' : 'Swipe registered',
      swipe,
      isMatch,
      match
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record swipe action' });
  }
});

// GET /api/swipe/matches
router.get('/matches', authenticateToken, async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: req.userId },
          { user2Id: req.userId }
        ]
      }
    });

    // Extract other user profile info
    const matchedProfiles = await Promise.all(
      matches.map(async (m) => {
        const otherUserId = m.user1Id === req.userId ? m.user2Id : m.user1Id;
        const profile = await prisma.profile.findUnique({
          where: { userId: otherUserId },
          include: { photos: true }
        });
        return {
          matchId: m.id,
          createdAt: m.createdAt,
          profile
        };
      })
    );

    res.json(matchedProfiles.filter(p => p.profile !== null));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve matches' });
  }
});

// GET /api/swipe/matches/:matchId/messages
router.get('/matches/:matchId/messages', authenticateToken, async (req, res) => {
  const { matchId } = req.params;
  const userId = req.userId;

  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await prisma.message.findMany({
      where: { matchId },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve message history' });
  }
});

// POST /api/swipe/matches/:matchId/read
router.post('/matches/:matchId/read', authenticateToken, async (req, res) => {
  const { matchId } = req.params;
  const userId = req.userId;

  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.message.updateMany({
      where: {
        matchId,
        senderId: { not: userId },
        read: false
      },
      data: {
        read: true
      }
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

export default router;
