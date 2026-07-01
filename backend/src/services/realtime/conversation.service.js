import prisma from '../../config/prisma.js';
import { NotFoundError } from '../../utils/errors.js';

export const conversationService = {
  /**
   * Retrieves all conversations for a user
   */
  async getUserConversations(userId) {
    const participants = await prisma.participant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: true,
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });
    
    return participants.map(p => p.conversation);
  },

  /**
   * Get single conversation
   */
  async getConversation(conversationId, userId) {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true
      }
    });

    if (!conversation) throw new NotFoundError('Conversation not found');

    const isMember = conversation.participants.some(p => p.userId === userId);
    if (!isMember) throw new NotFoundError('Conversation not found');

    return conversation;
  },

  /**
   * Initialize a conversation between two matched users natively
   */
  async initializeConversation(matchId, user1Id, user2Id) {
    return await prisma.conversation.upsert({
      where: { matchId },
      update: {},
      create: {
        matchId,
        participants: {
          create: [
            { userId: user1Id },
            { userId: user2Id }
          ]
        }
      },
      include: { participants: true }
    });
  }
};
