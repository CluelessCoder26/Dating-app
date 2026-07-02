import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './utils/errors.js';
import logger from './utils/logger.js';

// Existing Routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import swipeRoutes from './routes/swipe.js';
import photoRoutes from './routes/photo.js';
import blockRoutes from './routes/block.js';
import discoveryRoutes from './routes/discovery.js';
import interactionRoutes from './routes/interaction.js';
import realtimeRoutes from './routes/realtime.js';
import trustRoutes from './routes/trust.js';
import moderationRoutes from './routes/moderation.js';
import growthRoutes from './routes/growth.js';
import aiRoutes from './routes/ai.js';
import opsRoutes from './routes/ops.js';

const app = express();

// Security Headers
app.use(helmet());

// Compression
app.use(compression());

// CORS Configuration
const corsOptions = {
  origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

// Payload Limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request Logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Static Uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Register API Routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/swipe', swipeRoutes); // Deprecated in favor of interactions, keep for compatibility
apiRouter.use('/photos', photoRoutes);
apiRouter.use('/block', blockRoutes);
apiRouter.use('/discovery', discoveryRoutes);
apiRouter.use('/interactions', interactionRoutes);
apiRouter.use('/', realtimeRoutes); // Handles /api/conversations and /api/messages
apiRouter.use('/trust', trustRoutes);
apiRouter.use('/moderation', moderationRoutes);
apiRouter.use('/growth', growthRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/ops', opsRoutes);

import healthRoutes from './routes/health.js';
app.use('/', healthRoutes);

// Swagger & ReDoc
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import redoc from 'redoc-express';

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.get('/redoc', redoc({
  title: 'Spark API Docs',
  specUrl: '/openapi.json',
  redocOptions: {
    theme: {
      colors: {
        primary: {
          main: '#6EC5AB'
        }
      }
    }
  }
}));

// Mount API routes with versioning support (aliased to preserve frontend contracts)
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// Handle 404
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
