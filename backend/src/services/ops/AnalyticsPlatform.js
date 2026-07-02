import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';

class AnalyticsPlatform {
  async getSystemDashboard() {
    const cacheKey = 'ops:dashboard:system';
    const cached = await redisManager.get(cacheKey);
    if (cached) {
      if (cached) return JSON.parse(cached);
    }

    const [totalUsers, activeUsers, totalMatches, totalMessages] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.match.count(),
      prisma.message.count()
    ]);

    const data = { totalUsers, activeUsers, totalMatches, totalMessages, timestamp: new Date() };
    if (redisManager.isHealthy()) {
      await redisManager.setEx(cacheKey, 60, JSON.stringify(data));
    }
    return data;
  }
}
export const analyticsPlatform = new AnalyticsPlatform();
