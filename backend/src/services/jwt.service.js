import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { AuthenticationError } from '../utils/errors.js';

class JwtService {
  constructor() {
    this.accessSecret = env.JWT_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
    this.accessExpiresIn = '1h'; // 1 hour for access tokens
    this.refreshExpiresIn = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  generateAccessToken(user) {
    return jwt.sign(
      { userId: user.id, phone: user.phone, email: user.email, role: user.role },
      this.accessSecret,
      { expiresIn: this.accessExpiresIn }
    );
  }

  async generateRefreshToken(userId, ipAddress, deviceId = null) {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + this.refreshExpiresIn);

    const refreshToken = await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
        ipAddress,
        deviceId
      }
    });

    return refreshToken.token;
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessSecret);
    } catch (err) {
      throw new AuthenticationError('Invalid or expired access token');
    }
  }

  async rotateRefreshToken(oldTokenString, ipAddress, deviceId = null) {
    const oldToken = await prisma.refreshToken.findUnique({
      where: { token: oldTokenString },
      include: { user: true }
    });

    if (!oldToken) {
      throw new AuthenticationError('Invalid refresh token');
    }

    if (oldToken.revoked) {
      // Possible token theft, revoke all tokens for this user
      await prisma.refreshToken.updateMany({
        where: { userId: oldToken.userId },
        data: { revoked: true }
      });
      throw new AuthenticationError('Token reuse detected. All sessions revoked.');
    }

    if (oldToken.expiresAt < new Date()) {
      throw new AuthenticationError('Refresh token expired');
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: oldToken.id },
      data: { revoked: true }
    });

    // Generate new access and refresh tokens
    const newAccessToken = this.generateAccessToken(oldToken.user);
    const newRefreshToken = await this.generateRefreshToken(oldToken.userId, ipAddress, deviceId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: oldToken.user
    };
  }

  async revokeToken(token) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true }
    });
  }

  async revokeAllUserTokens(userId) {
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true }
    });
  }
}

export const jwtService = new JwtService();
