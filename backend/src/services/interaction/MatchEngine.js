import prisma from '../../config/prisma.js';
import { eventBus } from '../../events/eventBus.js';
import { relationshipService } from './relationship.service.js';
import logger from '../../utils/logger.js';
import { socketManager } from '../../sockets/SocketManager.js';

class MatchEngine {
  /**
   * Process potential match asynchronously
   * @param {Object} payload 
   */
  async detectMatch(payload) {
    const { actorId, targetId } = payload;
    
    // Check if target already LIKED actor
    const reverseSwipe = await prisma.swipe.findFirst({
      where: { swiperId: targetId, targetId: actorId, rating: { in: ['LIKE', 'SUPER_LIKE'] } }
    });

    if (reverseSwipe) {
      logger.info(`Mutual Match Detected: ${actorId} <-> ${targetId}`);
      
      const [user1Id, user2Id] = [actorId, targetId].sort();

      let match;
      let isNewMatch = false;

      // 1. Create Match Atomically with Concurrency Control
      try {
        match = await prisma.match.create({
          data: { user1Id, user2Id }
        });
        isNewMatch = true;
      } catch (error) {
        if (error.code === 'P2002') { // Unique constraint violation
          logger.info(`Match already exists for ${user1Id} <-> ${user2Id}, skipping duplicate events.`);
          match = await prisma.match.findUnique({
            where: { user1Id_user2Id: { user1Id, user2Id } }
          });
        } else {
          throw error;
        }
      }

      if (isNewMatch && match) {
        // 2. Compute metadata (Idempotent)
        await this.generateMetadata(match.id, actorId, targetId);

        // 3. Update Relationship Graph
        await relationshipService.updateRelationship(user1Id, user2Id, 'MATCHED');

        // 4. Fire Match Created Event
        eventBus.publish('MATCH_CREATED', { matchId: match.id, user1Id, user2Id }).catch(() => {});

        // 5. Emit Socket.IO Event
        const io = socketManager.getIO();
        if (io) {
          io.to(`user_${user1Id}`).emit('match.created', { matchId: match.id, partnerId: user2Id });
          io.to(`user_${user2Id}`).emit('match.created', { matchId: match.id, partnerId: user1Id });
        }
      }
    }
  }

  async generateMetadata(matchId, u1, u2) {
    // Upsert guarantees no duplicate metadata rows even under race conditions
    await prisma.matchMetadata.upsert({
      where: { matchId },
      update: {},
      create: {
        matchId,
        compatibilityScore: Math.random() * 100,
        eloDifference: 0 // Placeholder
      }
    });
  }
}

export const matchEngine = new MatchEngine();
