import express from 'express';
import os from 'os';
import prisma from '../config/prisma.js';
import redisClient from '../redis.js';
import { eloQueue, msgPersistenceQueue, pushNotificationQueue } from '../queues.js';
import { socketManager } from '../sockets/SocketManager.js';
import { env } from '../config/env.js';

const router = express.Router();

const getPackageVersion = () => {
  return process.env.npm_package_version || '1.0.0';
};

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to Spark Dating API', version: getPackageVersion() });
});

router.get('/health', async (req, res) => {
  let dbStatus = 'down';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'up';
  } catch (err) {
    dbStatus = 'down';
  }

  let redisStatus = 'down';
  try {
    if (redisClient.isOpen) {
      await redisClient.ping();
      redisStatus = 'up';
    }
  } catch (err) {
    redisStatus = 'down';
  }

  // BullMQ status (check if queues exist)
  let queuesStatus = 'up';
  try {
    if (!eloQueue || !msgPersistenceQueue || !pushNotificationQueue) {
      queuesStatus = 'down';
    }
  } catch (err) {
    queuesStatus = 'down';
  }

  const socketStatus = socketManager.getIO() ? 'up' : 'down';

  res.json({
    status: (dbStatus === 'up' && redisStatus === 'up') ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    version: getPackageVersion(),
    services: {
      database: dbStatus,
      redis: redisStatus,
      bullmq: queuesStatus,
      socket: socketStatus
    },
    system: {
      loadavg: os.loadavg(),
      freemem: os.freemem(),
      totalmem: os.totalmem()
    }
  });
});

router.get('/version', (req, res) => {
  res.json({ version: getPackageVersion() });
});

export default router;
