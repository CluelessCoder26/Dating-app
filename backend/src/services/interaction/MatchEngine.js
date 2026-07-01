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

      // 1. Create Match Atomically
      const match = await prisma.match.upsert({
        where: { user1Id_user2Id: { user1Id, user2Id } },
        update: {},
        create: { user1Id, user2Id }
      });

      // 2. Compute metadata (Async)
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

  async generateMetadata(matchId, u1, u2) {
    // Stub: In reality, grab profiles, compare elo, interests, etc.
    await prisma.matchMetadata.create({
      data: {
        matchId,
        compatibilityScore: Math.random() * 100,
        eloDifference: 0 // Placeholder
      }
    });
  }
}

export const matchEngine = new MatchEngine();
