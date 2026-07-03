import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { AuthenticationError, ConflictError, ValidationError } from '../utils/errors.js';
import { emailService } from './email.service.js';
import { jwtService } from './jwt.service.js';

class AuthService {
  async registerUser({ phone, email, password }, ipAddress) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 1. Database operations inside transaction
    const user = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { OR: [{ phone }, { email }] }
      });

      if (existingUser && existingUser.emailVerified) {
        throw new ConflictError('User with this phone or email already exists and is verified');
      }

      let txUser;
      if (existingUser) {
        txUser = await tx.user.update({
          where: { id: existingUser.id },
          data: { phone, email, passwordHash, emailVerified: false }
        });
      } else {
        txUser = await tx.user.create({
          data: { phone, email, passwordHash, emailVerified: false, role: 'user', status: 'active' }
        });
      }

      await tx.otp.upsert({
        where: { email_type: { email, type: 'verification' } },
        update: { code: otpCode, expiresAt },
        create: { email, code: otpCode, type: 'verification', expiresAt }
      });

      await tx.securityAudit.create({
        data: {
          userId: txUser.id,
          action: 'register',
          ipAddress: ipAddress || 'unknown',
          details: 'User registered successfully'
        }
      });

      return txUser;
    });

    // 2. External side-effects outside transaction
    await emailService.sendOtpEmail(email, otpCode, 'verification').catch(e => {
      console.error('Failed to send OTP email:', e);
    });

    return user;
  }

  async verifyOtp({ email, code }, ipAddress) {
    const otpRecord = await prisma.otp.findUnique({
      where: { email_type: { email, type: 'verification' } }
    });

    if (!otpRecord || otpRecord.code !== code || otpRecord.expiresAt < new Date()) {
      throw new AuthenticationError('Invalid or expired OTP.');
    }

    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });

    await prisma.otp.delete({ where: { id: otpRecord.id } });

    await emailService.sendWelcomeEmail(email, user.phone || 'User');
    await this.logAudit(user.id, 'email_verified', ipAddress, 'Email successfully verified');

    const accessToken = jwtService.generateAccessToken(user);
    const refreshToken = await jwtService.generateRefreshToken(user.id, ipAddress);

    return { user, accessToken, refreshToken };
  }

  async login({ identifier, password }, ipAddress) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: identifier }, { email: identifier }]
      }
    });

    if (!user) {
      await this.recordLoginAttempt(identifier, ipAddress, false, 'user_not_found');
      throw new AuthenticationError('Invalid identifier or password');
    }

    if (user.status === 'locked' && user.lockoutUntil && user.lockoutUntil > new Date()) {
      await this.recordLoginAttempt(identifier, ipAddress, false, 'account_locked');
      throw new AuthenticationError('Account is temporarily locked. Please try again later.');
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      const failedAttempts = user.failedLoginAttempts + 1;
      let updateData = { failedLoginAttempts: failedAttempts };

      if (failedAttempts >= 5) {
        updateData.status = 'locked';
        updateData.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
        await this.logAudit(user.id, 'account_locked', ipAddress, 'Account locked due to multiple failed login attempts');
      }

      await prisma.user.update({ where: { id: user.id }, data: updateData });
      await this.recordLoginAttempt(identifier, ipAddress, false, 'invalid_password');
      throw new AuthenticationError('Invalid identifier or password');
    }

    if (!user.emailVerified) {
      await this.recordLoginAttempt(identifier, ipAddress, false, 'email_unverified');
      throw new AuthenticationError('Please verify your email before logging in.');
    }

    // Reset lockouts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, status: 'active', lockoutUntil: null, lastLoginAt: new Date() }
    });

    await this.recordLoginAttempt(identifier, ipAddress, true);
    await this.logAudit(user.id, 'login', ipAddress, 'Successful login');

    const accessToken = jwtService.generateAccessToken(user);
    const refreshToken = await jwtService.generateRefreshToken(user.id, ipAddress);

    return { user, accessToken, refreshToken };
  }

  async requestPasswordReset(email, ipAddress) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success anyway to prevent email enumeration
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otp.upsert({
      where: { email_type: { email, type: 'password_reset' } },
      update: { code: otpCode, expiresAt },
      create: { email, code: otpCode, type: 'password_reset', expiresAt }
    });

    await emailService.sendOtpEmail(email, otpCode, 'password_reset');
    await this.logAudit(user.id, 'password_reset_requested', ipAddress, 'Password reset OTP generated');
  }

  async resetPassword({ email, code, newPassword }, ipAddress) {
    const otpRecord = await prisma.otp.findUnique({
      where: { email_type: { email, type: 'password_reset' } }
    });

    if (!otpRecord || otpRecord.code !== code || otpRecord.expiresAt < new Date()) {
      throw new AuthenticationError('Invalid or expired reset code.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    const user = await prisma.user.update({
      where: { email },
      data: { passwordHash, failedLoginAttempts: 0, status: 'active', lockoutUntil: null }
    });

    await prisma.otp.delete({ where: { id: otpRecord.id } });

    // Revoke all existing sessions globally on password reset
    await jwtService.revokeAllUserTokens(user.id);

    await emailService.sendPasswordChangedEmail(email);
    await this.logAudit(user.id, 'password_reset_completed', ipAddress, 'Password changed successfully');
  }

  async recordLoginAttempt(identifier, ipAddress, successful, reason = null) {
    await prisma.loginAttempt.create({
      data: { identifier, ipAddress, successful, reason }
    });
  }

  async logAudit(userId, action, ipAddress, details) {
    await prisma.securityAudit.create({
      data: { userId, action, ipAddress, details }
    });
  }
}

export const authService = new AuthService();
