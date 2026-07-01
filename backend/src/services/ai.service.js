import crypto from 'crypto';
import logger from '../utils/logger.js';
import { env } from '../config/env.js';
import { MockAIProvider } from './ai/providers/MockAIProvider.js';
import sharp from 'sharp';
import blockhash from 'blockhash-core';

class AIService {
  constructor() {
    // Dynamic provider injection based on ENV or default to Mock
    const providerType = env.AI_PROVIDER || 'mock';
    
    if (providerType === 'mock') {
      this.provider = new MockAIProvider();
    } else {
      // Future: load AWS Rekognition, Google, etc.
      this.provider = new MockAIProvider(); 
    }
    
    logger.info(`AIService initialized with provider: ${this.provider.providerName}`);
  }

  async verifyProfilePhoto(buffer) {
    try {
      const result = await this.provider.verifyProfilePhoto(buffer);
      return { ...result, providerName: this.provider.providerName };
    } catch (err) {
      logger.error(`AI Verification Failed: ${err.message}`);
      throw err;
    }
  }

  async generatePerceptualHash(buffer) {
    try {
      const { data, info } = await sharp(buffer)
        .ensureAlpha()
        .resize(32, 32, { fit: 'fill' }) // Needs to be exact size for blockhash, or we just pass the info
        .raw()
        .toBuffer({ resolveWithObject: true });

      // blockhash-core expects { width, height, data }
      // Using 16 bit hash
      const hash = blockhash.bmvbhash({ width: info.width, height: info.height, data }, 8);
      return hash;
    } catch (err) {
      logger.warn(`Perceptual Hash generation failed: ${err.message}`);
      // Fallback to SHA256 if perceptual fails
      return crypto.createHash('sha256').update(buffer).digest('hex');
    }
  }

  computeTrustScore(aiResult, isDuplicate) {
    let score = 100;
    const failureReasons = [];
    let status = 'approved';

    if (aiResult.faceCount !== 1) {
      score -= 50;
      failureReasons.push(aiResult.faceCount === 0 ? 'NO_FACE_DETECTED' : 'MULTIPLE_FACES_DETECTED');
      status = 'rejected';
    }

    if (aiResult.aiProbability > 0.85) {
      score -= 40;
      failureReasons.push('HIGH_AI_PROBABILITY');
      status = 'manual_review';
    }

    if (aiResult.nsfwScore > 0.6) {
      score -= 100;
      failureReasons.push('NSFW_CONTENT_DETECTED');
      status = 'rejected';
    }

    if (aiResult.violenceScore > 0.6) {
      score -= 100;
      failureReasons.push('VIOLENCE_DETECTED');
      status = 'rejected';
    }

    if (aiResult.watermarkScore > 0.7) {
      score -= 20;
      failureReasons.push('WATERMARK_DETECTED');
    }

    if (isDuplicate) {
      score -= 80;
      failureReasons.push('DUPLICATE_IMAGE_DETECTED');
      status = 'rejected';
    }

    if (aiResult.blurScore > 60 || aiResult.qualityScore < 40) {
      score -= 20;
      failureReasons.push('LOW_QUALITY_IMAGE');
    }

    return {
      status,
      trustScore: Math.max(0, score),
      failureReasons
    };
  }
}

export const aiService = new AIService();
