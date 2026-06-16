import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const redisUrlStr = process.env.REDIS_URL || 'redis://localhost:6379';
let connectionConfig = {
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 2) return null; // Give up after 2 retries
    return Math.min(times * 1000, 3000);
  }
};

try {
  const parsed = new URL(redisUrlStr);
  connectionConfig = {
    host: parsed.hostname,
    port: parseInt(parsed.port || '6379', 10),
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    lazyConnect: true,
    retryStrategy: (times) => {
      if (times > 2) return null;
      return Math.min(times * 1000, 3000);
    }
  };
} catch (e) {
  // Use default config above
}

let eloQueue = null;
let msgPersistenceQueue = null;
let pushNotificationQueue = null;

try {
  eloQueue = new Queue('eloQueue', { connection: connectionConfig });
  msgPersistenceQueue = new Queue('msgPersistenceQueue', { connection: connectionConfig });
  pushNotificationQueue = new Queue('pushNotificationQueue', { connection: connectionConfig });
  console.log('✅ BullMQ Queues initialized (will connect to Redis when needed).');
} catch (e) {
  console.warn('⚠️ BullMQ Queue initialization failed - Redis may be unavailable. ELO jobs will run synchronously.');
}

export { eloQueue, msgPersistenceQueue, pushNotificationQueue };
