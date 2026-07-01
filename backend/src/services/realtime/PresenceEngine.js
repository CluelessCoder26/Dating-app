import redisManager from '../../config/redis.js';
import logger from '../../utils/logger.js';

class PresenceEngine {
  /**
   * Mark user as online
   */
  async setOnline(userId, socketId) {
    if (!redisManager.client) return;
    
    // Store mapping of user -> multiple sockets
    await redisManager.client.sadd(`presence:${userId}:sockets`, socketId);
    
    // Set global online status
    await redisManager.client.hset(`presence:${userId}`, {
      status: 'online',
      lastSeen: new Date().toISOString()
    });
    
    logger.info(`[Presence] User ${userId} is online (Socket: ${socketId})`);
  }

  /**
   * Mark specific socket as offline. If no sockets left, user is offline.
   */
  async setOffline(userId, socketId) {
    if (!redisManager.client) return;

    await redisManager.client.srem(`presence:${userId}:sockets`, socketId);
    const activeSockets = await redisManager.client.scard(`presence:${userId}:sockets`);

    if (activeSockets === 0) {
      await redisManager.client.hset(`presence:${userId}`, {
        status: 'offline',
        lastSeen: new Date().toISOString()
      });
      logger.info(`[Presence] User ${userId} is fully offline`);
    }
  }

  /**
   * Get user presence
   */
  async getPresence(userId) {
    if (!redisManager.client) return { status: 'unknown' };
    const data = await redisManager.client.hgetall(`presence:${userId}`);
    return data && data.status ? data : { status: 'offline' };
  }

  /**
   * Get all active sockets for a user
   */
  async getUserSockets(userId) {
    if (!redisManager.client) return [];
    return await redisManager.client.smembers(`presence:${userId}:sockets`);
  }
}

export const presenceEngine = new PresenceEngine();
