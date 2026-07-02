import redisManager from '../../config/redis.js';
import { queueManager } from '../../config/bullmq.js';
import prisma from '../../config/prisma.js';
import os from 'os';

class MonitoringPlatform {
  async getSystemHealth() {
    const memory = process.memoryUsage();
    return {
      status: 'HEALTHY',
      cpu: os.loadavg(),
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed
      },
      uptime: process.uptime()
    };
  }

  async getRedisHealth() {
    if (!redisManager.client) return { status: 'DISCONNECTED' };
    const info = await redisManager.client.info('memory');
    return { status: 'CONNECTED', info: info.split('\r\n')[1] }; // Basic memory info
  }

  async getDatabaseHealth() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'CONNECTED' };
    } catch (e) {
      return { status: 'ERROR', error: e.message };
    }
  }

  async getQueueHealth() {
    // Collect stats from all queues
    const queues = Array.from(queueManager.queues.keys());
    const stats = {};
    for (const qName of queues) {
      const q = queueManager.queues.get(qName);
      stats[qName] = await q.getJobCounts();
    }
    return stats;
  }
}
export const monitoringPlatform = new MonitoringPlatform();
