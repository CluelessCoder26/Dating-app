import express from 'express';
import prisma from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { eloQueue } from '../queues.js';
import redisClient from '../redis.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateDistanceMiles } from '../utils/distance.js';
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /api/swipe
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { targetId, rating } = req.body;
  const swiperId = req.userId;

  if (!targetId || !['like', 'nope'].includes(rating)) {
    throw new ValidationError('targetId and rating (like or nope) are required');
  }

  if (swiperId === targetId) {
    throw new ValidationError('You cannot swipe on yourself');
  }

  // 1. Check if the target user profile exists
  const targetProfile = await prisma.profile.findUnique({
    where: { userId: targetId }
  });

  if (!targetProfile) {
    throw new NotFoundError('Target profile not found');
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
    logger.warn(`⚠️ Failed to queue ELO recalculation on Redis, processing synchronously in database: ${qErr.message}`);
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
        logger.info(`[Sync ELO Fallback] Swiper ELO updated to ${newEloA}, Target ELO to ${newEloB}`);
      }
    } catch (syncErr) {
      logger.error(`Failed to run sync ELO fallback calculation: ${syncErr.message}`);
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
            logger.error(`Failed to publish match event to Redis: ${pubErr.message}`);
          }
        }
      } else {
        match = existingMatch;
      }
    }
  }

  res.json({
    isMatch,
    ...(match && { match: { id: match.id } })
  });
}));

// GET /api/swipe/matches
router.get('/matches', authenticateToken, asyncHandler(async (req, res) => {
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { user1Id: req.userId },
        { user2Id: req.userId }
      ]
    }
  });

  const myProfile = await prisma.profile.findUnique({ where: { userId: req.userId } });

  // Extract other user profile info
  const matchedProfiles = await Promise.all(
    matches.map(async (m) => {
      const otherUserId = m.user1Id === req.userId ? m.user2Id : m.user1Id;
      const profile = await prisma.profile.findUnique({
        where: { userId: otherUserId },
        include: { photos: true }
      });
      
      if (profile) {
        if (profile.photos) {
          profile.photos.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
        }
        if (myProfile) {
          profile.distanceMiles = parseFloat(calculateDistanceMiles(
            myProfile.latitude, 
            myProfile.longitude, 
            profile.latitude, 
            profile.longitude
          ).toFixed(2));
        }
      }
      
      return {
        matchId: m.id,
        profile
      };
    })
  );

  res.json(matchedProfiles.filter(p => p.profile !== null));
}));

// GET /api/swipe/matches/:matchId/messages
router.get('/matches/:matchId/messages', authenticateToken, asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const userId = req.userId;

  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) {
    throw new NotFoundError('Match not found');
  }

  if (match.user1Id !== userId && match.user2Id !== userId) {
    throw new AuthorizationError('Access denied');
  }

  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: 'asc' }
  });

  res.json(messages);
}));

// POST /api/swipe/matches/:matchId/read
router.post('/matches/:matchId/read', authenticateToken, asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const userId = req.userId;

  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) {
    throw new NotFoundError('Match not found');
  }

  if (match.user1Id !== userId && match.user2Id !== userId) {
    throw new AuthorizationError('Access denied');
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
}));

export default router;
