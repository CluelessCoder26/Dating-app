import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import prisma from '../config/prisma.js';
import { socketManager } from '../sockets/SocketManager.js';
import { presenceEngine } from '../services/realtime/PresenceEngine.js';

export const setupRealtimeWorkers = () => {
  // 1. Persistence Worker (Writes to DB asynchronously)
  const persistenceWorker = new Worker('messagePersistenceQueue', async (job) => {
    const { tempId, senderId, conversationId, content, type, timestamp } = job.data;
    
    logger.info(`[Persistence] Saving message ${tempId}`);
    
    // Create actual DB Message
    const msg = await prisma.message.create({
      data: {
        id: tempId, // We use the tempId as the primary key so client resolves immediately
        conversationId,
        senderId,
        type,
        content,
        createdAt: new Date(timestamp)
      }
    });

    // Update conversation lastMessageId
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageId: msg.id }
    });

  }, { connection: { url: env.REDIS_URL } });

  // 2. Delivery Worker (Pushes to active Sockets or Notification Queue)
  const deliveryWorker = new Worker('deliveryQueue', async (job) => {
    const { tempId, senderId, conversationId, content, type, timestamp, participants } = job.data;
    
    logger.info(`[Delivery] Processing message ${tempId}`);

    for (const p of participants) {
      if (p.userId === senderId) continue; // Don't bounce back to sender

      const presence = await presenceEngine.getPresence(p.userId);
      const io = socketManager.getIO();
      if (presence.status === 'online' && io) {
        // Emit natively through WebSocket if online
        io.to(`user_${p.userId}`).emit('message.delivered', {
          id: tempId,
          conversationId,
          senderId,
          type,
          content,
          createdAt: timestamp
        });
        
        // Mark status delivered in DB
        await prisma.messageStatus.create({
          data: { messageId: tempId, userId: p.userId, status: 'DELIVERED' }
        });
      } else {
        // Offline: Queue a push notification
        const { notificationQueue } = await import('../config/bullmq.js');
        await notificationQueue.add('offlineMessagePush', {
          userId: p.userId,
          messageId: tempId,
          conversationId
        });
      }
    }
  }, { connection: { url: env.REDIS_URL } });

  return { persistenceWorker, deliveryWorker };
};
