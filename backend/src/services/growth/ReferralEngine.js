import prisma from '../../config/prisma.js';
import { rewardEngine } from './RewardEngine.js';
import { eventBus } from '../../events/eventBus.js';

class ReferralEngine {
  async processReferral(referrerId, refereeId) {
    const existing = await prisma.referral.findUnique({ where: { refereeId } });
    if (existing) throw new Error('User already referred');
    if (referrerId === refereeId) throw new Error('Cannot refer yourself');

    const referral = await prisma.referral.create({
      data: { referrerId, refereeId, status: 'COMPLETED' }
    });

    // Grant reward
    await rewardEngine.grantReward(referrerId, 'PREMIUM_DAYS', 3); // 3 days free

    eventBus.publish('spark.referral.completed.v1', { referrerId, refereeId }).catch(() => {});
    return referral;
  }
}

export const referralEngine = new ReferralEngine();
