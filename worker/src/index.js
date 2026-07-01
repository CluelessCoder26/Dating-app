import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Parse Redis URL
const redisUrlStr = process.env.REDIS_URL || 'redis://localhost:6379';
let connectionConfig = { host: '127.0.0.1', port: 6379 };

try {
  const parsed = new URL(redisUrlStr);
  connectionConfig = {
    host: parsed.hostname,
    port: parseInt(parsed.port || '6379', 10),
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    username: parsed.username ? decodeURIComponent(parsed.username) : undefined
  };
} catch (e) {
  console.warn('Failed to parse REDIS_URL, using default localhost connection');
}

console.log('BullMQ Background Worker starting up...');

if (process.env.USE_REDIS === 'false') {
  console.log('⚠️ USE_REDIS is false. Background workers disabled.');
  process.exit(0);
}

// 1. Worker for ELO recalculations
const eloWorker = new Worker('eloQueue', async (job) => {
  const { swiperId, targetId, rating } = job.data;
  console.log(`[eloQueue] Processing ELO updates for swipe: ${swiperId} -> ${targetId} (${rating})`);

  try {
    const [profileA, profileB] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: swiperId } }),
      prisma.profile.findUnique({ where: { userId: targetId } })
    ]);

    if (!profileA || !profileB) {
      console.warn(`[eloQueue] Warning: Profile not found. Swiper: ${!!profileA}, Target: ${!!profileB}`);
      return;
    }

    // ELO formula: EA = 1 / (1 + 10^((RB - RA) / 400))
    const expectedA = 1 / (1 + Math.pow(10, (profileB.elo - profileA.elo) / 400));
    const actualA = rating === 'like' ? 1 : 0;
    const K = 32;
    
    // Adjust swiper ELO based on expected outcome
    const eloAdjustment = Math.round(K * (actualA - expectedA));
    const newEloA = Math.max(800, profileA.elo + eloAdjustment);
    
    // Target ELO gets a boost if they are liked, drop if they are passed on
    const targetAdjustment = rating === 'like' ? 16 : -8;
    const newEloB = Math.max(800, profileB.elo + targetAdjustment);

    // Persist new ELO scores
    await Promise.all([
      prisma.profile.update({
        where: { userId: swiperId },
        data: { elo: newEloA }
      }),
      prisma.profile.update({
        where: { userId: targetId },
        data: { elo: newEloB }
      })
    ]);

    console.log(`[eloQueue] Success: Swiper ELO ${profileA.elo} -> ${newEloA} | Target ELO ${profileB.elo} -> ${newEloB}`);
  } catch (err) {
    console.error('[eloQueue] Error processing job:', err);
    throw err;
  }
}, { connection: connectionConfig });

// 2. Worker for asynchronous message database writes
const msgWorker = new Worker('msgPersistenceQueue', async (job) => {
  const { id, matchId, senderId, text, isImage, createdAt } = job.data;
  console.log(`[msgPersistenceQueue] Saving chat message: Match ${matchId} | Sender ${senderId}`);

  try {
    const newMessage = await prisma.message.create({
      data: {
        id,
        matchId,
        senderId,
        text,
        isImage: !!isImage,
        createdAt
      }
    });
    console.log(`[msgPersistenceQueue] Success: Saved message ID ${newMessage.id}`);
  } catch (err) {
    console.error('[msgPersistenceQueue] Error persisting message:', err);
    throw err;
  }
}, { connection: connectionConfig });

// 3. Worker for push notifications (mock delivery)
const pushWorker = new Worker('pushNotificationQueue', async (job) => {
  const { recipientId, title, body, payload } = job.data;
  console.log(`[pushNotificationQueue] Triggering push alert for User ${recipientId}`);

  try {
    // Simulate API call to FCM/APNs gateway
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`[pushNotificationQueue] FCM Server Success: Sent push alert to User ${recipientId} | Title: "${title}" | Body: "${body}"`);
  } catch (err) {
    console.error('[pushNotificationQueue] Error sending push notification:', err);
    throw err;
  }
}, { connection: connectionConfig });

// Error handling
eloWorker.on('error', (err) => console.error('ELO Worker Error:', err));
msgWorker.on('error', (err) => console.error('Message Persistence Worker Error:', err));
pushWorker.on('error', (err) => console.error('Push Notification Worker Error:', err));

console.log('All workers running and listening to Redis queues.');
