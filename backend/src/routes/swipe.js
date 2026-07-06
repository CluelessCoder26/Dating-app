import express from 'express';
import prisma from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { eloQueue } from '../queues.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateDistanceMiles } from '../utils/distance.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';
import { processSwipe } from '../services/interaction/swipe.service.js';
import { getExcludedUserIds } from '../services/interaction/exclusion.service.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /api/swipe — legacy contract; delegates to unified swipe engine
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { targetId, rating } = req.body;
  const result = await processSwipe(req.userId, targetId, rating);

  eloQueue.add('recalculate', {
    swiperId: req.userId,
    targetId,
    rating: result.action,
  }).catch((qErr) => logger.warn(`ELO queue unavailable: ${qErr.message}`));

  res.json({
    isMatch: result.isMatch,
    ...(result.match && { match: result.match }),
  });
}));

// GET /api/swipe/matches
router.get('/matches', authenticateToken, asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { blockedIds } = await getExcludedUserIds(userId);

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  });

  const myProfile = await prisma.profile.findUnique({ where: { userId } });

  const matchedProfiles = await Promise.all(
    matches.map(async (m) => {
      const otherUserId = m.user1Id === userId ? m.user2Id : m.user1Id;

      if (blockedIds.includes(otherUserId)) {
        return null;
      }

      const profile = await prisma.profile.findUnique({
        where: { userId: otherUserId },
        include: { photos: true },
      });

      if (profile) {
        if (profile.photos) {
          profile.photos.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
        }
        if (myProfile) {
          profile.distanceMiles = parseFloat(
            calculateDistanceMiles(
              myProfile.latitude,
              myProfile.longitude,
              profile.latitude,
              profile.longitude
            ).toFixed(2)
          );
        }
      }

      return { matchId: m.id, profile };
    })
  );

  res.json(matchedProfiles.filter((p) => p?.profile !== null));
}));

// GET /api/swipe/matches/:matchId/messages
router.get('/matches/:matchId/messages', authenticateToken, asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const userId = req.userId;

  const match = await prisma.match.findUnique({ where: { id: matchId } });

  if (!match) {
    throw new NotFoundError('Match not found');
  }

  if (match.user1Id !== userId && match.user2Id !== userId) {
    throw new AuthorizationError('Access denied');
  }

  const conversation = await prisma.conversation.findUnique({
    where: { matchId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!conversation) {
    return res.json([]);
  }

  const messages = conversation.messages.map((m) => ({
    id: m.id,
    matchId,
    senderId: m.senderId,
    text: m.content,
    createdAt: m.createdAt,
  }));

  res.json(messages);
}));

// POST /api/swipe/matches/:matchId/read
router.post('/matches/:matchId/read', authenticateToken, asyncHandler(async (req, res) => {
  const { matchId } = req.params;
  const userId = req.userId;

  const match = await prisma.match.findUnique({ where: { id: matchId } });

  if (!match) {
    throw new NotFoundError('Match not found');
  }

  if (match.user1Id !== userId && match.user2Id !== userId) {
    throw new AuthorizationError('Access denied');
  }

  const conversation = await prisma.conversation.findUnique({ where: { matchId } });
  if (conversation) {
    await prisma.participant.updateMany({
      where: { conversationId: conversation.id, userId },
      data: { lastReadAt: new Date() },
    });
    await prisma.messageStatus.updateMany({
      where: {
        userId,
        message: { conversationId: conversation.id, senderId: { not: userId } },
        status: { not: 'READ' },
      },
      data: { status: 'READ' },
    });
  }

  res.json({ success: true });
}));

export default router;
