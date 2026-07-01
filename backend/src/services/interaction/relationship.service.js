import prisma from '../../config/prisma.js';

export const relationshipService = {
  /**
   * Updates or creates the undirected Relationship graph node between two users.
   * Convention: user1Id < user2Id ensures we only have 1 edge between any two nodes.
   */
  async updateRelationship(actorId, targetId, status) {
    const [user1Id, user2Id] = [actorId, targetId].sort();

    return await prisma.relationship.upsert({
      where: {
        user1Id_user2Id: { user1Id, user2Id }
      },
      update: {
        status,
        updatedAt: new Date()
      },
      create: {
        user1Id,
        user2Id,
        status
      }
    });
  }
};
