import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { discoveryController } from '../controllers/discovery.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticateToken); // Protect all discovery routes

// GET /api/discovery - Retrieve ranked feed
router.get('/', asyncHandler(discoveryController.getDiscoveryFeed));

// GET /api/discovery/next - Basically just another page or single fetch
router.get('/next', asyncHandler(discoveryController.getDiscoveryFeed));

// GET/PATCH /api/discovery/preferences - Manage discovery preferences
router.get('/preferences', asyncHandler(discoveryController.getPreferences));
router.patch('/preferences', asyncHandler(discoveryController.updatePreferences));

// POST /api/discovery/stats - Track analytics
router.post('/stats', asyncHandler(discoveryController.trackAction));

export default router;
