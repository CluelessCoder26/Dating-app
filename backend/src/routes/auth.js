import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { authController } from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const RegisterSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{6,14}$/, 'Invalid phone number format.'),
  email: z.string().email('Invalid email format.'),
  // Password policy: min 8, uppercase, lowercase, number, special char
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

const VerifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6)
});

const LoginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone required'),
  password: z.string()
});

const RequestResetSchema = z.object({
  email: z.string().email('Invalid email format.')
});

const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email format.'),
  code: z.string().length(6),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
});

router.post('/register', authRateLimiter, validate(RegisterSchema), asyncHandler(authController.register.bind(authController)));
router.post('/verify-otp', authRateLimiter, validate(VerifyOtpSchema), asyncHandler(authController.verifyOtp.bind(authController)));
router.post('/login', authRateLimiter, validate(LoginSchema), asyncHandler(authController.login.bind(authController)));
router.post('/refresh', asyncHandler(authController.refreshToken.bind(authController)));
router.post('/forgot-password', authRateLimiter, validate(RequestResetSchema), asyncHandler(authController.requestPasswordReset.bind(authController)));
router.post('/reset-password', authRateLimiter, validate(ResetPasswordSchema), asyncHandler(authController.resetPassword.bind(authController)));
router.post('/logout', asyncHandler(authController.logout.bind(authController)));
router.post('/logout-all', authenticateToken, asyncHandler(authController.logoutAll.bind(authController)));
router.get('/me', authenticateToken, asyncHandler(authController.getMe.bind(authController)));

export default router;
