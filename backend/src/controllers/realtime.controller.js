import { conversationService } from '../services/realtime/conversation.service.js';
import { deliveryEngine } from '../services/realtime/DeliveryEngine.js';
import prisma from '../config/prisma.js';
import { AuthorizationError } from '../utils/errors.js';

export const realtimeController = {
  // GET /api/conversations
  async getConversations(req, res) {
    const convs = await conversationService.getUserConversations(req.userId);
    res.json(convs);
  },

  // GET /api/conversations/:id
  async getConversation(req, res) {
    const conv = await conversationService.getConversation(req.params.id, req.userId);
    res.json(conv);
  },

  // GET /api/messages/:conversationId
  async getMessages(req, res) {
    const { conversationId } = req.params;
    
    // Auth check implicitly using conversationService
    await conversationService.getConversation(conversationId, req.userId);
    
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { attachments: true }
    });

    res.json(messages.reverse()); // Chronological order
  },

  // POST /api/messages
  async sendMessage(req, res) {
    const { conversationId, content, type } = req.body;
    
    // Delivery Engine handles Auth check, Redis streams, BullMQ handoff asynchronously
    const result = await deliveryEngine.processOutboundMessage({
      senderId: req.userId,
      conversationId,
      content,
      type
    });
    
    res.json(result); // Returns 200 OK immediately with temporary ID
  },

  // PATCH /api/messages/read
  async markRead(req, res) {
    const { messageIds } = req.body;
    
    // Natively update status
    await prisma.messageStatus.updateMany({
      where: { messageId: { in: messageIds }, userId: req.userId },
      data: { status: 'READ' }
    });
    
    res.json({ success: true });
  }
};
