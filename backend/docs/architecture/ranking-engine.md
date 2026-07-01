# Ranking Engine Architecture

## Strategy Pipeline
The Ranking Engine leverages the Strategy Design Pattern. Instead of gigantic `if/else` ladders, the engine initializes multiple disparate strategies, passes them the candidate payload, and expects a normalized `0-100` float representing success confidence.

### Configurable Weights
In `src/config/recommendation.js`, the matrix weights are defined.
Total weights must equalize to 1.0 (100%).

- **Distance (20%)**: Closeness directly overrides all other permutations.
- **Trust Score (20%)**: Leverages the AI Engine; safer profiles rank higher.
- **Profile Completion (15%)**: Prevents empty profiles from swamping the feed.
- **Activity (15%)**: (Stubbed) Will map against last login tokens to surface active users.
- **Interests (15%)**: Maps array overlap exact-string subsets.
- **Popularity/ELO (10%)**: Surfacing high-value candidates incrementally.

## Extensibility
To add a new ranking algorithm (e.g., NLP bio analysis), developers merely extend `RankingStrategy`, write a `score()` function, and inject the pointer into the Constructor. Zero existing code breaks.
