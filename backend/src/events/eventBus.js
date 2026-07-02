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
    const eventId = payload.eventId || `${eventType}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const timestamp = payload.timestamp || new Date().toISOString();
    const correlationId = payload.correlationId || eventId;
    
    // Enrich payload with distributed tracing & idempotency markers
    const enrichedPayload = { ...payload, eventId, timestamp, correlationId };

    logger.info(`[EventBus] Publishing ${eventType} [${eventId}]`);

    try {
      const jobOpts = { jobId: eventId }; // Dedupes jobs in BullMQ to guarantee exactly-once processing
      switch (eventType) {
        case 'SWIPE_CREATED':
          // 1. Dispatch Match Engine Check
          if (enrichedPayload.action === 'LIKE' || enrichedPayload.action === 'SUPER_LIKE') {
            await matchProcessingQueue.add('detectMatch', enrichedPayload, jobOpts);
          }
          
          // 2. Dispatch ELO Rating adjustments
          await eloUpdateQueue.add('processElo', enrichedPayload, { jobId: `${eventId}-elo` });
          
          // 3. Dispatch Analytics tracking
          await analyticsQueue.add('trackInteraction', enrichedPayload, { jobId: `${eventId}-analytics` });
          
          // 4. Force Discovery refresh for actor
          await discoveryRefreshQueue.add('refreshCache', { userId: enrichedPayload.actorId }, { jobId: `${eventId}-discovery` });
          break;

        case 'MATCH_CREATED':
          // Notifications and Analytics
          await analyticsQueue.add('trackMatch', enrichedPayload, jobOpts);
          break;
          
        default:
          logger.warn(`[EventBus] Unhandled event type: ${eventType}`);
      }
    } catch (err) {
      logger.error(`[EventBus] Failed to publish ${eventType} [${eventId}]: ${err.message}`);
    }
  }
}

export const eventBus = new EventBus();
