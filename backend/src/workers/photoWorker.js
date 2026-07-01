import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';
import prisma from '../config/prisma.js';
import { aiService } from '../services/ai.service.js';
import { profileService } from '../services/profile.service.js';
import { deadLetterQueue } from '../config/bullmq.js';

export const setupPhotoWorker = () => {
  const worker = new Worker('photoVerificationQueue', async (job) => {
    const { photoId, bufferData, userId } = job.data;
    const buffer = Buffer.from(bufferData, 'base64');
    
    logger.info(`Processing AI Verification for photo: ${photoId} (Attempt ${job.attemptsMade + 1})`);

    try {
      // 1. AI Analysis
      const aiResult = await aiService.verifyProfilePhoto(buffer);
      
      // 2. Duplicate Detection
      const pHash = await aiService.generatePerceptualHash(buffer);
      
      const existingDuplicate = await prisma.photoVerification.findFirst({
        where: { embeddingReference: pHash } // Simplified duplicate check matching hash
      });

      const isDuplicate = !!existingDuplicate;

      // 3. Compute Trust Score
      const { status, trustScore, failureReasons } = aiService.computeTrustScore(aiResult, isDuplicate);

      // 4. Update Database
      await prisma.photoVerification.update({
        where: { photoId },
        data: {
          status,
          trustScore,
          faceCount: aiResult.faceCount,
          qualityScore: aiResult.qualityScore,
          blurScore: aiResult.blurScore,
          brightnessScore: aiResult.brightnessScore,
          aiProbability: aiResult.aiProbability,
          nsfwScore: aiResult.nsfwScore,
          violenceScore: aiResult.violenceScore,
          watermarkScore: aiResult.watermarkScore,
          duplicateScore: isDuplicate ? 1.0 : 0.0,
          embeddingReference: pHash,
          modelVersions: aiResult.modelVersions,
          providerName: aiResult.providerName,
          executionTimeMs: aiResult.executionTimeMs,
          failureReasons,
          verificationTime: new Date()
        }
      });

      // 5. If approved, update user's profile trust score and completion
      if (status === 'approved') {
        const profile = await prisma.profile.findUnique({ where: { userId } });
        if (profile) {
          await prisma.profile.update({
            where: { userId },
            data: { profileQualityScore: trustScore }
          });
          
          await profileService.calculateCompletionScore(userId);
        }
      }

      logger.info(`Photo ${photoId} verification complete. Status: ${status}, Score: ${trustScore}`);
    } catch (err) {
      logger.error(`Photo worker failed for ${photoId}: ${err.message}`);
      throw err;
    }
  }, {
    connection: { url: env.REDIS_URL },
    concurrency: 3
  });

  worker.on('failed', async (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message} (Attempt ${job.attemptsMade} of ${job.opts.attempts})`);
    
    // DLQ Handling
    if (job.attemptsMade >= job.opts.attempts) {
      logger.warn(`Job ${job.id} exhausted retries. Moving to deadLetterQueue.`);
      try {
        await deadLetterQueue.add('failedVerification', {
          originalQueue: 'photoVerificationQueue',
          jobData: job.data,
          error: err.message,
          failedAt: new Date()
        });
      } catch (dlqErr) {
        logger.error(`Failed to push to DLQ: ${dlqErr.message}`);
      }
    }
  });

  return worker;
};
