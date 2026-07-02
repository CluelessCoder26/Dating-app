import { Queue } from 'bullmq';
import { env } from './env.js';
import logger from '../utils/logger.js';

let connectionConfig = { host: '127.0.0.1', port: 6379 };

try {
  const parsed = new URL(env.REDIS_URL);
  connectionConfig = {
    host: parsed.hostname,
    port: parseInt(parsed.port || '6379', 10),
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    username: parsed.username ? decodeURIComponent(parsed.username) : undefined
  };
} catch (e) {
  logger.warn('Failed to parse REDIS_URL, using default localhost connection for BullMQ');
}

class QueueManager {
  constructor() {
    this.queues = new Map();
  }

  getQueue(queueName) {
    if (env.USE_REDIS === 'false') {
      return {
        add: async () => { throw new Error('Redis disabled; Jobs will run synchronously.'); }
      };
    }

    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, { 
        connection: connectionConfig,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000
          },
          removeOnComplete: true,
          removeOnFail: 1000 // Keep last 1000 failed jobs
        }
      });
      
      queue.on('error', (err) => {
        logger.error(`BullMQ Queue [${queueName}] Error: ${err.message}`);
      });

      this.queues.set(queueName, queue);
      logger.info(`BullMQ Queue [${queueName}] initialized.`);
    }

    return this.queues.get(queueName);
  }
}

export const queueManager = new QueueManager();
export const eloQueue = queueManager.getQueue('eloQueue');
export const msgPersistenceQueue = queueManager.getQueue('msgPersistenceQueue');
export const pushNotificationQueue = queueManager.getQueue('pushNotificationQueue');
export const photoVerificationQueue = queueManager.getQueue('photoVerificationQueue');
export const deadLetterQueue = queueManager.getQueue('deadLetterQueue');

export const discoveryRefreshQueue = queueManager.getQueue('discoveryRefreshQueue');
export const popularityRefreshQueue = queueManager.getQueue('popularityRefreshQueue');
export const eloUpdateQueue = queueManager.getQueue('eloUpdateQueue');
export const matchProcessingQueue = queueManager.getQueue('matchProcessingQueue');
export const analyticsQueue = queueManager.getQueue('analyticsQueue');

// Phase 7: Real-Time Engine
export const messagePersistenceQueue = queueManager.getQueue('messagePersistenceQueue');
export const deliveryQueue = queueManager.getQueue('deliveryQueue');
export const notificationQueue = queueManager.getQueue('notificationQueue');
export const cleanupQueue = queueManager.getQueue('cleanupQueue');

// Phase 8: Trust & Safety Engine
export const moderationQueue = queueManager.getQueue('moderationQueue');
export const riskQueue = queueManager.getQueue('riskQueue');
export const appealQueue = queueManager.getQueue('appealQueue');
export const reputationQueue = queueManager.getQueue('reputationQueue');

// Phase 9: Growth & Monetization Engine
export const subscriptionQueue = queueManager.getQueue('subscriptionQueue');
export const billingQueue = queueManager.getQueue('billingQueue');
export const rewardQueue = queueManager.getQueue('rewardQueue');
export const referralQueue = queueManager.getQueue('referralQueue');
export const experimentQueue = queueManager.getQueue('experimentQueue');
export const promotionQueue = queueManager.getQueue('promotionQueue');

// Phase 10: AIOS Engine
export const compatibilityQueue = queueManager.getQueue('compatibilityQueue');
export const embeddingQueue = queueManager.getQueue('embeddingQueue');
export const summaryQueue = queueManager.getQueue('summaryQueue');
export const suggestionQueue = queueManager.getQueue('suggestionQueue');
export const aiNotificationQueue = queueManager.getQueue('aiNotificationQueue');
export const aiRecommendationQueue = queueManager.getQueue('aiRecommendationQueue');
export const aiModerationQueue = queueManager.getQueue('aiModerationQueue');

