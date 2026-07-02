import { trustService } from '../services/trust/TrustService.js';
import { reputationEngine } from '../services/trust/ReputationEngine.js';
import { riskEngine } from '../services/trust/RiskEngine.js';
import { moderationEngine } from '../services/trust/ModerationEngine.js';

export const trustController = {
  // POST /api/trust/report
  async report(req, res) {
    const { reportedId, targetType, targetId, reasonCategory, customReason, evidenceUrls } = req.body;
    const report = await trustService.reportEntity(
      req.userId, reportedId, targetType, targetId, reasonCategory, customReason, evidenceUrls
    );
    res.status(201).json(report);
  },

  // GET /api/trust/reports
  async getReports(req, res) {
    const reports = await trustService.getReports(req.userId);
    res.json(reports);
  },

  // POST /api/trust/block
  async block(req, res) {
    const { blockedId } = req.body;
    await trustService.blockUser(req.userId, blockedId);
    res.json({ success: true });
  },

  // DELETE /api/trust/block/:id
  async unblock(req, res) {
    await trustService.unblockUser(req.userId, req.params.id);
    res.json({ success: true });
  },

  // POST /api/trust/mute
  async mute(req, res) {
    const { mutedId } = req.body;
    await trustService.muteUser(req.userId, mutedId);
    res.json({ success: true });
  },

  // DELETE /api/trust/mute/:id
  async unmute(req, res) {
    await trustService.unmuteUser(req.userId, req.params.id);
    res.json({ success: true });
  },

  // GET /api/trust/reputation
  async getReputation(req, res) {
    const rep = await reputationEngine.getReputation(req.userId);
    res.json(rep);
  },

  // GET /api/trust/risk
  async getRisk(req, res) {
    const risk = await riskEngine.recalculateRisk(req.userId); // Force recalc on fetch for testing/demo
    res.json(risk);
  },

  // POST /api/trust/appeal
  async appeal(req, res) {
    const { restrictionId, reason, evidenceUrls } = req.body;
    const appeal = await moderationEngine.appealRestriction(req.userId, restrictionId, reason, evidenceUrls);
    res.status(201).json(appeal);
  }
};
