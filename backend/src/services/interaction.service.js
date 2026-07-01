import { swipeEngine } from './interaction/SwipeEngine.js';
import prisma from '../config/prisma.js';
import redisManager from '../config/redis.js';

export const interactionService = {
  async processSwipe(actorId, targetId, action) {
    return await swipeEngine.processSwipe(actorId, targetId, action);
  },

  async getHistory(userId) {
    return await prisma.interactionHistory.findMany({
      where: { actorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  },

  async getStats(userId) {
    // Analytics summary
    const likes = await prisma.interactionHistory.count({ where: { actorId: userId, action: 'LIKE' } });
    const passes = await prisma.interactionHistory.count({ where: { actorId: userId, action: 'PASS' } });
    const matches = await prisma.match.count({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] }
    });

    return { likes, passes, matches };
  },

  async getMatches(userId) {
    return await prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }]
      },
      include: {
        metadata: true
      }
    });
  },

  async deleteMatch(userId, matchId) {
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new Error('Match not found');
    
    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new Error('Unauthorized');
    }

    // Delete match, which cascades down to metadata and messages
    await prisma.match.delete({ where: { id: matchId } });

    // Update relationship to UNKNOWN or DELETED
    const [u1, u2] = [match.user1Id, match.user2Id].sort();
    await prisma.relationship.update({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
      data: { status: 'UNKNOWN' }
    });

    return { success: true };
  }
};
