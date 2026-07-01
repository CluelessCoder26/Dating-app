import { candidateGenerator } from './candidateGenerator.js';
import { RankingEngine } from './rankingEngine.js';
import { recommendationConfig } from '../../config/recommendation.js';
import { calculateDistanceMiles } from '../../utils/distance.js';

class RecommendationEngine {
  constructor() {
    this.rankingEngine = new RankingEngine(recommendationConfig.weights);
  }

  async getRecommendations(currentUser, preferences, limit = 20) {
    // 1. Generate Candidates (PostgreSQL filters)
    // We pull slightly more than requested to allow ranking to surface the best
    const rawCandidates = await candidateGenerator.generateCandidates(currentUser, preferences, limit * 2);

    // 2. Score Candidates
    const scoredCandidates = rawCandidates.map(candidate => {
      const recommendationScore = this.rankingEngine.scoreCandidate(candidate, currentUser, preferences);
      const distance = calculateDistanceMiles(
        currentUser.latitude, currentUser.longitude,
        candidate.latitude, candidate.longitude
      );
      
      return {
        ...candidate,
        distanceMiles: parseFloat(distance.toFixed(2)),
        recommendationScore: parseFloat(recommendationScore.toFixed(2))
      };
    });

    // 3. Rank Candidates (Sort descending by score)
    scoredCandidates.sort((a, b) => b.recommendationScore - a.recommendationScore);

    // 4. Truncate to limit
    return scoredCandidates.slice(0, limit);
  }
}

export const recommendationEngine = new RecommendationEngine();
