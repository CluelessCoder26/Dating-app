import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { opsController } from '../controllers/ops.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Super Admin & Operations Admin
router.use(authenticateToken);
router.use(requireRole(['SUPER_ADMIN', 'OPERATIONS_ADMIN']));

router.get('/dashboard', asyncHandler(opsController.getDashboard));
router.get('/system', asyncHandler(opsController.getSystem));
router.get('/ai', asyncHandler(opsController.getAI));
router.get('/incidents', asyncHandler(opsController.getIncidents));
router.post('/incidents', asyncHandler(opsController.createIncident));

export default router;
