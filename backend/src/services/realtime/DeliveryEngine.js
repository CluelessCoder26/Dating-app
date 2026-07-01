import { messagePersistenceQueue, deliveryQueue } from '../../config/bullmq.js';
import { conversationService } from './conversation.service.js';
import { presenceEngine } from './PresenceEngine.js';
import { AuthorizationError } from '../../utils/errors.js';
import logger from '../../utils/logger.js';
import crypto from 'crypto';

class DeliveryEngine {
  /**
   * Primary entry point for new messages
   */
  async processOutboundMessage({ senderId, conversationId, content, type }) {
    // 1. Validate Access
    const conv = await conversationService.getConversation(conversationId, senderId);
    if (!conv) throw new AuthorizationError('Unauthorized access to conversation');

    // Generate idempotency / temporary ID
    const tempId = crypto.randomUUID();
    const payload = {
      tempId,
      senderId,
      conversationId,
      content,
      type: type || 'TEXT',
      timestamp: new Date().toISOString()
    };

    // 2. Queue for Persistence (DB Write)
    await messagePersistenceQueue.add('persistMessage', payload);

    // 3. Queue for Real-Time Delivery
    await deliveryQueue.add('deliverMessage', { ...payload, participants: conv.participants });

    return { success: true, tempId, status: 'SENT' };
  }
}

export const deliveryEngine = new DeliveryEngine();
