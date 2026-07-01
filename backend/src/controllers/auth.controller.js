import { authService } from '../services/auth.service.js';
import { jwtService } from '../services/jwt.service.js';
import { successResponse } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import prisma from '../config/prisma.js';

class AuthController {
  async register(req, res) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const user = await authService.registerUser(req.body, ipAddress);
    // Legacy frontend expects { step, email, message }
    res.status(201).json({ step: 'otp_verification', email: user.email, message: 'OTP sent to email.' });
  }

  async verifyOtp(req, res) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const { user, accessToken, refreshToken } = await authService.verifyOtp(req.body, ipAddress);
    
    // Set HTTP-only cookie for refresh token for security, but also return it in body if legacy needs it
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Frontend expects token
    res.json({ token: accessToken, refreshToken, message: 'Email verified successfully.' });
  }

  async login(req, res) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const { user, accessToken, refreshToken } = await authService.login(req.body, ipAddress);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({ token: accessToken, refreshToken });
  }

  async refreshToken(req, res) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const { accessToken, refreshToken, user } = await jwtService.rotateRefreshToken(token, ipAddress);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({ token: accessToken, refreshToken });
  }

  async requestPasswordReset(req, res) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    await authService.requestPasswordReset(req.body.email, ipAddress);
    res.json({ message: 'If that email is registered, a reset code has been sent.' });
  }

  async resetPassword(req, res) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    await authService.resetPassword(req.body, ipAddress);
    res.json({ message: 'Password reset successfully. You can now login.' });
  }

  async logout(req, res) {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (token) {
      await jwtService.revokeToken(token);
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }

  async logoutAll(req, res) {
    const userId = req.userId;
    await jwtService.revokeAllUserTokens(userId);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out of all devices successfully' });
  }

  async getMe(req, res) {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        profile: {
          include: { photos: true }
        }
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.profile && user.profile.photos) {
      user.profile.photos.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    }

    res.json({
      profile: user.profile
    });
  }
}

export const authController = new AuthController();
