import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { jwtService } from '../services/jwt.service.js';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import { presenceEngine } from '../services/realtime/PresenceEngine.js';

class SocketManager {
  constructor() {
    this.io = null;
    this.pubClient = null;
    this.subClient = null;
  }

  async init(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
        methods: ['GET', 'POST']
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    if (env.USE_REDIS !== 'false') {
      try {
        this.pubClient = createClient({ url: env.REDIS_URL });
        this.subClient = this.pubClient.duplicate();

        this.pubClient.on('error', (err) => logger.error(`Socket Redis Pub Error: ${err.message}`));
        this.subClient.on('error', (err) => logger.error(`Socket Redis Sub Error: ${err.message}`));

        await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
        
        this.io.adapter(createAdapter(this.pubClient, this.subClient));
        logger.info('Socket.io scaling Redis adapter connected.');
      } catch (err) {
        logger.warn(`Redis adapter connection failed. Falling back to In-Memory Socket Adapter. Detail: ${err.message}`);
      }
    } else {
      logger.info('USE_REDIS is false. Using default In-Memory Socket Adapter.');
    }

    this._setupMiddleware();
    this._setupEventHandlers();
  }

  _setupMiddleware() {
    this.io.use((socket, next) => {
      const authHeader = socket.handshake.auth?.token || socket.handshake.headers['authorization'];
      const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

      if (!token) {
        return next(new Error('Authentication token is required'));
      }

      try {
        const decoded = jwtService.verifyAccessToken(token);
        socket.userId = decoded.userId;
        socket.user = decoded;
        next();
      } catch (err) {
        return next(new Error('Authentication token invalid or expired'));
      }
    });
  }

  _setupEventHandlers() {
    this.io.on('connection', async (socket) => {
      logger.info(`Socket client connected: ${socket.id} (User: ${socket.userId})`);

      socket.join(`user_${socket.userId}`);

      // 1. Mark Presence Online
      await presenceEngine.setOnline(socket.userId, socket.id);
      this.io.emit('presence.update', { userId: socket.userId, status: 'online' });

      socket.on('join_match', ({ matchId }) => {
        if (!matchId) return;
        const roomName = `match_${matchId}`;
        socket.join(roomName);
        logger.info(`User ${socket.userId} joined chat room: ${roomName}`);
      });

      // 2. Typing Indicators (Phase 7)
      socket.on('typing.start', ({ conversationId, targetId }) => {
        if (!targetId) return;
        socket.to(`user_${targetId}`).emit('typing.start', {
          conversationId,
          userId: socket.userId
        });
      });

      socket.on('typing.stop', ({ conversationId, targetId }) => {
        if (!targetId) return;
        socket.to(`user_${targetId}`).emit('typing.stop', {
          conversationId,
          userId: socket.userId
        });
      });

      // 3. Disconnect Handling
      socket.on('disconnect', async () => {
        logger.info(`Socket client disconnected: ${socket.id}`);
        await presenceEngine.setOffline(socket.userId, socket.id);
        
        // If fully offline, broadcast
        const presence = await presenceEngine.getPresence(socket.userId);
        if (presence.status === 'offline') {
          this.io.emit('presence.update', { userId: socket.userId, status: 'offline', lastSeen: presence.lastSeen });
        }
      });
      
      socket.on('error', (err) => {
        logger.error(`Socket error for client ${socket.id}: ${err.message}`);
      });
    });
  }

  getIO() {
    return this.io;
  }
}

export const socketManager = new SocketManager();
