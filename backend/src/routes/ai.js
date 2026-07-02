import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { aiController } from '../controllers/ai.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
router.use(authenticateToken);

router.post('/profile/review', asyncHandler(aiController.reviewProfile));
router.post('/profile/improve', asyncHandler(aiController.improveProfile));
router.get('/compatibility/:matchId', asyncHandler(aiController.getCompatibility));
router.post('/icebreaker', asyncHandler(aiController.generateIcebreaker));
router.post('/reply', asyncHandler(aiController.generateReply));
router.post('/conversation/summary', asyncHandler(aiController.getConversationSummary));
router.get('/relationship/memory/:matchId', asyncHandler(aiController.getRelationshipMemory));
router.get('/profile/insights', asyncHandler(aiController.getProfileInsights));
router.get('/analytics', asyncHandler(aiController.getAnalytics));

export default router;
