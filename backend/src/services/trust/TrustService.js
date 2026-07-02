import prisma from '../../config/prisma.js';
import { moderationQueue, riskQueue } from '../../config/bullmq.js';
import { eventBus } from '../../events/eventBus.js';

class TrustService {
  async blockUser(blockerId, blockedId) {
    const block = await prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      update: {},
      create: { blockerId, blockedId }
    });

    eventBus.publish('USER_BLOCKED', { blockerId, blockedId }).catch(() => {});
    return block;
  }

  async unblockUser(blockerId, blockedId) {
    await prisma.block.deleteMany({
      where: { blockerId, blockedId }
    });
    eventBus.publish('USER_UNBLOCKED', { blockerId, blockedId }).catch(() => {});
  }

  async muteUser(muterId, mutedId) {
    const mute = await prisma.mute.upsert({
      where: { muterId_mutedId: { muterId, mutedId } },
      update: {},
      create: { muterId, mutedId }
    });

    eventBus.publish('USER_MUTED', { muterId, mutedId }).catch(() => {});
    return mute;
  }

  async unmuteUser(muterId, mutedId) {
    await prisma.mute.deleteMany({
      where: { muterId, mutedId }
    });
    eventBus.publish('USER_UNMUTED', { muterId, mutedId }).catch(() => {});
  }

  async reportEntity(reporterId, reportedId, targetType, targetId, reasonCategory, customReason, evidenceUrls = []) {
    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedId,
        targetType,
        targetId,
        reasonCategory,
        customReason,
        evidenceUrls
      }
    });

    // Queue Moderation & Risk recalculation asynchronously
    await moderationQueue.add('processReport', { reportId: report.id });
    await riskQueue.add('recalculateRisk', { userId: reportedId });

    eventBus.publish('REPORT_CREATED', { reportId: report.id, reportedId }).catch(() => {});
    return report;
  }

  async getReports(reporterId) {
    return await prisma.report.findMany({
      where: { reporterId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const trustService = new TrustService();
