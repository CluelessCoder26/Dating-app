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

  /**
   * Safely deletes keys matching a pattern using SCAN instead of KEYS
   * Handles large datasets safely without blocking Redis.
   */
  async deletePattern(pattern) {
    if (!this.client.isReady) return;
    try {
      let cursor = 0;
      do {
        // scan expects cursor to be a number/string. redis v4 scan returns { cursor, keys }
        const res = await this.client.scan(cursor, { MATCH: pattern, COUNT: 100 });
        cursor = res.cursor || 0;
        const keys = res.keys || [];
        
        if (keys.length > 0) {
          // unlink is non-blocking delete, safer for production
          if (typeof this.client.unlink === 'function') {
            await this.client.unlink(keys);
          } else {
            await this.client.del(keys);
          }
        }
      } while (cursor !== 0 && cursor !== '0');
    } catch (error) {
      logger.error(`Redis deletePattern failed for ${pattern}: ${error.message}`);
    }
  }

  async get(key) {
    if (!this.client.isReady) return null;
    try { return await this.client.get(key); }
    catch (e) { require('../utils/logger.js').default.error('Redis GET error for ' + key + ': ' + e.message); return null; }
  }

  async set(key, value, options) {
    if (!this.client.isReady) return null;
    try { return await this.client.set(key, value, options); }
    catch (e) { require('../utils/logger.js').default.error('Redis SET error for ' + key + ': ' + e.message); return null; }
  }

  async setEx(key, seconds, value) {
    if (!this.client.isReady) return null;
    try { return await this.client.setEx(key, seconds, value); }
    catch (e) { require('../utils/logger.js').default.error('Redis SETEX error for ' + key + ': ' + e.message); return null; }
  }

  async delete(key) {
    if (!this.client.isReady) return null;
    try { return await this.client.del(key); }
    catch (e) { require('../utils/logger.js').default.error('Redis DEL error for ' + key + ': ' + e.message); return null; }
  }

  async increment(key) {
    if (!this.client.isReady) return null;
    try { return await this.client.incr(key); }
    catch (e) { require('../utils/logger.js').default.error('Redis INCR error for ' + key + ': ' + e.message); return null; }
  }
  
  async decrement(key) {
    if (!this.client.isReady) return null;
    try { return await this.client.decr(key); }
    catch (e) { require('../utils/logger.js').default.error('Redis DECR error for ' + key + ': ' + e.message); return null; }
  }

  async expire(key, seconds) {
    if (!this.client.isReady) return null;
    try { return await this.client.expire(key, seconds); }
    catch (e) { require('../utils/logger.js').default.error('Redis EXPIRE error for ' + key + ': ' + e.message); return null; }
  }

  async addToSet(key, ...members) {
    if (!this.client.isReady) return null;
    try { return await this.client.sAdd(key, ...members); }
    catch (e) { require('../utils/logger.js').default.error('Redis SADD error for ' + key + ': ' + e.message); return null; }
  }

  async removeFromSet(key, ...members) {
    if (!this.client.isReady) return null;
    try { return await this.client.sRem(key, ...members); }
    catch (e) { require('../utils/logger.js').default.error('Redis SREM error for ' + key + ': ' + e.message); return null; }
  }

  async getMembers(key) {
    if (!this.client.isReady) return [];
    try { return await this.client.sMembers(key); }
    catch (e) { require('../utils/logger.js').default.error('Redis SMEMBERS error for ' + key + ': ' + e.message); return []; }
  }

  async isMember(key, member) {
    if (!this.client.isReady) return false;
    try { return await this.client.sIsMember(key, member); }
    catch (e) { require('../utils/logger.js').default.error('Redis SISMEMBER error for ' + key + ': ' + e.message); return false; }
  }

  async hashSet(key, field, value) {
    if (!this.client.isReady) return null;
    try { return await this.client.hSet(key, field, value); }
    catch (e) { require('../utils/logger.js').default.error('Redis HSET error for ' + key + ': ' + e.message); return null; }
  }

  async hashGet(key, field) {
    if (!this.client.isReady) return null;
    try { return await this.client.hGet(key, field); }
    catch (e) { require('../utils/logger.js').default.error('Redis HGET error for ' + key + ': ' + e.message); return null; }
  }

  async hashGetAll(key) {
    if (!this.client.isReady) return null;
    try { return await this.client.hGetAll(key); }
    catch (e) { require('../utils/logger.js').default.error('Redis HGETALL error for ' + key + ': ' + e.message); return null; }
  }

  async pushLeft(key, ...elements) {
    if (!this.client.isReady) return null;
    try { return await this.client.lPush(key, ...elements); }
    catch (e) { require('../utils/logger.js').default.error('Redis LPUSH error for ' + key + ': ' + e.message); return null; }
  }
  
  async pushRight(key, ...elements) {
    if (!this.client.isReady) return null;
    try { return await this.client.rPush(key, ...elements); }
    catch (e) { require('../utils/logger.js').default.error('Redis RPUSH error for ' + key + ': ' + e.message); return null; }
  }
  
  async publish(channel, message) {
    if (!this.client.isReady) return null;
    try { return await this.client.publish(channel, message); }
    catch (e) { require('../utils/logger.js').default.error('Redis PUBLISH error for ' + channel + ': ' + e.message); return null; }
  }

}

const redisManager = new RedisManager();
export const redisClient = redisManager.getClient();
export default redisManager;
