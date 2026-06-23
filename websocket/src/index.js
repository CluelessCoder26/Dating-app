import { createServer } from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import jwt from 'jsonwebtoken';
import { Queue } from 'bullmq';
import { PrismaClient } from '../../backend/node_modules/@prisma/client/index.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const PORT = process.env.WEBSOCKET_PORT || 5001;
const httpServer = createServer();

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Configure Redis Adapter for Socket.io scaling
const redisUrlStr = process.env.REDIS_URL || 'redis://localhost:6379';
const pubClient = createClient({ url: redisUrlStr });
const subClient = pubClient.duplicate();

// In-Memory online user tracker fallback if Redis is offline
const localOnlineUsers = new Set();
async function sAddOnline(userId) {
  try {
    if (pubClient.isOpen) {
      await pubClient.sAdd('online_users', userId);
    } else {
      localOnlineUsers.add(userId);
    }
  } catch (err) {
    localOnlineUsers.add(userId);
  }
}
async function sRemOnline(userId) {
  try {
    if (pubClient.isOpen) {
      await pubClient.sRem('online_users', userId);
    } else {
      localOnlineUsers.delete(userId);
    }
  } catch (err) {
    localOnlineUsers.delete(userId);
  }
}
async function sIsOnline(userId) {
  try {
    if (pubClient.isOpen) {
      return await pubClient.sIsMember('online_users', userId);
    }
    return localOnlineUsers.has(userId);
  } catch (err) {
    return localOnlineUsers.has(userId);
  }
}

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
  console.warn('Failed to parse REDIS_URL for BullMQ connection, defaulting to localhost');
}

// BullMQ Queues in WebSocket
const msgPersistenceQueue = new Queue('msgPersistenceQueue', { connection: connectionConfig });
const pushNotificationQueue = new Queue('pushNotificationQueue', { connection: connectionConfig });

// Socket Authentication Handshake
io.use((socket, next) => {
  const authHeader = socket.handshake.auth?.token || socket.handshake.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return next(new Error('Authentication token is required'));
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication token invalid or expired'));
    }
    socket.userId = decoded.userId;
    next();
  });
});

io.on('connection', async (socket) => {
  console.log(`Socket client connected: ${socket.id} (User: ${socket.userId})`);

  // Track user online status
  await sAddOnline(socket.userId);

  // Join own user room for personal alerts
  socket.join(`user_${socket.userId}`);

  // Join a specific Match Room
  socket.on('join_match', ({ matchId }) => {
    if (!matchId) return;
    const roomName = `match_${matchId}`;
    socket.join(roomName);
    console.log(`User ${socket.userId} joined chat room: ${roomName}`);
  });

  // Handle typing indicator
  socket.on('typing', ({ matchId, isTyping }) => {
    if (!matchId) return;
    socket.to(`match_${matchId}`).emit('typing_status', {
      userId: socket.userId,
      isTyping
    });
  });

  // Handle send message
  socket.on('send_msg', async ({ matchId, targetUserId, text, isImage }) => {
    if (!matchId || !text) return;

    const roomName = `match_${matchId}`;
    const msgPayload = {
      matchId,
      senderId: socket.userId,
      text,
      isImage: !!isImage,
      createdAt: new Date().toISOString()
    };

    // 1. Broadcast the message to the socket room instantly
    io.to(roomName).emit('recv_msg', msgPayload);

    // 2. Queue asynchronous database write job (fallback to sync DB if Redis down)
    try {
      await msgPersistenceQueue.add('persist_msg', {
        matchId,
        senderId: socket.userId,
        text,
        isImage: !!isImage
      });
    } catch (err) {
      console.warn('⚠️ Failed to queue message persistence on Redis, writing synchronously to database:', err.message);
      try {
        await prisma.message.create({
          data: {
            matchId,
            senderId: socket.userId,
            text,
            isImage: !!isImage
          }
        });
        console.log('[Sync Msg Fallback] Successfully persisted message to database.');
      } catch (dbErr) {
        console.error('Failed to save message synchronously:', dbErr.message);
      }
    }

    // 3. Trigger Push Notification job if target user is offline
    try {
      const isTargetOnline = await sIsOnline(targetUserId);
      if (!isTargetOnline) {
        await pushNotificationQueue.add('send_push', {
          recipientId: targetUserId,
          title: 'New Message',
          body: text.length > 50 ? `${text.substring(0, 50)}...` : text,
          payload: { matchId, senderId: socket.userId }
        });
      }
    } catch (err) {
      console.error('Failed to dispatch push notification job:', err);
    }
  });

  // Client disconnected
  socket.on('disconnect', async () => {
    console.log(`Socket client disconnected: ${socket.id}`);
    await sRemOnline(socket.userId);
  });
});

// Run server after database adapter connections are ready
(async () => {
  try {
    console.log('Connecting to Redis Cache...');
    await Promise.all([
      pubClient.connect().catch(e => { throw new Error('pubClient: ' + e.message) }),
      subClient.connect().catch(e => { throw new Error('subClient: ' + e.message) })
    ]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log('Socket.io scaling Redis adapter connected.');

    // Subscribe to match_events PubSub channel
    await subClient.subscribe('match_events', (message) => {
      try {
        const event = JSON.parse(message);
        console.log('[Redis Match Event Received]:', event);
        io.to(`user_${event.user1Id}`).emit('match_created', event);
        io.to(`user_${event.user2Id}`).emit('match_created', event);
      } catch (subErr) {
        console.error('Error processing match PubSub message:', subErr);
      }
    });
  } catch (err) {
    console.warn('⚠️ Redis connection failed. Falling back to default In-Memory Socket Adapter. Detail:', err.message);
  }

  httpServer.listen(PORT, () => {
    console.log(`WebSockets Server running on port ${PORT}`);
  });
})();
