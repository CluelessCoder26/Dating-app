import crypto from 'crypto';
import { AIProvider } from '../AIProvider.js';

export class MockAIProvider extends AIProvider {
  constructor() {
    super('MockProvider');
  }

  async verifyProfilePhoto(buffer) {
    const start = Date.now();
    
    // Simulate network latency (50-200ms)
    await new Promise(res => setTimeout(res, 50 + Math.random() * 150));

    const isAI = Math.random() < 0.1; // 10% chance
    
    const result = {
      faceCount: 1,
      qualityScore: Math.floor(Math.random() * 20) + 80,
      blurScore: Math.floor(Math.random() * 15),
      brightnessScore: Math.floor(Math.random() * 20) + 40,
      aiProbability: isAI ? 0.95 : 0.02,
      nsfwScore: Math.random() * 0.05,
      violenceScore: Math.random() * 0.01,
      watermarkScore: Math.random() * 0.1,
      modelVersions: JSON.stringify({ face: 'v3.1-mock', nsfw: 'v4.0-mock', ai: 'v2.2-mock' }),
      embeddingReference: crypto.randomUUID(),
      executionTimeMs: Date.now() - start
    };

    return result;
  }
}
