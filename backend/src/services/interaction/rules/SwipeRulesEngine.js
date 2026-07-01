/**
 * Base Rule Class
 */
export class SwipeRule {
  /**
   * Execute validation logic
   * @param {Object} context { actorId, targetId, action, actorProfile, targetProfile }
   * @returns {Promise<{ pass: boolean, reason?: string }>}
   */
  async evaluate(context) {
    throw new Error('evaluate() must be implemented');
  }
}

/**
 * Ensures the target user is active
 */
export class UserActiveRule extends SwipeRule {
  async evaluate({ targetProfile }) {
    if (!targetProfile || targetProfile.user.status !== 'active') {
      return { pass: false, reason: 'Target user is not active or does not exist.' };
    }
    return { pass: true };
  }
}

/**
 * Prevents identical swipes (Swipe once)
 */
export class NotAlreadySwipedRule extends SwipeRule {
  async evaluate({ actorId, targetId }, { prisma }) {
    const existing = await prisma.swipe.findFirst({
      where: { swiperId: actorId, targetId }
    });
    if (existing) {
      return { pass: false, reason: 'Already swiped on this user.' };
    }
    return { pass: true };
  }
}

/**
 * Ensures user isn't blocked by target or actor
 */
export class NotBlockedRule extends SwipeRule {
  async evaluate({ actorId, targetId }, { prisma }) {
    const block = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: actorId, blockedId: targetId },
          { blockerId: targetId, blockedId: actorId }
        ]
      }
    });
    if (block) {
      return { pass: false, reason: 'Interaction blocked by privacy settings.' };
    }
    return { pass: true };
  }
}

/**
 * Rules Engine Orchestrator
 */
export class SwipeRulesEngine {
  constructor(prismaClient) {
    this.prisma = prismaClient;
    this.rules = [
      new UserActiveRule(),
      new NotBlockedRule(),
      new NotAlreadySwipedRule()
    ];
  }

  async validate(context) {
    for (const rule of this.rules) {
      const result = await rule.evaluate(context, { prisma: this.prisma });
      if (!result.pass) {
        return { valid: false, reason: result.reason, ruleName: rule.constructor.name };
      }
    }
    return { valid: true };
  }
}
