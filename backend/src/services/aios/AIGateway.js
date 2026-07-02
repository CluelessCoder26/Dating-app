import { providerRouter } from './ProviderRouter.js';
import { aiGovernanceEngine } from './AIGovernanceEngine.js';
import { promptEngine } from './PromptEngine.js';
import { costManager } from './CostManager.js';
import { eventBus } from '../../events/eventBus.js';
import redisManager from '../../config/redis.js';
import logger from '../../utils/logger.js';

class AIGateway {
  async complete(userId, category, messages, options = {}) {
    const allowed = await aiGovernanceEngine.checkRateLimit(userId, category);
    if (!allowed) throw new Error('AI rate limit exceeded');

    const sanitizedMessages = messages.map(m => {
      if (m.role === 'user') {
        const check = aiGovernanceEngine.sanitizePrompt(m.content);
        if (!check.safe) throw new Error('Prompt injection detected');
        return { ...m, content: check.sanitized };
      }
      return m;
    });

    const cacheKey = `ai:cache:${category}:${JSON.stringify(sanitizedMessages).substring(0, 200)}`;
    const cached = await redisManager.get(cacheKey);
    if (cached) {
      if (cached) {
        await aiGovernanceEngine.logRequest(userId, 'cache', 'cache', category, 0, 0, 0, 0, 'CACHED');
        return JSON.parse(cached);
      }
    }

    const result = await providerRouter.completeWithFallback(sanitizedMessages, options);

    const validation = aiGovernanceEngine.validateResponse(result);
    if (!validation.valid) {
      logger.warn(`[AIGateway] Invalid response: ${validation.reason}`);
      throw new Error(`AI response validation failed: ${validation.reason}`);
    }

    const cost = costManager.calculateCost(
      result.model || 'mock-gpt-4',
      result.promptTokens || 0,
      result.responseTokens || 0
    );

    await aiGovernanceEngine.logRequest(
      userId, options.provider || 'mock', result.model || 'mock-gpt-4', category,
      result.promptTokens || 0, result.responseTokens || 0, cost, result.latencyMs || 0
    );

    await aiGovernanceEngine.trackUsage(
      userId, options.provider || 'mock', result.model || 'mock-gpt-4', category,
      result.promptTokens || 0, result.responseTokens || 0, cost
    );

    if (redisManager.isHealthy()) {
      await redisManager.setEx(cacheKey, 1800, JSON.stringify(result));
    }

    return result;
  }

  async renderAndComplete(userId, category, promptKey, variables, options = {}) {
    const rendered = await promptEngine.render(promptKey, variables);
    const messages = [
      { role: 'system', content: 'You are Spark AI, an intelligent dating assistant.' },
      { role: 'user', content: rendered }
    ];
    return this.complete(userId, category, messages, options);
  }
}

export const aiGateway = new AIGateway();
