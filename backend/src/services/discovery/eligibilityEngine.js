import prisma from '../../config/prisma.js';
import { getExcludedUserIds } from '../interaction/exclusion.service.js';

export const eligibilityEngine = {
  /**
   * Generates a Prisma filter object excluding blocked, swiped, matched, reported, hidden, etc.
   */
  async generateEligibilityFilters(currentUser, preferences) {
    const userId = currentUser.userId;
    const { all: excludedIds } = await getExcludedUserIds(userId);

    const genderFilter =
      preferences.preferredGender === 'everyone'
        ? {}
        : { gender: preferences.preferredGender };

    const ageFilter = {
      age: {
        gte: preferences.minAge,
        lte: preferences.maxAge,
      },
    };

    const distanceThresholdMiles = preferences.maxDistance || 50;
    const latDelta = distanceThresholdMiles / 69.0;
    const lonDelta =
      distanceThresholdMiles / (69.0 * Math.cos(currentUser.latitude * (Math.PI / 180)));

    const locationFilter = {
      latitude: {
        gte: currentUser.latitude - latDelta,
        lte: currentUser.latitude + latDelta,
      },
      longitude: {
        gte: currentUser.longitude - lonDelta,
        lte: currentUser.longitude + lonDelta,
      },
    };

    return {
      userId: { notIn: excludedIds },
      ...genderFilter,
      ...ageFilter,
      ...locationFilter,
      user: {
        status: 'active',
        deletedAt: null,
        deactivatedAt: null,
        preferences: {
          visibility: { not: 'hidden' },
          OR: [{ preferredGender: 'everyone' }, { preferredGender: currentUser.gender }],
        },
      },
    };
  },
};
