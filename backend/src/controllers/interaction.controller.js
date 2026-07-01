import { interactionService } from '../services/interaction.service.js';

export const interactionController = {
  async swipe(req, res) {
    const { targetId, action } = req.body;
    const result = await interactionService.processSwipe(req.userId, targetId, action);
    res.json(result); // Immediate response! Async queues take over.
  },

  async getHistory(req, res) {
    const history = await interactionService.getHistory(req.userId);
    res.json(history);
  },

  async getStats(req, res) {
    const stats = await interactionService.getStats(req.userId);
    res.json(stats);
  },

  async getMatches(req, res) {
    const matches = await interactionService.getMatches(req.userId);
    res.json(matches);
  },

  async deleteMatch(req, res) {
    await interactionService.deleteMatch(req.userId, req.params.id);
    res.json({ success: true, message: 'Match deleted.' });
  }
};
