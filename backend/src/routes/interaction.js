import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { interactionController } from '../controllers/interaction.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticateToken); // Protect all interaction routes

// POST /api/interactions/swipe
router.post('/swipe', asyncHandler(interactionController.swipe));

// Likes received (Heart page)
router.get('/likes-received', asyncHandler(interactionController.getLikesReceived));
router.post('/likes-received/:likerId/accept', asyncHandler(interactionController.acceptLike));
router.post('/likes-received/:likerId/reject', asyncHandler(interactionController.rejectLike));

// GET /api/interactions/history
router.get('/history', asyncHandler(interactionController.getHistory));

// GET /api/interactions/stats
router.get('/stats', asyncHandler(interactionController.getStats));

// Matches API (Grouped here for Interaction Engine)
// GET /api/interactions/matches -> often aliased to /api/matches globally
router.get('/matches', asyncHandler(interactionController.getMatches));
router.delete('/matches/:id', asyncHandler(interactionController.deleteMatch));

export default router;
