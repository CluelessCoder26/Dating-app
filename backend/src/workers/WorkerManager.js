import { Worker } from 'bullmq';
import { env } from '../config/env.js';
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
} catch (e) {}

class WorkerManager {
  constructor() {
    this.workers = new Map();
  }

  registerWorker(queueName, processor) {
    if (env.USE_REDIS === 'false') {
      logger.warn(`Worker for ${queueName} skipped (Redis disabled)`);
      return;
    }

    const worker = new Worker(queueName, processor, { connection: connectionConfig });

    worker.on('completed', (job) => {
      logger.info(`Job ${job.id} completed in ${queueName}`);
    });

    worker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} failed in ${queueName}: ${err.message}`);
    });

    worker.on('error', (err) => {
      logger.error(`Worker [${queueName}] Error: ${err.message}`);
    });

    this.workers.set(queueName, worker);
    logger.info(`Worker for ${queueName} registered successfully.`);
  }

  async shutdown() {
    logger.info('Shutting down BullMQ workers...');
    const closePromises = Array.from(this.workers.values()).map(worker => worker.close());
    await Promise.all(closePromises);
    logger.info('All BullMQ workers shut down gracefully.');
  }
}

export const workerManager = new WorkerManager();
