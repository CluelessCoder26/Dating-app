import prisma from '../../config/prisma.js';
import { aiGateway } from './AIGateway.js';
import { embeddingEngine } from './EmbeddingEngine.js';
import { eventBus } from '../../events/eventBus.js';
import redisManager from '../../config/redis.js';

class CompatibilityEngine {
  async calculateCompatibility(user1Id, user2Id) {
    const cacheKey = `compat:${[user1Id, user2Id].sort().join(':')}`;
    const cached = await redisManager.get(cacheKey);
    if (cached) {
      if (cached) return JSON.parse(cached);
    }

    const [p1, p2] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: user1Id } }),
      prisma.profile.findUnique({ where: { userId: user2Id } })
    ]);
    if (!p1 || !p2) throw new Error('Profile not found');

    const sharedInterests = p1.interests.filter(i => p2.interests.includes(i));
    const interestScore = Math.min(100, Math.round((sharedInterests.length / Math.max(p1.interests.length, 1)) * 100));
    const lifestyleScore = p1.lifestyle === p2.lifestyle ? 80 : 40;
    const goalScore = p1.relationshipGoals === p2.relationshipGoals ? 90 : 30;

    let conversationScore = 50;
    try {
      const [e1, e2] = await Promise.all([
        embeddingEngine.getEmbedding('PROFILE', user1Id),
        embeddingEngine.getEmbedding('PROFILE', user2Id)
      ]);
      if (e1 && e2) {
        const v1 = JSON.parse(e1.vector);
        const v2 = JSON.parse(e2.vector);
        const sim = embeddingEngine.cosineSimilarity(v1, v2);
        conversationScore = Math.round((sim + 1) / 2 * 100);
      }
    } catch (e) {}

    const overallScore = Math.round(
      interestScore * 0.3 + lifestyleScore * 0.2 + goalScore * 0.25 + conversationScore * 0.25
    );

    let explanation = `You share ${sharedInterests.length} interests.`;
    try {
      const aiResult = await aiGateway.complete(user1Id, 'COMPATIBILITY', [
        { role: 'system', content: 'You are a dating compatibility analyst. Give a brief 1-2 sentence compatibility summary.' },
        { role: 'user', content: `User 1 interests: ${p1.interests.join(', ')}. User 2 interests: ${p2.interests.join(', ')}. Shared: ${sharedInterests.join(', ')}. Score: ${overallScore}/100.` }
      ]);
      explanation = aiResult.content;
    } catch (e) {}

    const profile = await prisma.compatibilityProfile.upsert({
      where: { user1Id_user2Id: { user1Id, user2Id } },
      update: { overallScore, interestScore, lifestyleScore, conversationScore, relationshipGoalScore: goalScore, explanation, generatedAt: new Date() },
      create: { user1Id, user2Id, overallScore, interestScore, lifestyleScore, conversationScore, relationshipGoalScore: goalScore, explanation }
    });

    if (redisManager.isHealthy()) {
      await redisManager.setEx(cacheKey, 3600, JSON.stringify(profile));
    }

    eventBus.publish('spark.ai.compatibility.generated.v1', { user1Id, user2Id, overallScore }).catch(() => {});
    return profile;
  }
}

export const compatibilityEngine = new CompatibilityEngine();
