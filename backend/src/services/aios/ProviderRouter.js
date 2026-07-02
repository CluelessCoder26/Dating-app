import { MockLLMProvider } from './providers/MockLLMProvider.js';
import { MockEmbeddingProvider } from './providers/MockEmbeddingProvider.js';
import logger from '../../utils/logger.js';

class ProviderRouter {
  constructor() {
    this.llmProviders = { mock: new MockLLMProvider() };
    this.embeddingProviders = { mock: new MockEmbeddingProvider() };
    this.defaultLLM = 'mock';
    this.defaultEmbedding = 'mock';
  }

  getLLMProvider(name) {
    return this.llmProviders[name] || this.llmProviders[this.defaultLLM];
  }

  getEmbeddingProvider(name) {
    return this.embeddingProviders[name] || this.embeddingProviders[this.defaultEmbedding];
  }

  async completeWithFallback(messages, options = {}) {
    const primaryName = options.provider || this.defaultLLM;
    const primary = this.getLLMProvider(primaryName);
    try {
      return await primary.complete(messages, options);
    } catch (err) {
      logger.warn(`[ProviderRouter] Primary provider ${primaryName} failed, falling back to mock`);
      if (primaryName !== 'mock') {
        return await this.llmProviders.mock.complete(messages, options);
      }
      throw err;
    }
  }
}

export const providerRouter = new ProviderRouter();
