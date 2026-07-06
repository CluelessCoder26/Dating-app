import prisma from '../../config/prisma.js';
import { isLikeRating } from '../../utils/swipeRating.js';
import { eventBus } from '../../events/eventBus.js';
import { relationshipService } from './relationship.service.js';
import logger from '../../utils/logger.js';
import { socketManager } from '../../sockets/SocketManager.js';

class MatchEngine {
  /**
   * Async fallback for queued match detection (idempotent).
   */
  async detectMatch(payload) {
    const { actorId, targetId } = payload;

    const reverseSwipe = await prisma.swipe.findFirst({
      where: { swiperId: targetId, targetId: actorId },
    });

    if (!reverseSwipe || !isLikeRating(reverseSwipe.rating)) {
      return;
    }

    const actorSwipe = await prisma.swipe.findFirst({
      where: { swiperId: actorId, targetId },
    });

    if (!actorSwipe || !isLikeRating(actorSwipe.rating)) {
      return;
    }

    logger.info(`Mutual Match Detected: ${actorId} <-> ${targetId}`);

    const [user1Id, user2Id] = [actorId, targetId].sort();

    let match;
    let isNewMatch = false;

    try {
      match = await prisma.match.create({ data: { user1Id, user2Id } });
      isNewMatch = true;
    } catch (error) {
      if (error.code === 'P2002') {
        match = await prisma.match.findUnique({
          where: { user1Id_user2Id: { user1Id, user2Id } },
        });
      } else {
        throw error;
      }
    }

    if (isNewMatch && match) {
      await this.generateMetadata(match.id);
      await relationshipService.updateRelationship(user1Id, user2Id, 'MATCHED');
      eventBus.publish('MATCH_CREATED', { matchId: match.id, user1Id, user2Id }).catch(() => {});

      const io = socketManager.getIO();
      if (io) {
        io.to(`user_${user1Id}`).emit('match.created', { matchId: match.id, partnerId: user2Id });
        io.to(`user_${user2Id}`).emit('match.created', { matchId: match.id, partnerId: user1Id });
      }
    }
  }

  async generateMetadata(matchId) {
    await prisma.matchMetadata.upsert({
      where: { matchId },
      update: {},
      create: {
        matchId,
        compatibilityScore: 0,
        eloDifference: 0,
      },
    });
  }
}

export const matchEngine = new MatchEngine();
