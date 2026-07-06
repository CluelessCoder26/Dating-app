import prisma from '../../config/prisma.js';

/**
 * Collects user IDs that must be excluded from discovery, likes, and match lists.
 */
export async function getExcludedUserIds(userId) {
  const [swiped, blocked, matches, reports] = await Promise.all([
    prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { targetId: true },
    }),
    prisma.block.findMany({
      where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
      select: { blockerId: true, blockedId: true },
    }),
    prisma.match.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      select: { user1Id: true, user2Id: true },
    }),
    prisma.report.findMany({
      where: {
        status: { in: ['PENDING', 'REVIEWING'] },
        OR: [{ reporterId: userId }, { reportedId: userId }],
      },
      select: { reporterId: true, reportedId: true },
    }),
  ]);

  const swipedIds = swiped.map((s) => s.targetId);
  const blockedIds = blocked.map((b) => (b.blockerId === userId ? b.blockedId : b.blockerId));
  const matchedIds = matches.map((m) => (m.user1Id === userId ? m.user2Id : m.user1Id));
  const reportedIds = reports.flatMap((r) => [r.reporterId, r.reportedId]).filter((id) => id !== userId);

  const all = new Set([userId, ...swipedIds, ...blockedIds, ...matchedIds, ...reportedIds]);

  return {
    all: Array.from(all),
    swipedIds,
    blockedIds,
    matchedIds,
    reportedIds,
  };
}

export function isBlockedBetween(userId, otherId, blockedPairs) {
  return blockedPairs.some(
    (b) =>
      (b.blockerId === userId && b.blockedId === otherId) ||
      (b.blockerId === otherId && b.blockedId === userId)
  );
}
