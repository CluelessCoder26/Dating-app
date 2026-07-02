import prisma from '../../config/prisma.js';
import { eventBus } from '../../events/eventBus.js';
import logger from '../../utils/logger.js';

class PromotionEngine {
  async applyPromotion(userId, code) {
    const promotion = await prisma.promotion.findUnique({ where: { code } });
    if (!promotion) throw new Error('Invalid promotion code');
    if (promotion.expiresAt && promotion.expiresAt < new Date()) throw new Error('Promotion expired');
    if (promotion.maxUses && promotion.uses >= promotion.maxUses) throw new Error('Promotion limit reached');

    // Check if user already used this promo
    const existing = await prisma.coupon.findFirst({ where: { userId, promotionId: promotion.id } });
    if (existing) throw new Error('Promotion already used');

    // Transaction
    const [coupon, updatedPromo] = await prisma.$transaction([
      prisma.coupon.create({ data: { userId, promotionId: promotion.id } }),
      prisma.promotion.update({ where: { id: promotion.id }, data: { uses: { increment: 1 } } })
    ]);

    eventBus.publish('spark.promotion.applied.v1', { userId, promotionId: promotion.id }).catch(() => {});
    return coupon;
  }
}

export const promotionEngine = new PromotionEngine();
