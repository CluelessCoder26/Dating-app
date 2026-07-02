import prisma from '../../config/prisma.js';
import { aiGateway } from './AIGateway.js';
import { eventBus } from '../../events/eventBus.js';
import redisManager from '../../config/redis.js';

class RelationshipMemoryEngine {
  async getMemory(matchId) {
    const cacheKey = `relmem:${matchId}`;
    const cached = await redisManager.get(cacheKey);
    if (cached) {
      if (cached) return JSON.parse(cached);
    }

    let memory = await prisma.relationshipMemory.findUnique({ where: { matchId } });
    if (!memory) {
      const match = await prisma.match.findUnique({ where: { id: matchId } });
      if (!match) throw new Error('Match not found');
      memory = await prisma.relationshipMemory.create({
        data: { matchId, user1Id: match.user1Id, user2Id: match.user2Id, sharedTopics: [], sharedInterests: [] }
      });
    }

    if (redisManager.isHealthy()) {
      await redisManager.setEx(cacheKey, 3600, JSON.stringify(memory));
    }
    return memory;
  }

  async updateFromConversation(matchId, conversationId) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    if (messages.length === 0) return null;

    const messageText = messages.map(m => m.content).filter(Boolean).join('\n');
    let summary = 'Conversation in progress.';
    let topics = [];
    try {
      const aiResult = await aiGateway.complete(null, 'SUMMARY', [
        { role: 'system', content: 'Extract shared topics and a brief summary from this conversation. Return JSON: {"summary": "...", "topics": [...], "tone": "FRIENDLY|FLIRTY|SERIOUS"}' },
        { role: 'user', content: messageText.substring(0, 2000) }
      ]);
      try {
        const parsed = JSON.parse(aiResult.content);
        summary = parsed.summary || summary;
        topics = parsed.topics || [];
      } catch (e) { summary = aiResult.content; }
    } catch (e) {}

    const memory = await prisma.relationshipMemory.update({
      where: { matchId },
      data: { summary, sharedTopics: topics }
    });

    await prisma.conversationSummary.upsert({
      where: { conversationId },
      update: { summary, topics, messageCount: messages.length, generatedAt: new Date() },
      create: { conversationId, summary, topics, messageCount: messages.length }
    });

    eventBus.publish('spark.ai.summary.created.v1', { matchId, conversationId }).catch(() => {});
    if (redisManager.isHealthy()) {
      await redisManager.delete(`relmem:${matchId}`);
    }
    return memory;
  }
}

export const relationshipMemoryEngine = new RelationshipMemoryEngine();
