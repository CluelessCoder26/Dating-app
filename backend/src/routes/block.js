import express from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/block
router.post('/', authenticateToken, async (req, res) => {
  const { blockedId } = req.body;
  const blockerId = req.userId;

  if (!blockedId) {
    return res.status(400).json({ error: 'blockedId is required' });
  }

  if (blockerId === blockedId) {
    return res.status(400).json({ error: 'You cannot block yourself' });
  }

  try {
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

    res.json({ message: 'User blocked successfully', block });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

// DELETE /api/block/:blockedId
router.delete('/:blockedId', authenticateToken, async (req, res) => {
  const { blockedId } = req.params;
  const blockerId = req.userId;

  try {
    await prisma.block.delete({
      where: {
        blockerId_blockedId: { blockerId, blockedId }
      }
    });

    res.json({ message: 'User unblocked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unblock user or block relation not found' });
  }
});

// GET /api/block
router.get('/', authenticateToken, async (req, res) => {
  const blockerId = req.userId;

  try {
    const blocked = await prisma.block.findMany({
      where: { blockerId }
    });

    const blockedProfiles = await Promise.all(
      blocked.map(async (b) => {
        const profile = await prisma.profile.findUnique({
          where: { userId: b.blockedId },
          include: { photos: true }
        });
        return {
          blockId: b.id,
          createdAt: b.createdAt,
          profile
        };
      })
    );

    res.json(blockedProfiles.filter(p => p.profile !== null));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve blocked users' });
  }
});

export default router;
