import { interactionService } from '../services/interaction.service.js';
import { ValidationError } from '../utils/errors.js';

export const interactionController = {
  async swipe(req, res) {
    const { targetId, action } = req.body;
    if (!targetId || !action) {
      throw new ValidationError('targetId and action are required');
    }
    const result = await interactionService.processSwipe(req.userId, targetId, action);
    res.json(result);
  },

  async getLikesReceived(req, res) {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
    const data = await interactionService.getLikesReceived(req.userId, { page, pageSize });
    res.json(data);
  },

  async acceptLike(req, res) {
    const { likerId } = req.params;
    const result = await interactionService.acceptLike(req.userId, likerId);
    res.json(result);
  },

  async rejectLike(req, res) {
    const { likerId } = req.params;
    const result = await interactionService.rejectLike(req.userId, likerId);
    res.json(result);
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
  },
};
