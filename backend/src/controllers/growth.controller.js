import { growthService } from '../services/growth/GrowthService.js';
import prisma from '../config/prisma.js';

export const growthController = {
  async getPlans(req, res) {
    const plans = await growthService.getPlans();
    res.json(plans);
  },

  async subscribe(req, res) {
    const { planId } = req.body;
    const sub = await growthService.subscribe(req.userId, planId);
    res.status(201).json(sub);
  },

  async getSubscriptions(req, res) {
    const subs = await prisma.subscription.findMany({ where: { userId: req.userId } });
    res.json(subs);
  },

  async cancelSubscription(req, res) {
    const sub = await growthService.cancelSubscription(req.userId, req.params.id);
    res.json(sub);
  },

  async getEntitlements(req, res) {
    const featureKey = req.query.feature;
    if (featureKey) {
      const hasAccess = await growthService.canUserAccess(req.userId, featureKey);
      return res.json({ feature: featureKey, access: hasAccess });
    }
    // Return all for user (naive approach)
    const entitlements = await prisma.entitlement.findMany({
      where: { subscription: { userId: req.userId, status: 'active' }, active: true },
      include: { feature: true }
    });
    res.json(entitlements);
  },

  async getFeatures(req, res) {
    const features = await prisma.feature.findMany();
    res.json(features);
  },

  async getFeatureFlags(req, res) {
    const key = req.query.key;
    if (key) {
      const enabled = await growthService.isFeatureEnabled(key, req.userId);
      return res.json({ key, enabled });
    }
    res.json([]);
  },

  async getExperiments(req, res) {
    const key = req.query.key;
    if (key) {
      const variant = await growthService.getExperimentVariant(req.userId, key);
      return res.json({ key, variant });
    }
    res.json([]);
  },

  async applyPromotion(req, res) {
    const { code } = req.body;
    const coupon = await growthService.applyPromotion(req.userId, code);
    res.status(201).json(coupon);
  },

  async getPromotions(req, res) {
    const coupons = await prisma.coupon.findMany({ where: { userId: req.userId }, include: { promotion: true } });
    res.json(coupons);
  },

  async getRewards(req, res) {
    const rewards = await growthService.getRewards(req.userId);
    res.json(rewards);
  },

  async redeemReward(req, res) {
    const reward = await growthService.redeemReward(req.userId, req.params.id);
    res.json(reward);
  },

  async processReferral(req, res) {
    const { refereeId } = req.body;
    const referral = await growthService.processReferral(req.userId, refereeId);
    res.status(201).json(referral);
  },

  async getReferrals(req, res) {
    const referrals = await prisma.referral.findMany({ where: { referrerId: req.userId } });
    res.json(referrals);
  },

  async getAchievements(req, res) {
    const achievements = await growthService.getAchievements(req.userId);
    res.json(achievements);
  }
};
