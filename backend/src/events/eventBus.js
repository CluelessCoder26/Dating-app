import {
  matchProcessingQueue,
  eloUpdateQueue,
  analyticsQueue,
  discoveryRefreshQueue
} from '../config/bullmq.js';
import logger from '../utils/logger.js';

class EventBus {
  /**
   * Dispatches an interaction event to all listening background queues asynchronously.
   * @param {string} eventType e.g., 'SWIPE_CREATED'
   * @param {Object} payload 
   */
  async publish(eventType, payload) {
    logger.info(`[EventBus] Publishing ${eventType}`);

    try {
      switch (eventType) {
        case 'SWIPE_CREATED':
          // 1. Dispatch Match Engine Check
          if (payload.action === 'LIKE' || payload.action === 'SUPER_LIKE') {
            await matchProcessingQueue.add('detectMatch', payload);
          }
          
          // 2. Dispatch ELO Rating adjustments
          await eloUpdateQueue.add('processElo', payload);
          
          // 3. Dispatch Analytics tracking
          await analyticsQueue.add('trackInteraction', payload);
          
          // 4. Force Discovery refresh for actor (since they shouldn't see target again)
          await discoveryRefreshQueue.add('refreshCache', { userId: payload.actorId });
          break;

        case 'MATCH_CREATED':
          // Notifications and Analytics
          await analyticsQueue.add('trackMatch', payload);
          break;
          
        default:
          logger.warn(`[EventBus] Unhandled event type: ${eventType}`);
      }
    } catch (err) {
      logger.error(`[EventBus] Failed to publish ${eventType}: ${err.message}`);
    }
  }
}

export const eventBus = new EventBus();
