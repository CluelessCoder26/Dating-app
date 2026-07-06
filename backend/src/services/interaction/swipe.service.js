import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';
import { SwipeRulesEngine } from './rules/SwipeRulesEngine.js';
import { eventBus } from '../../events/eventBus.js';
import { ValidationError, ConflictError } from '../../utils/errors.js';
import { isLikeRating, normalizeRating, VALID_SWIPE_ACTIONS } from '../../utils/swipeRating.js';
import logger from '../../utils/logger.js';

const rulesEngine = new SwipeRulesEngine(prisma);

function pairIds(a, b) {
  return a < b ? [a, b] : [b, a];
}

async function invalidateDiscoveryCache(userId) {
  try {
    if (redisManager.isHealthy()) {
      await redisManager.deletePattern(`discovery:${userId}:*`);
    }
  } catch (err) {
    logger.warn(`Failed to invalidate discovery cache for ${userId}: ${err.message}`);
  }
}

/**
 * Unified swipe handler — persistence, validation, and synchronous mutual-match creation.
 */
export async function processSwipe(actorId, targetId, rawAction) {
  if (actorId === targetId) {
    throw new ValidationError('You cannot interact with yourself.');
  }

  let action;
  try {
    action = normalizeRating(rawAction);
  } catch {
    throw new ValidationError(`action must be one of: ${VALID_SWIPE_ACTIONS.join(', ')} (or legacy like/nope)`);
  }

  if (!VALID_SWIPE_ACTIONS.includes(action)) {
    throw new ValidationError(`action must be one of: ${VALID_SWIPE_ACTIONS.join(', ')}`);
  }

  const [actorProfile, targetProfile] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: actorId }, include: { user: true } }),
    prisma.profile.findUnique({ where: { userId: targetId }, include: { user: true } }),
  ]);

  if (!actorProfile || !targetProfile) {
    throw new ValidationError('Profiles could not be resolved.');
  }

  const ruleResult = await rulesEngine.validate({ actorId, targetId, action, actorProfile, targetProfile });
  if (!ruleResult.valid) {
    await prisma.interactionHistory.create({
      data: {
        actorId,
        targetId,
        action: 'RULE_FAILURE',
        metadata: JSON.stringify({ reason: ruleResult.reason, rule: ruleResult.ruleName }),
      },
    });
    if (ruleResult.ruleName === 'NotAlreadySwipedRule') {
      throw new ConflictError(ruleResult.reason);
    }
    throw new ValidationError(ruleResult.reason);
  }

  const result = await prisma.$transaction(async (tx) => {
    const swipe = await tx.swipe.create({
      data: { swiperId: actorId, targetId, rating: action },
    });

    let match = null;
    let isMatch = false;

    if (isLikeRating(action)) {
      const reverseSwipe = await tx.swipe.findUnique({
        where: { swiperId_targetId: { swiperId: targetId, targetId: actorId } },
      });

      if (reverseSwipe && isLikeRating(reverseSwipe.rating)) {
        const [user1Id, user2Id] = pairIds(actorId, targetId);

        try {
          match = await tx.match.create({ data: { user1Id, user2Id } });
          isMatch = true;
        } catch (error) {
          if (error.code === 'P2002') {
            match = await tx.match.findUnique({
              where: { user1Id_user2Id: { user1Id, user2Id } },
            });
            isMatch = !!match;
          } else {
            throw error;
          }
        }

        if (match && isMatch) {
          await tx.matchMetadata.upsert({
            where: { matchId: match.id },
            update: {},
            create: { matchId: match.id, compatibilityScore: 0, eloDifference: 0 },
          });
          const [u1, u2] = pairIds(actorId, targetId);
          await tx.relationship.upsert({
            where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
            update: { status: 'MATCHED', updatedAt: new Date() },
            create: { user1Id: u1, user2Id: u2, status: 'MATCHED' },
          });
        }
      }
    }

    if (!isMatch) {
      const [u1, u2] = pairIds(actorId, targetId);
      const existingRel = await tx.relationship.findUnique({
        where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
      });
      if (!existingRel || existingRel.status !== 'MATCHED') {
        await tx.relationship.upsert({
          where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
          update: {
            status: action === 'PASS' ? 'PASSED' : 'LIKED',
            updatedAt: new Date(),
          },
          create: {
            user1Id: u1,
            user2Id: u2,
            status: action === 'PASS' ? 'PASSED' : 'LIKED',
          },
        });
      }
    }

    return { swipe, match, isMatch, action };
  });

  await prisma.interactionHistory.create({
    data: { actorId, targetId, action },
  });

  await invalidateDiscoveryCache(actorId).catch(() => {});

  const payload = {
    swipeId: result.swipe.id,
    actorId,
    targetId,
    action: result.action,
    timestamp: new Date(),
  };

  eventBus.publish('SWIPE_CREATED', payload).catch(() => {});

  if (result.isMatch && result.match) {
    const [user1Id, user2Id] = pairIds(actorId, targetId);
    eventBus.publish('MATCH_CREATED', {
      matchId: result.match.id,
      user1Id,
      user2Id,
    }).catch(() => {});
  } else if (isLikeRating(result.action)) {
    const { likesReceivedService } = await import('./likesReceived.service.js');
    likesReceivedService.emitIncomingLike(targetId, actorId).catch(() => {});
  }

  return {
    success: true,
    action: result.action,
    isMatch: result.isMatch,
    match: result.match ? { id: result.match.id } : undefined,
  };
}
