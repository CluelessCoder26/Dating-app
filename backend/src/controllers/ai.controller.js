import { compatibilityEngine } from '../services/aios/CompatibilityEngine.js';
import { relationshipMemoryEngine } from '../services/aios/RelationshipMemoryEngine.js';
import { conversationIntelligence } from '../services/aios/ConversationIntelligence.js';
import { profileIntelligence } from '../services/aios/ProfileIntelligence.js';
import prisma from '../config/prisma.js';

export const aiController = {
  async reviewProfile(req, res) {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    const review = await profileIntelligence.reviewProfile(req.userId, profile);
    res.json(review);
  },

  async improveProfile(req, res) {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    const improved = await profileIntelligence.improveBio(req.userId, profile.bio, profile.interests);
    res.json({ bio: improved });
  },

  async getCompatibility(req, res) {
    const match = await prisma.match.findUnique({ where: { id: req.params.matchId } });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    const otherId = match.user1Id === req.userId ? match.user2Id : match.user1Id;
    const compat = await compatibilityEngine.calculateCompatibility(req.userId, otherId);
    res.json(compat);
  },

  async generateIcebreaker(req, res) {
    const { targetUserId } = req.body;
    const targetProfile = await prisma.profile.findUnique({ where: { userId: targetUserId } });
    if (!targetProfile) return res.status(404).json({ error: 'Target profile not found' });
    const icebreaker = await conversationIntelligence.generateIcebreaker(req.userId, targetProfile);
    res.json({ icebreaker });
  },

  async generateReply(req, res) {
    const { conversationContext, lastMessage } = req.body;
    const reply = await conversationIntelligence.generateReply(req.userId, conversationContext, lastMessage);
    res.json({ reply });
  },

  async getConversationSummary(req, res) {
    const { conversationId } = req.body;
    const convo = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!convo) return res.status(404).json({ error: 'Conversation not found' });
    if (convo.matchId) {
      await relationshipMemoryEngine.updateFromConversation(convo.matchId, conversationId);
    }
    const summary = await prisma.conversationSummary.findUnique({ where: { conversationId } });
    res.json(summary);
  },

  async getRelationshipMemory(req, res) {
    const memory = await relationshipMemoryEngine.getMemory(req.params.matchId);
    res.json(memory);
  },

  async getProfileInsights(req, res) {
    const profile = await prisma.profile.findUnique({ where: { userId: req.userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    const review = await profileIntelligence.reviewProfile(req.userId, profile);
    res.json(review);
  },

  async getAnalytics(req, res) {
    const usage = await prisma.aIUsage.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    res.json(usage);
  }
};
