import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { trustController } from '../controllers/trust.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

router.post('/report', asyncHandler(trustController.report));
router.get('/reports', asyncHandler(trustController.getReports));

router.post('/block', asyncHandler(trustController.block));
router.delete('/block/:id', asyncHandler(trustController.unblock));

router.post('/mute', asyncHandler(trustController.mute));
router.delete('/mute/:id', asyncHandler(trustController.unmute));

router.get('/reputation', asyncHandler(trustController.getReputation));
router.get('/risk', asyncHandler(trustController.getRisk));

router.post('/appeal', asyncHandler(trustController.appeal));

export default router;
