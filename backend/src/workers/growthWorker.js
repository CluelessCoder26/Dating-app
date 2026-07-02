import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import { growthEngine } from '../services/growth/GrowthEngine.js';

export const setupGrowthWorkers = () => {
  const subscriptionWorker = new Worker('subscriptionQueue', async (job) => {
    logger.info(`[SubscriptionWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const billingWorker = new Worker('billingQueue', async (job) => {
    logger.info(`[BillingWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const rewardWorker = new Worker('rewardQueue', async (job) => {
    logger.info(`[RewardWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const referralWorker = new Worker('referralQueue', async (job) => {
    logger.info(`[ReferralWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const experimentWorker = new Worker('experimentQueue', async (job) => {
    logger.info(`[ExperimentWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  const promotionWorker = new Worker('promotionQueue', async (job) => {
    logger.info(`[PromotionWorker] Processing job ${job.id}`);
  }, { connection: { url: env.REDIS_URL } });

  return {
    subscriptionWorker,
    billingWorker,
    rewardWorker,
    referralWorker,
    experimentWorker,
    promotionWorker
  };
};
