import redisManager from '../../config/redis.js';
import logger from '../../utils/logger.js';

class PresenceEngine {
  /**
   * Mark user as online
   */
  async setOnline(userId, socketId) {
    if (!redisManager) return;
    
    // Store mapping of user -> multiple sockets
    await redisManager.addToSet(`presence:${userId}:sockets`, socketId);
    
    // Set global online status
    await redisManager.hashSet(`presence:${userId}`, {
      status: 'online',
      lastSeen: new Date().toISOString()
    });
    
    logger.info(`[Presence] User ${userId} is online (Socket: ${socketId})`);
  }

  /**
   * Mark specific socket as offline. If no sockets left, user is offline.
   */
  async setOffline(userId, socketId) {
    if (!redisManager) return;

    await redisManager.removeFromSet(`presence:${userId}:sockets`, socketId);
    const activeSockets = await redisManager.scard(`presence:${userId}:sockets`);

    if (activeSockets === 0) {
      await redisManager.hashSet(`presence:${userId}`, {
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
    if (!redisManager) return { status: 'unknown' };
    const data = await redisManager.hashGetAll(`presence:${userId}`);
    return data && data.status ? data : { status: 'offline' };
  }

  /**
   * Get all active sockets for a user
   */
  async getUserSockets(userId) {
    if (!redisManager) return [];
    return await redisManager.getMembers(`presence:${userId}:sockets`);
  }
}

export const presenceEngine = new PresenceEngine();
