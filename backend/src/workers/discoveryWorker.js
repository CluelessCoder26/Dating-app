import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import redisManager from '../config/redis.js';
import prisma from '../config/prisma.js';

export const setupDiscoveryWorkers = () => {
  // 1. Discovery Cache Refresh Worker
  const discoveryWorker = new Worker('discoveryRefreshQueue', async (job) => {
    const { userId } = job.data;
    logger.info(`Refreshing Discovery Cache for user ${userId}`);
    
    // Nuke the existing cache keys so they get regenerated on next GET request.
    const pattern = `discovery:${userId}:*`;
    await redisManager.deletePattern(pattern);

  }, { connection: { url: env.REDIS_URL } });

  // 2. ELO Update Worker
  const eloWorker = new Worker('eloUpdateQueue', async (job) => {
    const { userId, targetId, action } = job.data; // action: 'like', 'pass', 'match'
    logger.info(`Updating ELO for interaction between ${userId} and ${targetId}`);
    
    // In a real ELO system, we'd calculate probabilities and adjust scores.
    // This serves as the placeholder execution.
    // e.g., if match -> +50 for both. if pass -> -10 for target.
    
    if (action === 'like') {
      await prisma.profile.update({
        where: { userId: targetId },
        data: { elo: { increment: 5 } }
      });
    } else if (action === 'pass') {
      await prisma.profile.update({
        where: { userId: targetId },
        data: { elo: { decrement: 2 } }
      });
    }

  }, { connection: { url: env.REDIS_URL } });

  discoveryWorker.on('failed', (job, err) => {
    logger.error(`DiscoveryRefresh Job ${job?.id} failed: ${err.message}`);
  });

  eloWorker.on('failed', (job, err) => {
    logger.error(`EloUpdate Job ${job?.id} failed: ${err.message}`);
  });

  return { discoveryWorker, eloWorker };
};
