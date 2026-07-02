import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { growthController } from '../controllers/growth.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticateToken); // Protect all routes

// Plans & Subscriptions
router.get('/plans', asyncHandler(growthController.getPlans));
router.get('/subscriptions', asyncHandler(growthController.getSubscriptions));
router.post('/subscriptions', asyncHandler(growthController.subscribe));
router.delete('/subscriptions/:id', asyncHandler(growthController.cancelSubscription));

// Entitlements & Features
router.get('/entitlements', asyncHandler(growthController.getEntitlements));
router.get('/features', asyncHandler(growthController.getFeatures));
router.get('/feature-flags', asyncHandler(growthController.getFeatureFlags));
router.get('/experiments', asyncHandler(growthController.getExperiments));

// Promotions
router.get('/promotions', asyncHandler(growthController.getPromotions));
router.post('/promotions/apply', asyncHandler(growthController.applyPromotion));

// Referrals
router.get('/referrals', asyncHandler(growthController.getReferrals));
router.post('/referrals', asyncHandler(growthController.processReferral));

// Rewards
router.get('/rewards', asyncHandler(growthController.getRewards));
router.post('/rewards/:id/redeem', asyncHandler(growthController.redeemReward));

// Achievements
router.get('/achievements', asyncHandler(growthController.getAchievements));

export default router;
