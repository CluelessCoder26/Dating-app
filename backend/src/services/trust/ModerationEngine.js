import prisma from '../../config/prisma.js';
import { eventBus } from '../../events/eventBus.js';
import logger from '../../utils/logger.js';
import { riskEngine } from './RiskEngine.js';

class ModerationEngine {
  async createCase(userId, trigger, severity = 'LOW') {
    const modCase = await prisma.moderationCase.create({
      data: {
        userId,
        trigger,
        severity
      }
    });

    logger.info(`[ModerationEngine] Case ${modCase.id} opened for User ${userId}`);
    return modCase;
  }

  async resolveCase(caseId, moderatorId, action, notes) {
    const modCase = await prisma.moderationCase.update({
      where: { id: caseId },
      data: {
        status: 'CLOSED',
        resolution: action
      }
    });

    await prisma.moderatorAction.create({
      data: {
        moderatorId,
        caseId,
        action,
        notes
      }
    });

    // If the moderator decides to ban, route to RiskEngine
    if (action === 'BAN') {
      await riskEngine.applyRestriction(modCase.userId, 'PERMANENT_BAN', notes || 'Moderator Decision');
    } else if (action === 'WARN') {
      await riskEngine.applyRestriction(modCase.userId, 'WARNING', notes || 'Moderator Warning');
    }

    eventBus.publish('MODERATION_COMPLETED', { caseId, action }).catch(() => {});
    return modCase;
  }

  async appealRestriction(userId, restrictionId, reason, evidenceUrls = []) {
    const appeal = await prisma.appeal.create({
      data: {
        userId,
        restrictionId,
        reason,
        evidenceUrls
      }
    });
    
    eventBus.publish('APPEAL_CREATED', { appealId: appeal.id, userId }).catch(() => {});
    return appeal;
  }

  async resolveAppeal(appealId, moderatorId, status, note) {
    const appeal = await prisma.appeal.update({
      where: { id: appealId },
      data: {
        status,
        moderatorId,
        moderatorNote: note
      }
    });

    if (status === 'APPROVED') {
      await prisma.restriction.update({
        where: { id: appeal.restrictionId },
        data: { active: false, expiresAt: new Date() }
      });
      eventBus.publish('RESTRICTION_REMOVED', { restrictionId: appeal.restrictionId, userId: appeal.userId }).catch(() => {});
    }

    eventBus.publish('APPEAL_UPDATED', { appealId, status }).catch(() => {});
    return appeal;
  }
}

export const moderationEngine = new ModerationEngine();
