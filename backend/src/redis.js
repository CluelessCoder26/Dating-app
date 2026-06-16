import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries >= 3) {
        console.warn(`⚠️ Redis: gave up after ${retries} retries. Running without Redis cache.`);
        return false; // Stop retrying
      }
      return 1500 * retries; // Progressive backoff
    },
    connectTimeout: 3000
  }
});

redisClient.on('error', () => {}); // Suppress individual error events (reconnect strategy handles messaging)

// Connect but don't crash if unavailable
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis Cache Server successfully.');
  } catch (error) {
    console.warn('⚠️ Redis Cache unavailable. Running in degraded mode (no caching).');
  }
})();

export default redisClient;
