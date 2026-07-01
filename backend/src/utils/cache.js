import { redisClient } from '../config/redis.js';
import logger from './logger.js';

export const cacheHelper = {
  async get(key) {
    if (!redisClient.isReady) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.error(`Cache Get Error: ${err.message}`);
      return null;
    }
  },
  
  async set(key, value, expiry = 3600) {
    if (!redisClient.isReady) return;
    try {
      await redisClient.setEx(key, expiry, JSON.stringify(value));
    } catch (err) {
      logger.error(`Cache Set Error: ${err.message}`);
    }
  },

  async del(key) {
    if (!redisClient.isReady) return;
    try {
      await redisClient.del(key);
    } catch (err) {
      logger.error(`Cache Del Error: ${err.message}`);
    }
  }
};
