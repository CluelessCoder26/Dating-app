import prisma from '../../config/prisma.js';
import { eventBus } from '../../events/eventBus.js';

class RewardEngine {
  async grantReward(userId, type, amount = 1) {
    const reward = await prisma.reward.create({
      data: { userId, type, amount }
    });
    eventBus.publish('spark.reward.granted.v1', { userId, rewardId: reward.id, type }).catch(() => {});
    return reward;
  }

  async getRewards(userId) {
    return await prisma.reward.findMany({ where: { userId } });
  }

  async redeemReward(userId, rewardId) {
    const reward = await prisma.reward.findFirst({ where: { id: rewardId, userId, status: 'GRANTED' } });
    if (!reward) throw new Error('Reward not found or already redeemed');

    const updated = await prisma.reward.update({
      where: { id: rewardId },
      data: { status: 'REDEEMED', redeemedAt: new Date() }
    });

    eventBus.publish('spark.reward.redeemed.v1', { userId, rewardId, type: updated.type }).catch(() => {});
    return updated;
  }
}

export const rewardEngine = new RewardEngine();
