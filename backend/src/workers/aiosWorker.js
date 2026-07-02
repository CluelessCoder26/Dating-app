import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import { compatibilityEngine } from '../services/aios/CompatibilityEngine.js';
import { embeddingEngine } from '../services/aios/EmbeddingEngine.js';

export const setupAIOSWorkers = () => {
  const compatibilityWorker = new Worker('compatibilityQueue', async (job) => {
    const { user1Id, user2Id } = job.data;
    logger.info(`[CompatibilityWorker] Processing ${user1Id} vs ${user2Id}`);
    await compatibilityEngine.calculateCompatibility(user1Id, user2Id);
  }, { connection: { url: env.REDIS_URL } });

  const embeddingWorker = new Worker('embeddingQueue', async (job) => {
    const { entityType, entityId, text } = job.data;
    logger.info(`[EmbeddingWorker] Processing ${entityType}:${entityId}`);
    await embeddingEngine.generateAndStore(entityType, entityId, text);
  }, { connection: { url: env.REDIS_URL } });

  const summaryWorker = new Worker('summaryQueue', async (job) => {
    logger.info(`[SummaryWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const suggestionWorker = new Worker('suggestionQueue', async (job) => {
    logger.info(`[SuggestionWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const aiNotificationWorker = new Worker('aiNotificationQueue', async (job) => {
    logger.info(`[AINotificationWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const aiRecommendationWorker = new Worker('aiRecommendationQueue', async (job) => {
    logger.info(`[AIRecommendationWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const aiModerationWorker = new Worker('aiModerationQueue', async (job) => {
    logger.info(`[AIModerationWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  return {
    compatibilityWorker, embeddingWorker, summaryWorker, suggestionWorker,
    aiNotificationWorker, aiRecommendationWorker, aiModerationWorker
  };
};
