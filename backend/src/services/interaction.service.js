import { swipeEngine } from './interaction/SwipeEngine.js';
import { likesReceivedService } from './interaction/likesReceived.service.js';
import prisma from '../config/prisma.js';
import { getExcludedUserIds } from './interaction/exclusion.service.js';

export const interactionService = {
  async processSwipe(actorId, targetId, action) {
    return swipeEngine.processSwipe(actorId, targetId, action);
  },

  async getHistory(userId) {
    return prisma.interactionHistory.findMany({
      where: { actorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  async getStats(userId) {
    const likes = await prisma.interactionHistory.count({
      where: { actorId: userId, action: { in: ['LIKE', 'SUPER_LIKE'] } },
    });
    const passes = await prisma.interactionHistory.count({
      where: { actorId: userId, action: 'PASS' },
    });
    const matches = await prisma.match.count({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
    });

    return { likes, passes, matches };
  },

  async getMatches(userId) {
    const { blockedIds } = await getExcludedUserIds(userId);

    const matches = await prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: { metadata: true },
    });

    return matches.filter((m) => {
      const otherId = m.user1Id === userId ? m.user2Id : m.user1Id;
      return !blockedIds.includes(otherId);
    });
  },

  getLikesReceived(userId, options) {
    return likesReceivedService.getLikesReceived(userId, options);
  },

  acceptLike(userId, likerId) {
    return likesReceivedService.acceptLike(userId, likerId);
  },

  rejectLike(userId, likerId) {
    return likesReceivedService.rejectLike(userId, likerId);
  },

  async deleteMatch(userId, matchId) {
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new Error('Match not found');

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.match.delete({ where: { id: matchId } });

    const [u1, u2] = [match.user1Id, match.user2Id].sort();
    await prisma.relationship.update({
      where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
      data: { status: 'UNKNOWN' },
    });

    return { success: true };
  },
};
