import { profileService } from '../services/profile.service.js';

export const profileController = {
  // Onboarding
  async updateOnboarding(req, res) {
    const { step, isComplete } = req.body;
    await profileService.updateOnboardingStatus(req.userId, step, isComplete);
    res.json({ message: 'Onboarding status updated' });
  },
  
  async getOnboarding(req, res) {
    const status = await profileService.getOnboardingStatus(req.userId);
    res.json(status);
  },

  // Profile
  async getMyProfile(req, res) {
    const profile = await profileService.getProfileByUserId(req.userId);
    res.json(profile);
  },

  async createProfile(req, res) {
    const profile = await profileService.createProfile(req.userId, req.body);
    res.status(201).json(profile);
  },

  async updateProfile(req, res) {
    const profile = await profileService.updateProfile(req.userId, req.body);
    await profileService.calculateCompletionScore(req.userId);
    res.json(profile);
  },

  // Preferences
  async getPreferences(req, res) {
    const pref = await profileService.getPreferences(req.userId);
    res.json(pref);
  },

  async updatePreferences(req, res) {
    const pref = await profileService.updatePreferences(req.userId, req.body);
    res.json(pref);
  },

  // Settings
  async getSettings(req, res) {
    const settings = await profileService.getSettings(req.userId);
    res.json(settings);
  },

  async updateSettings(req, res) {
    const settings = await profileService.updateSettings(req.userId, req.body);
    res.json(settings);
  },

  // Location
  async updateLocation(req, res) {
    const { latitude, longitude } = req.body;
    const profile = await profileService.updateLocation(req.userId, latitude, longitude);
    res.json({ message: 'Location updated', profile });
  },

  // Account Mgmt
  async deactivateAccount(req, res) {
    await profileService.deactivateAccount(req.userId);
    res.json({ message: 'Account deactivated' });
  },

  async deleteAccount(req, res) {
    await profileService.softDeleteAccount(req.userId);
    res.json({ message: 'Account deleted' });
  },

  async getUserProfileRaw(targetUserId, requesterUserId) {
    return await profileService.getUserProfileRaw(targetUserId, requesterUserId);
  }
};
