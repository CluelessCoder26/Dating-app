import { discoveryService } from '../services/discovery/discovery.service.js';
import { profileService } from '../services/profile.service.js';

export const discoveryController = {
  async getDiscoveryFeed(req, res) {
    const page = parseInt(req.query.page) || 1;
    const feed = await discoveryService.getDiscoveryFeed(req.userId, page);
    res.json(feed);
  },

  async getPreferences(req, res) {
    const prefs = await profileService.getPreferences(req.userId);
    res.json(prefs);
  },

  async updatePreferences(req, res) {
    const updated = await discoveryService.updatePreferences(req.userId, req.body);
    res.json({ message: 'Preferences updated and discovery cache refreshed.', preferences: updated });
  },

  async trackAction(req, res) {
    const { action, targetId } = req.body;
    await discoveryService.recordMetrics(req.userId, action, targetId, false);
    res.json({ message: 'Action tracked' });
  }
};
