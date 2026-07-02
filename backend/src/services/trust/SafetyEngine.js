import { riskQueue, moderationQueue } from '../../config/bullmq.js';
import logger from '../../utils/logger.js';

// Since I don't know the exact factory structure in Phase 4, I'll use a local instance or standard import.
import { MockAIProvider } from '../ai/providers/MockAIProvider.js';

class SafetyEngine {
  constructor() {
    this.aiProvider = new MockAIProvider(); // Use Mock for tests/development
  }

  async scanMessage(messageContent) {
    // 1. Keyword Checks (Synchronous)
    const badWords = ['scam', 'spam', 'wire transfer', 'crypto', 'cashapp'];
    const lowerContent = messageContent.toLowerCase();
    const hasBadWord = badWords.some(word => lowerContent.includes(word));

    // 2. AI Confidence (Asynchronous simulation)
    const result = await this.aiProvider.analyzeText(messageContent);
    
    return {
      isSafe: !hasBadWord && result.confidence > 0.5,
      flags: hasBadWord ? ['RESTRICTED_KEYWORDS'] : [],
      aiConfidence: result.confidence
    };
  }

  async analyzeReport(reportId, reporterId, reportedId, targetType, targetId, reasonCategory) {
    logger.info(`[SafetyEngine] Analyzing report ${reportId}`);
    
    // In production, this might trigger the AI to fetch context (e.g. read the reported message)
    // For now, we queue the RiskEngine to penalize the reported user.
    await riskQueue.add('recalculateRisk', { userId: reportedId });
    
    return {
      action: 'RISK_RECALCULATED'
    };
  }
}

export const safetyEngine = new SafetyEngine();
