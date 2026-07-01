import { redisClient } from './config/redis.js';
import redisManager from './config/redis.js';

// Ensure it connects as it did before
redisManager.connect();

export default redisClient;
