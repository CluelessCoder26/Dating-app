import express from 'express';
import prisma from '../config/prisma.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

const router = express.Router();

// POST /api/block
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const { blockedId } = req.body;
  const blockerId = req.userId;

  if (!blockedId) {
    throw new ValidationError('blockedId is required');
  }

  if (blockerId === blockedId) {
    throw new ValidationError('You cannot block yourself');
  }

  // 1. Create block relation
  const block = await prisma.block.upsert({
    where: {
      blockerId_blockedId: { blockerId, blockedId }
    },
    update: {},
    create: { blockerId, blockedId }
  });

  // 2. Remove any existing Match between these users
  await prisma.match.deleteMany({
    where: {
      OR: [
        { user1Id: blockerId, user2Id: blockedId },
        { user1Id: blockedId, user2Id: blockerId }
      ]
    }
  });

  // 3. Delete swipes between them to prevent re-matching
  await prisma.swipe.deleteMany({
    where: {
      OR: [
        { swiperId: blockerId, targetId: blockedId },
        { swiperId: blockedId, targetId: blockerId }
      ]
    }
  });

  res.json({ success: true });
}));

// DELETE /api/block/:blockedId
router.delete('/:blockedId', authenticateToken, asyncHandler(async (req, res) => {
  const { blockedId } = req.params;
  const blockerId = req.userId;

  await prisma.block.delete({
    where: {
      blockerId_blockedId: { blockerId, blockedId }
    }
  });

  res.json({ success: true });
}));

// GET /api/block
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const blockerId = req.userId;

  const blocked = await prisma.block.findMany({
    where: { blockerId }
  });

  const blockedProfiles = await Promise.all(
    blocked.map(async (b) => {
      const user = await prisma.user.findUnique({
        where: { id: b.blockedId }
      });
      return {
        id: b.id,
        blockedId: b.blockedId,
        blockedPhone: user ? user.phone : 'Unknown'
      };
    })
  );

  res.json(blockedProfiles);
}));

export default router;
