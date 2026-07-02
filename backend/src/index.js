import { createServer } from 'http';
import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import prisma from './config/prisma.js';
import redisManager from './config/redis.js';
import { socketManager } from './sockets/SocketManager.js';
import { workerManager } from './workers/WorkerManager.js';
import { StorageService } from './services/StorageService.js';
import { setupPhotoWorker } from './workers/photoWorker.js';
import { setupDiscoveryWorkers } from './workers/discoveryWorker.js';
import { setupInteractionWorkers } from './workers/interactionWorker.js';
import { setupRealtimeWorkers } from './workers/realtimeWorker.js';
import { setupTrustWorkers } from './workers/trustWorker.js';
import { setupGrowthWorkers } from './workers/growthWorker.js';
import { setupAIOSWorkers } from './workers/aiosWorker.js';

const startServer = async () => {
  try {
    // 1. Initialize Storage Directory
    await StorageService.init();

    if (env.USE_REDIS !== 'false') {
      setupPhotoWorker();
      setupDiscoveryWorkers();
      setupInteractionWorkers();
      setupRealtimeWorkers();
      setupTrustWorkers();
      setupGrowthWorkers();
      setupAIOSWorkers();
    }

    // 2. Connect to Redis (Graceful if fails)
    await redisManager.connect();

    // 3. Verify Database Connection
    await prisma.$connect();
    logger.info('Database connection established successfully.');

    // 4. Create HTTP Server for Express
    const httpServer = createServer(app);

    // 5. Create Separate HTTP Server for WebSockets (Port 5001)
    const socketHttpServer = createServer();
    await socketManager.init(socketHttpServer);

    // 6. Start listening
    httpServer.listen(env.BACKEND_PORT, () => {
      logger.info(`Primary Express API Server running in ${env.NODE_ENV} mode on port ${env.BACKEND_PORT}`);
    });

    socketHttpServer.listen(env.WEBSOCKET_PORT, () => {
      logger.info(`WebSockets Server running on port ${env.WEBSOCKET_PORT}`);
    });

    // Health Check Endpoint (Added to Express explicitly here or in app.js)
    app.get('/health', async (req, res) => {
      let dbStatus = 'disconnected';
      try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      } catch (err) {
        logger.error(`Healthcheck DB Error: ${err.message}`);
      }

      const redisStatus = redisManager.isHealthy() ? 'connected' : 'disconnected';

      const isHealthy = dbStatus === 'connected';
      res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'unhealthy',
        database: dbStatus,
        redis: redisStatus,
        timestamp: new Date().toISOString()
      });
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      
      await workerManager.shutdown();
      
      socketHttpServer.close(() => {
        logger.info('WebSocket server closed.');
      });

      httpServer.close(async () => {
        logger.info('HTTP server closed.');
        await redisManager.disconnect();
        await prisma.$disconnect();
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`, error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled rejections and uncaught exceptions globally
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Do not exit in production unless critical, but standard practice is to exit and let process manager restart
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
