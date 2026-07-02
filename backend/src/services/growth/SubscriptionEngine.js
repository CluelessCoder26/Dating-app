import prisma from '../../config/prisma.js';
import { eventBus } from '../../events/eventBus.js';
import { MockBillingProvider } from '../billing/MockBillingProvider.js';
import { entitlementEngine } from './EntitlementEngine.js';
import logger from '../../utils/logger.js';
import redisManager from '../../config/redis.js';

class SubscriptionEngine {
  constructor() {
    this.billingProvider = new MockBillingProvider();
  }

  async getPlans() {
    let plans = [];
    const cached = await redisManager.get('plans');
    if (cached) {
      if (cached) return JSON.parse(cached);
    }
    plans = await prisma.plan.findMany();
    if (redisManager && plans.length > 0) {
      await redisManager.setEx('plans', 3600, JSON.stringify(plans));
    }
    return plans;
  }

  async subscribe(userId, planId) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error('Plan not found');

    // 1. Process via Provider
    const providerData = await this.billingProvider.createSubscription(userId, plan.id);
    
    // 2. Create DB Record
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: providerData.status,
        provider: 'mock',
        providerSubscriptionId: providerData.providerSubscriptionId,
        currentPeriodEnd: providerData.currentPeriodEnd
      }
    });

    // 3. Grant basic entitlements based on plan level
    if (plan.level >= 1) {
      await entitlementEngine.grantEntitlement(subscription.id, 'unlimited_swipes');
      await entitlementEngine.grantEntitlement(subscription.id, 'read_receipts');
    }
    if (plan.level >= 2) {
      await entitlementEngine.grantEntitlement(subscription.id, 'priority_discovery');
      await entitlementEngine.grantEntitlement(subscription.id, 'incognito');
    }

    eventBus.publish('spark.subscription.created.v1', { userId, subscriptionId: subscription.id }).catch(() => {});
    return subscription;
  }

  async cancelSubscription(userId, subscriptionId) {
    const sub = await prisma.subscription.findFirst({ where: { id: subscriptionId, userId } });
    if (!sub) throw new Error('Subscription not found');

    const providerData = await this.billingProvider.cancelSubscription(sub.providerSubscriptionId);
    
    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: providerData.status, cancelAtPeriodEnd: providerData.cancelAtPeriodEnd }
    });

    eventBus.publish('spark.subscription.cancelled.v1', { userId, subscriptionId: sub.id }).catch(() => {});
    return updated;
  }
}

export const subscriptionEngine = new SubscriptionEngine();
