import { candidateGenerator } from './candidateGenerator.js';
import { RankingEngine } from './rankingEngine.js';
import { recommendationConfig } from '../../config/recommendation.js';
import { calculateDistanceMiles } from '../../utils/distance.js';

const MAX_CANDIDATE_POOL = 200;

class RecommendationEngine {
  constructor() {
    this.rankingEngine = new RankingEngine(recommendationConfig.weights);
  }

  async getRecommendations(currentUser, preferences, options = {}) {
    const pageSize = options.pageSize ?? recommendationConfig.pageSize;
    const page = Math.max(1, options.page ?? 1);
    const cursor = options.cursor ?? null;

    const rawCandidates = await candidateGenerator.generateCandidates(currentUser, preferences, {
      limit: MAX_CANDIDATE_POOL,
      page: 1,
      cursor,
    });

    const maxDistance = preferences.maxDistance || 50;

    const scoredCandidates = rawCandidates
      .map((candidate) => {
        const distance = calculateDistanceMiles(
          currentUser.latitude,
          currentUser.longitude,
          candidate.latitude,
          candidate.longitude
        );
        const distanceMiles = parseFloat(distance.toFixed(2));

        if (distanceMiles > maxDistance) {
          return null;
        }

        const recommendationScore = this.rankingEngine.scoreCandidate(
          candidate,
          currentUser,
          preferences
        );

        return {
          ...candidate,
          distanceMiles,
          recommendationScore: parseFloat(recommendationScore.toFixed(2)),
        };
      })
      .filter(Boolean);

    scoredCandidates.sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }
      return a.userId.localeCompare(b.userId);
    });

    let profiles;
    let hasMore;

    if (cursor) {
      const cursorIdx = scoredCandidates.findIndex((c) => c.userId === cursor);
      const start = cursorIdx >= 0 ? cursorIdx + 1 : 0;
      profiles = scoredCandidates.slice(start, start + pageSize);
      hasMore = start + pageSize < scoredCandidates.length;
    } else {
      const start = (page - 1) * pageSize;
      profiles = scoredCandidates.slice(start, start + pageSize);
      hasMore = start + pageSize < scoredCandidates.length;
    }

    const lastProfile = profiles[profiles.length - 1];

    return {
      profiles,
      pagination: {
        page,
        pageSize,
        hasMore,
        nextCursor: hasMore && lastProfile ? lastProfile.userId : null,
        count: profiles.length,
      },
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
