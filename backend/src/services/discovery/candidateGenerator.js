import prisma from '../../config/prisma.js';
import { eligibilityEngine } from './eligibilityEngine.js';

export const candidateGenerator = {
  /**
   * Retrieves raw candidates from PostgreSQL with stable ordering for pagination.
   */
  async generateCandidates(currentUser, preferences, { limit = 50, page = 1, cursor = null } = {}) {
    const filters = await eligibilityEngine.generateEligibilityFilters(currentUser, preferences);
    const pageSize = limit;
    const skip = cursor ? 0 : Math.max(0, (page - 1) * pageSize);

    const where = {
      ...filters,
      userId: cursor
        ? { notIn: filters.userId?.notIn ?? [], gt: cursor }
        : filters.userId,
    };

    const candidates = await prisma.profile.findMany({
      where,
      include: {
        photos: {
          orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }],
          take: 3,
        },
        user: {
          select: {
            id: true,
            lastLoginAt: true,
            emailVerified: true,
          },
        },
      },
      orderBy: { userId: 'asc' },
      skip,
      take: pageSize,
    });

    return candidates;
  },
};
