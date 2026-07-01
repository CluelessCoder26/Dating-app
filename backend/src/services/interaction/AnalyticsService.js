import prisma from '../../config/prisma.js';
import logger from '../../utils/logger.js';

class AnalyticsService {
  async trackInteraction(payload) {
    // Already tracked inside interactionHistory via API synchronously,
    // this can be used to stream to external Data Warehouses (Snowflake, BigQuery).
    logger.info(`[Analytics] Tracked ${payload.action} by ${payload.actorId}`);
  }

  async trackMatch(payload) {
    // Record into a theoretical Analytics Warehouse
    logger.info(`[Analytics] Tracked MATCH ${payload.matchId}`);
  }
}

export const analyticsService = new AnalyticsService();
