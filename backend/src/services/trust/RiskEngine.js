import prisma from '../../config/prisma.js';
import { reputationEngine } from './ReputationEngine.js';
import { eventBus } from '../../events/eventBus.js';
import logger from '../../utils/logger.js';
import { socketManager } from '../../sockets/SocketManager.js';

class RiskEngine {
  async initializeRisk(userId) {
    return await prisma.riskAssessment.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
  }

  async recalculateRisk(userId) {
    const risk = await this.initializeRisk(userId);
    const rep = await reputationEngine.getReputation(userId);

    // Compute basic heuristic risk
    let newOverallRisk = 0.0;
    if (rep.reportCount > 3) newOverallRisk += 0.3;
    if (rep.safetyScore < 50) newOverallRisk += 0.4;
    
    // Add AI/Fraud signals
    newOverallRisk += (risk.spamRisk * 0.3);
    newOverallRisk += (risk.fraudRisk * 0.4);

    newOverallRisk = Math.min(newOverallRisk, 1.0); // Clamp 0 to 1

    const updated = await prisma.riskAssessment.update({
      where: { userId },
      data: {
        overallRiskScore: newOverallRisk,
        lastEvaluatedAt: new Date()
      }
    });

    logger.info(`[RiskEngine] User ${userId} risk recalculated: ${newOverallRisk}`);

    await this.evaluateAutomatedActions(userId, newOverallRisk);
    return updated;
  }

  async evaluateAutomatedActions(userId, overallRisk) {
    if (overallRisk > 0.8) {
      await this.applyRestriction(userId, 'PERMANENT_BAN', 'Critical risk threshold exceeded');
    } else if (overallRisk > 0.6) {
      await this.applyRestriction(userId, 'SHADOW_BAN', 'High risk threshold exceeded');
    }
  }

  async applyRestriction(userId, type, reason) {
    // Check if restriction already active
    const active = await prisma.restriction.findFirst({
      where: { userId, type, active: true }
    });
    if (active) return;

    await prisma.restriction.create({
      data: { userId, type, reason }
    });

    await prisma.auditEvent.create({
      data: {
        targetId: userId,
        action: 'RESTRICTION_APPLIED',
        newState: JSON.stringify({ type }),
        reason
      }
    });

    logger.warn(`[RiskEngine] Applied ${type} to User ${userId}`);
    eventBus.publish('RESTRICTION_APPLIED', { userId, type, reason }).catch(() => {});

    const io = socketManager.getIO();
    if (io) {
      io.to(`user_${userId}`).emit('trust.updated', { restriction: type });
    }
  }
}

export const riskEngine = new RiskEngine();
