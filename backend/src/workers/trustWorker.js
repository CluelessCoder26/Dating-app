import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import prisma from '../config/prisma.js';
import { safetyEngine } from '../services/trust/SafetyEngine.js';
import { riskEngine } from '../services/trust/RiskEngine.js';

export const setupTrustWorkers = () => {
  const moderationWorker = new Worker('moderationQueue', async (job) => {
    const { reportId } = job.data;
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) return;

    logger.info(`[ModerationWorker] Processing report ${report.id}`);
    
    // Pass to SafetyEngine
    await safetyEngine.analyzeReport(
      report.id,
      report.reporterId,
      report.reportedId,
      report.targetType,
      report.targetId,
      report.reasonCategory
    );

    // Close out report status
    await prisma.report.update({
      where: { id: report.id },
      data: { status: 'RESOLVED' }
    });

  }, { connection: { url: env.REDIS_URL } });

  const riskWorker = new Worker('riskQueue', async (job) => {
    const { userId } = job.data;
    logger.info(`[RiskWorker] Recalculating risk for user ${userId}`);
    await riskEngine.recalculateRisk(userId);
  }, { connection: { url: env.REDIS_URL } });

  return { moderationWorker, riskWorker };
};
