import { recommendationEngine } from './recommendationEngine.js';
import { profileService } from '../profile.service.js';
import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';
import { recommendationConfig } from '../../config/recommendation.js';

const EMPTY_FEED = {
  profiles: [],
  pagination: { page: 1, pageSize: recommendationConfig.pageSize, hasMore: false, nextCursor: null, count: 0 },
  empty: true,
  message: 'No more profiles to show right now. Check back later or adjust your filters.',
};

function buildFeedResponse(result, page) {
  const empty = !result.profiles || result.profiles.length === 0;
  return {
    profiles: result.profiles ?? [],
    pagination: result.pagination ?? {
      page,
      pageSize: recommendationConfig.pageSize,
      hasMore: false,
      nextCursor: null,
      count: 0,
    },
    empty,
    message: empty ? EMPTY_FEED.message : undefined,
  };
}

export const discoveryService = {
  async getDiscoveryFeed(userId, { page = 1, cursor = null } = {}) {
    const cacheKey = `discovery:${userId}:p${page}:c${cursor ?? 'none'}`;

    if (redisManager.isHealthy()) {
      const cachedData = await redisManager.get(cacheKey);
      if (cachedData) {
        this.recordMetrics(userId, 'requested', null, true).catch(() => {});
        return JSON.parse(cachedData);
      }
    }

    const currentUser = await profileService.getProfileByUserId(userId);

    if (!currentUser) {
      throw new NotFoundError('Profile not found. Please complete onboarding.');
    }
    if (currentUser.latitude == null || currentUser.longitude == null) {
      throw new ValidationError('Location must be set before accessing discovery.');
    }

    const preferences = await profileService.getPreferences(userId);

    const result = await recommendationEngine.getRecommendations(currentUser, preferences, {
      page,
      pageSize: recommendationConfig.pageSize,
      cursor,
    });

    const response = buildFeedResponse(result, page);

    if (redisManager.isHealthy()) {
      await redisManager.setEx(cacheKey, 300, JSON.stringify(response));
    }

    this.recordMetrics(userId, 'requested', null, false).catch(() => {});

    return response;
  },

  async recordMetrics(userId, action, targetId = null, cacheHit = false) {
    try {
      await prisma.discoveryMetric.create({
        data: { userId, action, targetId, cacheHit },
      });
    } catch (error) {
      if (error.code === 'P2003') return; // Ignore FK constraint if user was deleted asynchronously
      console.error('Failed to log discovery metric:', error.message);
    }
  },

  async updatePreferences(userId, updateData) {
    const pref = await profileService.updatePreferences(userId, updateData);
    await redisManager.deletePattern(`discovery:${userId}:*`);
    return pref;
  },
};
