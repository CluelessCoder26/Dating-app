import crypto from 'crypto';
import { LLMProvider } from './LLMProvider.js';

export class MockLLMProvider extends LLMProvider {
  constructor() {
    super('mock');
  }

  async complete(messages, options = {}) {
    const start = Date.now();
    await new Promise(r => setTimeout(r, 50 + Math.random() * 100));
    const lastMessage = messages[messages.length - 1]?.content || '';
    return {
      id: crypto.randomUUID(),
      content: `Mock AI response for: ${lastMessage.substring(0, 50)}`,
      model: options.model || 'mock-gpt-4',
      promptTokens: Math.floor(lastMessage.length / 4),
      responseTokens: 25,
      latencyMs: Date.now() - start
    };
  }
}
