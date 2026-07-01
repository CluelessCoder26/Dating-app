import prisma from '../config/prisma.js';
import { NotFoundError, ValidationError, AuthorizationError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import { calculateDistanceMiles } from '../utils/distance.js';

export const profileService = {
  // Onboarding
  async updateOnboardingStatus(userId, step, isComplete = false) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        onboardingStep: step,
        onboardingComplete: isComplete
      }
    });
  },

  async getOnboardingStatus(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingStep: true, onboardingComplete: true }
    });
    if (!user) throw new NotFoundError('User not found');
    return user;
  },

  // Profile Management
  async getProfileByUserId(userId) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        photos: true,
        user: { select: { onboardingStep: true, onboardingComplete: true } }
      }
    });
    if (!profile) throw new NotFoundError('Profile not found');
    return profile;
  },

  async createProfile(userId, profileData) {
    const existing = await prisma.profile.findUnique({ where: { userId } });
    if (existing) {
      throw new ValidationError('Profile already exists for this user');
    }

    // Default elo, default scores
    const profile = await prisma.profile.create({
      data: {
        userId,
        ...profileData
      }
    });

    await prisma.securityAudit.create({
      data: { userId, action: 'PROFILE_CREATED' }
    });

    return profile;
  },

  async updateProfile(userId, updateData) {
    const existing = await prisma.profile.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundError('Profile not found');

    const profile = await prisma.profile.update({
      where: { userId },
      data: updateData
    });

    await prisma.securityAudit.create({
      data: { userId, action: 'PROFILE_UPDATED' }
    });

    return profile;
  },

  // Location
  async updateLocation(userId, latitude, longitude) {
    const existing = await prisma.profile.findUnique({ where: { userId } });
    if (!existing) throw new NotFoundError('Profile not found');

    const profile = await prisma.profile.update({
      where: { userId },
      data: { latitude, longitude }
    });

    await prisma.securityAudit.create({
      data: { userId, action: 'LOCATION_UPDATED' }
    });

    return profile;
  },

  // Preferences
  async getPreferences(userId) {
    let pref = await prisma.preference.findUnique({ where: { userId } });
    if (!pref) {
      // Create defaults if they don't exist yet
      pref = await prisma.preference.create({
        data: { userId }
      });
    }
    return pref;
  },

  async updatePreferences(userId, prefData) {
    const existing = await prisma.preference.findUnique({ where: { userId } });
    if (!existing) {
      const pref = await prisma.preference.create({
        data: { userId, ...prefData }
      });
      return pref;
    }

    const pref = await prisma.preference.update({
      where: { userId },
      data: prefData
    });

    await prisma.securityAudit.create({
      data: { userId, action: 'PREFERENCES_UPDATED' }
    });

    return pref;
  },

  // Settings
  async getSettings(userId) {
    let settings = await prisma.setting.findUnique({ where: { userId } });
    if (!settings) {
      settings = await prisma.setting.create({
        data: { userId }
      });
    }
    return settings;
  },

  async updateSettings(userId, settingsData) {
    const existing = await prisma.setting.findUnique({ where: { userId } });
    if (!existing) {
      return prisma.setting.create({
        data: { userId, ...settingsData }
      });
    }

    const settings = await prisma.setting.update({
      where: { userId },
      data: settingsData
    });

    await prisma.securityAudit.create({
      data: { userId, action: 'SETTINGS_UPDATED' }
    });

    return settings;
  },

  // Account Management
  async deactivateAccount(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { deactivatedAt: new Date(), status: 'deactivated' }
    });

    await prisma.securityAudit.create({
      data: { userId, action: 'ACCOUNT_DEACTIVATED' }
    });
  },

  async reactivateAccount(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { deactivatedAt: null, status: 'active' }
    });

    await prisma.securityAudit.create({
      data: { userId, action: 'ACCOUNT_REACTIVATED' }
    });
  },

  async softDeleteAccount(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), status: 'deleted' }
    });

    await prisma.securityAudit.create({
      data: { userId, action: 'ACCOUNT_DELETED' }
    });
  },

  async calculateCompletionScore(userId) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) return 0;

    const fields = [
      'name', 'age', 'gender', 'bio', 'occupation', 'education', 
      'company', 'height', 'languages', 'interests', 'relationshipGoals', 
      'lifestyle', 'hometown', 'currentCity'
    ];
    
    let filled = 0;
    for (const field of fields) {
      if (profile[field] !== null && profile[field] !== undefined && profile[field] !== '') {
        if (Array.isArray(profile[field]) && profile[field].length > 0) {
          filled++;
        } else if (!Array.isArray(profile[field])) {
          filled++;
        }
      }
    }
    
    const photos = await prisma.photo.findMany({ where: { profileId: profile.id } });
    if (photos.length > 0) filled += 2; // Treat photos as heavily weighted for completion

    const totalExpected = fields.length + 2; // +2 weight for having photos
    const score = Math.min(100, Math.round((filled / totalExpected) * 100));

    await prisma.profile.update({
      where: { userId },
      data: { completionScore: score }
    });

    return score;
  },

  async getUserProfileRaw(targetUserId, requesterUserId) {
    const profile = await prisma.profile.findUnique({
      where: { userId: targetUserId },
      include: { photos: true }
    });

    if (!profile) throw new NotFoundError('Profile not found');

    const blocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: requesterUserId, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: requesterUserId }
        ]
      }
    });

    if (blocked) throw new NotFoundError('Profile not found'); // Hide blocked users

    const myProfile = await prisma.profile.findUnique({ where: { userId: requesterUserId } });
    if (myProfile && myProfile.latitude && myProfile.longitude && profile.latitude && profile.longitude) {
      profile.distanceMiles = parseFloat(calculateDistanceMiles(
        myProfile.latitude,
        myProfile.longitude,
        profile.latitude,
        profile.longitude
      ).toFixed(2));
    }

    return profile;
  }
};
