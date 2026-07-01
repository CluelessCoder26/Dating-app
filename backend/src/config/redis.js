import { createClient } from 'redis';
import { env } from './env.js';
import logger from '../utils/logger.js';

class RedisManager {
  constructor() {
    this.client = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries >= 3) {
            logger.warn(`⚠️ Redis: gave up after ${retries} retries. Running without Redis cache.`);
            return false; // Stop retrying
          }
          return Math.min(retries * 1000, 3000); // Progressive backoff
        },
        connectTimeout: 5000
      }
    });

    this.client.on('error', (err) => {
      logger.error(`Redis Error: ${err.message}`);
    });

    this.client.on('connect', () => {
      logger.info('Redis connection established.');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready.');
    });

    this.client.on('end', () => {
      logger.info('Redis connection closed.');
    });

    this.client.on('reconnecting', () => {
      logger.warn('Redis client reconnecting...');
    });
  }

  async connect() {
    if (env.USE_REDIS === 'false') {
      logger.warn('⚠️ USE_REDIS is false. Redis client disabled.');
      return;
    }

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
    } catch (error) {
      logger.warn('⚠️ Redis Cache unavailable. Running in degraded mode (no caching).');
    }
  }

  async disconnect() {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  getClient() {
    return this.client;
  }

  isHealthy() {
    return this.client.isReady;
  }
}

const redisManager = new RedisManager();
export const redisClient = redisManager.getClient();
export default redisManager;
