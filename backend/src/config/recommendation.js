export const recommendationConfig = {
  // Configurable weights for Discovery ranking (0.0 to 1.0 multipliers)
  // Must sum to exactly 1.0 (or they will be normalized)
  weights: {
    distance: 0.20,
    trustScore: 0.20,
    profileCompletion: 0.15,
    activity: 0.15,
    interestSimilarity: 0.15,
    popularity: 0.05,
    freshness: 0.05,
    elo: 0.05
  },
  
  // Future ML flags
  featureFlags: {
    useMLRanking: false,
    useCollaborativeFiltering: false,
    strictLocationBounds: true
  },

  // Pagination bounds
  pageSize: 20
};
