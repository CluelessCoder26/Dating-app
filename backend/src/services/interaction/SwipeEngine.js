import prisma from '../../config/prisma.js';
import { SwipeRulesEngine } from './rules/SwipeRulesEngine.js';
import { eventBus } from '../../events/eventBus.js';
import { relationshipService } from './relationship.service.js';
import { ValidationError, AuthorizationError } from '../../utils/errors.js';

class SwipeEngine {
  constructor() {
    this.rulesEngine = new SwipeRulesEngine(prisma);
  }

  /**
   * Process a Swipe Action (LIKE, PASS, SUPER_LIKE)
   * Ensures high-performance synchronous validations, followed by async Queue offloading.
   */
  async processSwipe(actorId, targetId, action) {
    if (actorId === targetId) {
      throw new ValidationError('You cannot interact with yourself.');
    }

    // 1. Fetch lightweight context
    const [actorProfile, targetProfile] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: actorId }, include: { user: true } }),
      prisma.profile.findUnique({ where: { userId: targetId }, include: { user: true } })
    ]);

    if (!actorProfile || !targetProfile) {
      throw new ValidationError('Profiles could not be resolved.');
    }

    // 2. Validate via Rules Engine (Throws if invalid)
    const ruleResult = await this.rulesEngine.validate({ actorId, targetId, action, actorProfile, targetProfile });
    
    if (!ruleResult.valid) {
      // Record failure for Analytics synchronously
      await prisma.interactionHistory.create({
        data: { actorId, targetId, action: 'RULE_FAILURE', metadata: JSON.stringify({ reason: ruleResult.reason, rule: ruleResult.ruleName }) }
      });
      throw new AuthorizationError(`Interaction rejected: ${ruleResult.reason}`);
    }

    // 3. Persist the Swipe Atomically
    const swipe = await prisma.swipe.create({
      data: {
        swiperId: actorId,
        targetId: targetId,
        rating: action
      }
    });

    // 4. Update Relationship Graph to 'LIKED' or 'PASSED' if it's not already 'MATCHED'
    const [u1, u2] = [actorId, targetId].sort();
    const existingRel = await prisma.relationship.findUnique({ where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } }});
    
    if (!existingRel || existingRel.status !== 'MATCHED') {
      await relationshipService.updateRelationship(actorId, targetId, action === 'PASS' ? 'PASSED' : 'LIKED');
    }

    // 5. Track raw history
    await prisma.interactionHistory.create({
      data: { actorId, targetId, action }
    });

    // 6. Fire and Forget into the Event Bus
    const payload = {
      swipeId: swipe.id,
      actorId,
      targetId,
      action,
      timestamp: new Date()
    };

    // Do NOT await eventBus.publish to ensure immediate HTTP response
    eventBus.publish('SWIPE_CREATED', payload).catch(() => {});

    return { success: true, action };
  }
}

export const swipeEngine = new SwipeEngine();
