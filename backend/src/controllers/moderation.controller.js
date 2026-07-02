import { moderationEngine } from '../services/trust/ModerationEngine.js';
import prisma from '../config/prisma.js';

export const moderationController = {
  // GET /api/moderation/cases
  async getCases(req, res) {
    const cases = await prisma.moderationCase.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' }
    });
    res.json(cases);
  },

  // PATCH /api/moderation/cases/:id
  async resolveCase(req, res) {
    const { action, notes } = req.body;
    // Assuming req.userId is the moderator executing this
    const modCase = await moderationEngine.resolveCase(req.params.id, req.userId, action, notes);
    res.json(modCase);
  },

  // PATCH /api/moderation/appeals/:id
  async resolveAppeal(req, res) {
    const { status, note } = req.body;
    const appeal = await moderationEngine.resolveAppeal(req.params.id, req.userId, status, note);
    res.json(appeal);
  }
};
