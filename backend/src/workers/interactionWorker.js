import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import { matchEngine } from '../services/interaction/MatchEngine.js';
import { analyticsService } from '../services/interaction/AnalyticsService.js';
import { deadLetterQueue } from '../config/bullmq.js';

export const setupInteractionWorkers = () => {
  // 1. Match Processing Worker
  const matchWorker = new Worker('matchProcessingQueue', async (job) => {
    logger.info(`Processing potential match check for ${job.data.actorId}`);
    await matchEngine.detectMatch(job.data);
  }, { connection: { url: env.REDIS_URL }, concurrency: 5 });

  // 2. Analytics Worker
  const analyticsWorker = new Worker('analyticsQueue', async (job) => {
    if (job.name === 'trackInteraction') {
      await analyticsService.trackInteraction(job.data);
    } else if (job.name === 'trackMatch') {
      await analyticsService.trackMatch(job.data);
    }
  }, { connection: { url: env.REDIS_URL } });

  // Event Handlers for DLQ
  [matchWorker, analyticsWorker].forEach(worker => {
    worker.on('failed', async (job, err) => {
      logger.error(`[${worker.name}] Job ${job?.id} failed: ${err.message}`);
      if (job.attemptsMade >= job.opts.attempts) {
        await deadLetterQueue.add('failedInteractionJob', {
          queue: worker.name,
          jobData: job.data,
          error: err.message
        });
      }
    });
  });

  return { matchWorker, analyticsWorker };
};
