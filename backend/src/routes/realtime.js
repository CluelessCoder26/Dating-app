import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { realtimeController } from '../controllers/realtime.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

// Conversations
router.get('/conversations', asyncHandler(realtimeController.getConversations));
router.get('/conversations/:id', asyncHandler(realtimeController.getConversation));

// Messages
router.get('/messages/:conversationId', asyncHandler(realtimeController.getMessages));
router.post('/messages', asyncHandler(realtimeController.sendMessage));
router.patch('/messages/read', asyncHandler(realtimeController.markRead));

export default router;
