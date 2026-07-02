import { aiGateway } from './AIGateway.js';

class ConversationIntelligence {
  async generateIcebreaker(userId, targetProfile) {
    const interests = targetProfile.interests?.join(', ') || 'general topics';
    const result = await aiGateway.complete(userId, 'ICEBREAKER', [
      { role: 'system', content: 'You are a dating coach. Generate a fun, creative icebreaker message (1-2 sentences) based on the profile interests. Be witty but respectful.' },
      { role: 'user', content: `Their interests: ${interests}. Their bio: ${targetProfile.bio || 'No bio'}` }
    ]);
    return result.content;
  }

  async generateReply(userId, conversationContext, lastMessage) {
    const result = await aiGateway.complete(userId, 'REPLY_SUGGESTION', [
      { role: 'system', content: 'You are a dating coach. Suggest a natural, engaging reply (1-2 sentences). Match the conversation tone.' },
      { role: 'user', content: `Conversation so far: ${conversationContext}\n\nTheir last message: ${lastMessage}` }
    ]);
    return result.content;
  }

  async analyzeTone(conversationText) {
    const result = await aiGateway.complete(null, 'TONE_ANALYSIS', [
      { role: 'system', content: 'Analyze the conversation tone. Return JSON: {"tone": "FRIENDLY|FLIRTY|SERIOUS|AWKWARD", "momentum": "RISING|STEADY|DECLINING", "ghostingRisk": 0.0-1.0}' },
      { role: 'user', content: conversationText.substring(0, 2000) }
    ]);
    try {
      return JSON.parse(result.content);
    } catch (e) {
      return { tone: 'FRIENDLY', momentum: 'STEADY', ghostingRisk: 0.0 };
    }
  }
}

export const conversationIntelligence = new ConversationIntelligence();
