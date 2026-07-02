import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';
import { eventBus } from '../../events/eventBus.js';
import logger from '../../utils/logger.js';

class ReputationEngine {
  async initializeReputation(userId) {
    return await prisma.reputation.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  }

  async getReputation(userId) {
    if (!redisManager) {
      return await prisma.reputation.findUnique({ where: { userId } });
    }

    const cached = await redisManager.get(`reputation:${userId}`);
    if (cached) return JSON.parse(cached);

    let rep = await prisma.reputation.findUnique({ where: { userId } });
    if (!rep) rep = await this.initializeReputation(userId);
    
    await redisManager.setEx(`reputation:${userId}`, 3600, JSON.stringify(rep));
    return rep;
  }

  async adjustScore(userId, type, amount) {
    const data = {};
    if (type === 'trust') data.trustScore = { increment: amount };
    if (type === 'safety') data.safetyScore = { increment: amount };
    if (type === 'reportCount') data.reportCount = { increment: amount };

    const rep = await prisma.reputation.update({
      where: { userId },
      data
    });

    if (redisManager.isHealthy()) {
      await redisManager.setEx(`reputation:${userId}`, 3600, JSON.stringify(rep));
    }

    logger.info(`[Reputation] Adjusted ${type} by ${amount} for User ${userId}`);
    return rep;
  }
}

export const reputationEngine = new ReputationEngine();
