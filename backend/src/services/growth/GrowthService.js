import { subscriptionEngine } from './SubscriptionEngine.js';
import { entitlementEngine } from './EntitlementEngine.js';
import { featureFlagEngine } from './FeatureFlagEngine.js';
import { experimentEngine } from './ExperimentEngine.js';
import { promotionEngine } from './PromotionEngine.js';
import { rewardEngine } from './RewardEngine.js';
import { referralEngine } from './ReferralEngine.js';
import { growthEngine } from './GrowthEngine.js';

class GrowthService {
  // Subscriptions
  getPlans() { return subscriptionEngine.getPlans(); }
  subscribe(userId, planId) { return subscriptionEngine.subscribe(userId, planId); }
  cancelSubscription(userId, subId) { return subscriptionEngine.cancelSubscription(userId, subId); }
  
  // Entitlements
  canUserAccess(userId, featureKey) { return entitlementEngine.canUserAccess(userId, featureKey); }

  // Flags & Experiments
  isFeatureEnabled(key, userId) { return featureFlagEngine.isEnabled(key, userId); }
  getExperimentVariant(userId, experimentKey) { return experimentEngine.getVariant(userId, experimentKey); }

  // Promotions
  applyPromotion(userId, code) { return promotionEngine.applyPromotion(userId, code); }

  // Rewards
  getRewards(userId) { return rewardEngine.getRewards(userId); }
  redeemReward(userId, rewardId) { return rewardEngine.redeemReward(userId, rewardId); }

  // Referrals
  processReferral(referrerId, refereeId) { return referralEngine.processReferral(referrerId, refereeId); }

  // Growth / Achievements
  getAchievements(userId) { return growthEngine.getAchievements(userId); }
}

export const growthService = new GrowthService();
