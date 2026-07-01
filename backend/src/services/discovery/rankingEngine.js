import { calculateDistanceMiles } from '../../utils/distance.js';

class RankingStrategy {
  score(candidate, currentUser, preferences) {
    throw new Error('Strategy must implement score()');
  }
}

class DistanceStrategy extends RankingStrategy {
  score(candidate, currentUser, preferences) {
    if (!candidate.latitude || !candidate.longitude) return 0;
    
    const maxDist = preferences.maxDistance || 50;
    const distance = calculateDistanceMiles(
      currentUser.latitude, currentUser.longitude,
      candidate.latitude, candidate.longitude
    );
    
    // Exact match = 100, At max distance = 0
    if (distance > maxDist) return 0;
    return Math.max(0, 100 - ((distance / maxDist) * 100));
  }
}

class ProfileQualityStrategy extends RankingStrategy {
  score(candidate, currentUser, preferences) {
    return candidate.profileQualityScore || candidate.completionScore || 0;
  }
}

class TrustScoreStrategy extends RankingStrategy {
  score(candidate, currentUser, preferences) {
    return candidate.profileQualityScore || 50; // Fallback to 50 if unknown
  }
}

class InterestStrategy extends RankingStrategy {
  score(candidate, currentUser, preferences) {
    if (!currentUser.interests || currentUser.interests.length === 0) return 50;
    if (!candidate.interests || candidate.interests.length === 0) return 0;

    const myInterests = new Set(currentUser.interests.map(i => i.toLowerCase()));
    let overlap = 0;
    candidate.interests.forEach(interest => {
      if (myInterests.has(interest.toLowerCase())) overlap++;
    });

    const percent = overlap / myInterests.size;
    return Math.min(100, percent * 100 * 2); // Amplify slightly
  }
}

class ELOStrategy extends RankingStrategy {
  score(candidate, currentUser, preferences) {
    // Diff between ELOs
    const myElo = currentUser.elo || 1200;
    const theirElo = candidate.elo || 1200;
    const diff = Math.abs(myElo - theirElo);

    // ELO within 100 points = 100 score, ELO diff > 400 = 0 score
    if (diff > 400) return 0;
    return 100 - (diff / 4);
  }
}

export class RankingEngine {
  constructor(weights) {
    this.weights = weights;
    this.strategies = {
      distance: new DistanceStrategy(),
      trustScore: new TrustScoreStrategy(),
      profileCompletion: new ProfileQualityStrategy(),
      interestSimilarity: new InterestStrategy(),
      elo: new ELOStrategy()
    };
  }

  scoreCandidate(candidate, currentUser, preferences) {
    let totalScore = 0;
    let maxWeight = 0;

    for (const [key, weight] of Object.entries(this.weights)) {
      if (this.strategies[key]) {
        const strategyScore = this.strategies[key].score(candidate, currentUser, preferences);
        totalScore += (strategyScore * weight);
        maxWeight += weight;
      }
    }

    // Normalize back to 0-100 scale based on active weights
    return maxWeight > 0 ? (totalScore / maxWeight) : 0;
  }
}
