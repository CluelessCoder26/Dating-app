import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './db.js';
import redisClient from './redis.js';

// Route imports
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import swipeRoutes from './routes/swipe.js';
import photoRoutes from './routes/photo.js';
import blockRoutes from './routes/block.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static uploads
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let redisStatus = 'disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    console.error('Healthcheck: Database connection failed:', err.message);
  }

  try {
    if (redisClient.isOpen) {
      const redisCheck = await redisClient.ping();
      redisStatus = redisCheck === 'PONG' ? 'connected' : 'disconnected';
    }
  } catch (err) {
    console.error('Healthcheck: Redis connection failed:', err.message);
  }

  const isHealthy = dbStatus === 'connected';
  res.status(isHealthy ? 200 : 500).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    database: dbStatus,
    redis: redisStatus
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/block', blockRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Primary Express API Server running on port ${PORT}`);
});
