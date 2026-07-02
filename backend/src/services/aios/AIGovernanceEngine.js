import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';
import logger from '../../utils/logger.js';

class AIGovernanceEngine {
  async checkRateLimit(userId, category, limit = 50, windowSeconds = 3600) {
    if (!redisManager) return true;
    const key = `ai:ratelimit:${userId}:${category}`;
    const count = await redisManager.increment(key);
    if (count === 1) await redisManager.expire(key, windowSeconds);
    if (count > limit) {
      await this.auditLog(null, userId, 'RATE_LIMITED', { category, count, limit });
      return false;
    }
    return true;
  }

  sanitizePrompt(input) {
    const dangerous = [
      /ignore\s+(all\s+)?previous\s+instructions/i,
      /you\s+are\s+now/i,
      /system\s*:\s*/i,
      /\[INST\]/i
    ];
    for (const pattern of dangerous) {
      if (pattern.test(input)) {
        logger.warn('[AIGovernance] Prompt injection attempt detected');
        return { safe: false, sanitized: '[BLOCKED]' };
      }
    }
    let sanitized = input.replace(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');
    sanitized = sanitized.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, '[PHONE_REDACTED]');
    return { safe: true, sanitized };
  }

  validateResponse(response) {
    if (!response || !response.content) return { valid: false, reason: 'Empty response' };
    if (response.content.length > 10000) return { valid: false, reason: 'Response too long' };
    return { valid: true };
  }

  async trackUsage(userId, provider, model, category, promptTokens, responseTokens, costUsd) {
    const period = new Date().toISOString().slice(0, 7);
    await prisma.aIUsage.create({
      data: { userId, provider, model, category, tokens: promptTokens + responseTokens, costUsd, period }
    });
  }

  async auditLog(requestId, userId, action, details) {
    await prisma.aIAudit.create({
      data: { requestId, userId, action, details: JSON.stringify(details) }
    });
  }

  async logRequest(userId, provider, model, category, promptTokens, responseTokens, costUsd, latencyMs, status = 'SUCCESS') {
    return await prisma.aIRequest.create({
      data: { userId, provider, model, category, promptTokens, responseTokens, costUsd, latencyMs, status }
    });
  }
}

export const aiGovernanceEngine = new AIGovernanceEngine();
