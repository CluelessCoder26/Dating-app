import prisma from '../../config/prisma.js';

export const eligibilityEngine = {
  /**
   * Generates a Prisma filter object excluding blocked, swiped, deleted, etc.
   * @param {Object} currentUser Profile of the user requesting discovery
   * @param {Object} preferences Preference model of the user
   * @returns {Object} Prisma 'where' clause object
   */
  async generateEligibilityFilters(currentUser, preferences) {
    const userId = currentUser.userId;

    // 1. Get exclusion IDs natively to prevent huge IN clauses if possible,
    // though Prisma requires us to pass array for 'notIn' unless we use raw queries.
    // Given the constraints to use Prisma gracefully, we extract IDs.
    // In production scale, this could be cached in Redis natively or done via raw SQL.
    const swiped = await prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { targetId: true }
    });
    
    const blocked = await prisma.block.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedId: userId }]
      },
      select: { blockerId: true, blockedId: true }
    });

    // 2. Aggregate Excluded IDs
    const swipedIds = swiped.map(s => s.targetId);
    const blockedIds = blocked.map(b => b.blockerId === userId ? b.blockedId : b.blockerId);
    
    const excludedIds = Array.from(new Set([...swipedIds, ...blockedIds, userId]));

    // 3. Gender Filter based on Preferences
    const genderFilter = preferences.preferredGender === 'everyone' 
      ? {} 
      : { gender: preferences.preferredGender };

    // 4. Age Filters
    const ageFilter = {
      age: {
        gte: preferences.minAge,
        lte: preferences.maxAge
      }
    };

    // 5. Visibility / Status Filters
    const visibilityFilter = {
      user: {
        status: 'active',           // Not banned, deactivated, locked
        deletedAt: null,            // Not soft deleted
      }
    };

    // Note: Distance filtering using pure Prisma without PostGIS requires loading a bounding box 
    // or filtering post-query. We will implement a basic bounding box around the user's lat/long 
    // here to let PostgreSQL do 99% of the heavy lifting.
    // 1 degree latitude ~ 69 miles. 1 degree longitude ~ 69 miles at equator (less elsewhere).
    const distanceThresholdMiles = preferences.maxDistance || 50;
    const latDelta = distanceThresholdMiles / 69.0;
    const lonDelta = distanceThresholdMiles / (69.0 * Math.cos(currentUser.latitude * (Math.PI / 180)));

    const locationFilter = {
      latitude: {
        gte: currentUser.latitude - latDelta,
        lte: currentUser.latitude + latDelta
      },
      longitude: {
        gte: currentUser.longitude - lonDelta,
        lte: currentUser.longitude + lonDelta
      }
    };

    return {
      userId: { notIn: excludedIds },
      ...genderFilter,
      ...ageFilter,
      ...visibilityFilter,
      ...locationFilter
    };
  }
};
