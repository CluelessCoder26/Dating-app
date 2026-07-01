import prisma from '../../config/prisma.js';
import { eligibilityEngine } from './eligibilityEngine.js';

export const candidateGenerator = {
  /**
   * Retrieves raw candidates directly from PostgreSQL using the Eligibility Engine filters
   * @param {Object} currentUser 
   * @param {Object} preferences 
   * @param {number} limit 
   * @returns {Array} Array of eligible profile objects
   */
  async generateCandidates(currentUser, preferences, limit = 50) {
    const filters = await eligibilityEngine.generateEligibilityFilters(currentUser, preferences);

    const candidates = await prisma.profile.findMany({
      where: filters,
      include: {
        photos: {
          where: { isPrimary: true },
          take: 1
        }
      },
      take: limit
    });

    return candidates;
  }
};
