import { recommendationEngine } from './recommendationEngine.js';
import { profileService } from '../profile.service.js';
import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';
import { recommendationConfig } from '../../config/recommendation.js';

export const discoveryService = {
  /**
   * Retrieves recommended profiles, leveraging Redis caching
   */
  async getDiscoveryFeed(userId, page = 1) {
    const cacheKey = `discovery:${userId}:page:${page}`;
    
    // 1. Check Redis Cache
    let cachedData = null;
    if (redisManager.isHealthy()) {
      cachedData = await redisManager.get(cacheKey);
    }
    let cacheHit = false;

    if (cachedData) {
      cacheHit = true;
      // Record analytics asynchronously
      this.recordMetrics(userId, 'requested', null, true).catch(() => {});
      return JSON.parse(cachedData);
    }

    // 2. Fetch User and Preferences
    const currentUser = await profileService.getProfileByUserId(userId);
    
    if (!currentUser) {
      throw new NotFoundError('Profile not found. Please complete onboarding.');
    }
    if (currentUser.latitude == null || currentUser.longitude == null) {
      throw new ValidationError('Location must be set before accessing discovery.');
    }

    const preferences = await profileService.getPreferences(userId);

    // 3. Generate Recommendations via the Strategy Pipeline
    const limit = recommendationConfig.pageSize;
    const recommendations = await recommendationEngine.getRecommendations(currentUser, preferences, limit);

    // 4. Cache in Redis (TTL: 5 minutes to keep freshness)
    if (redisManager.isHealthy()) {
      await redisManager.setEx(cacheKey, 300, JSON.stringify(recommendations));
    }
    
    // Record analytics asynchronously
    this.recordMetrics(userId, 'requested', null, false).catch(() => {});

    return recommendations;
  },

  async recordMetrics(userId, action, targetId = null, cacheHit = false) {
    try {
      await prisma.discoveryMetric.create({
        data: {
          userId,
          action,
          targetId,
          cacheHit
        }
      });
    } catch (error) {
      // Metrics shouldn't break the application, log and swallow
      console.error('Failed to log discovery metric:', error.message);
    }
  },

  async updatePreferences(userId, updateData) {
    const pref = await profileService.updatePreferences(userId, updateData);
    
    // Invalidate discovery caches for this user
    const pattern = `discovery:${userId}:*`;
    await redisManager.deletePattern(pattern);

    return pref;
  }
};
