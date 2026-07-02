import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';
import logger from '../../utils/logger.js';

class EntitlementEngine {
  async canUserAccess(userId, featureKey) {
    if (!redisManager) {
      return await this._checkDb(userId, featureKey);
    }
    const cached = await redisManager.get(`entitlement:${userId}:${featureKey}`);
    if (cached !== null) return cached === 'true';

    const hasAccess = await this._checkDb(userId, featureKey);
    await redisManager.setEx(`entitlement:${userId}:${featureKey}`, 3600, String(hasAccess));
    return hasAccess;
  }

  async _checkDb(userId, featureKey) {
    const entitlement = await prisma.entitlement.findFirst({
      where: {
        subscription: { userId, status: 'active' },
        feature: { key: featureKey },
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });
    return !!entitlement;
  }

  async grantEntitlement(subscriptionId, featureKey) {
    let feature = await prisma.feature.findUnique({ where: { key: featureKey } });
    if (!feature) {
      feature = await prisma.feature.create({ data: { name: featureKey, key: featureKey } });
    }

    const entitlement = await prisma.entitlement.upsert({
      where: { subscriptionId_featureId: { subscriptionId, featureId: feature.id } },
      update: { active: true, expiresAt: null },
      create: { subscriptionId, featureId: feature.id, active: true }
    });
    return entitlement;
  }
}

export const entitlementEngine = new EntitlementEngine();
