import express from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { z } from 'zod';

const router = express.Router();
router.use(authenticateToken); // Protect all profile routes

// Zod schemas
const profileSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().min(18).optional(),
  gender: z.enum(['male', 'female', 'non-binary']).optional(),
  preference: z.enum(['male', 'female', 'everyone']).optional(),
  bio: z.string().optional(),
  occupation: z.string().optional(),
  education: z.string().optional(),
  company: z.string().optional(),
  height: z.number().optional(),
  languages: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  relationshipGoals: z.string().optional(),
  lifestyle: z.string().optional(),
  hometown: z.string().optional(),
  currentCity: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional()
});

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

const validateBody = (schema) => (req, res, next) => {
  schema.parse(req.body);
  next();
};

// Onboarding
router.get('/onboarding', asyncHandler(profileController.getOnboarding));
router.put('/onboarding', asyncHandler(profileController.updateOnboarding));

// Profile Mgmt
router.get('/', asyncHandler(profileController.getMyProfile));
router.post('/', validateBody(profileSchema), asyncHandler(profileController.createProfile));
router.put('/', validateBody(profileSchema), asyncHandler(profileController.updateProfile));

// Location
router.put('/location', validateBody(locationSchema), asyncHandler(profileController.updateLocation));

// Preferences
router.get('/preferences', asyncHandler(profileController.getPreferences));
router.put('/preferences', asyncHandler(profileController.updatePreferences));

// Settings
router.get('/settings', asyncHandler(profileController.getSettings));
router.put('/settings', asyncHandler(profileController.updateSettings));

// Account Mgmt
router.post('/deactivate', asyncHandler(profileController.deactivateAccount));
router.delete('/', asyncHandler(profileController.deleteAccount));

// Support for frontend contract
router.get('/:userId', asyncHandler(async (req, res) => {
  // Mocked for now to maintain previous contract if frontend calls it
  // Actually, wait, the instructions said: "Do NOT implement Discovery, Recommendation Engine, Swiping, Matching".
  // However, `GET /api/profile/:userId` is technically part of profile retrieval. 
  // Let's implement it inside the controller properly.
  const profile = await profileController.getUserProfileRaw(req.params.userId, req.userId);
  res.json(profile);
}));

export default router;
