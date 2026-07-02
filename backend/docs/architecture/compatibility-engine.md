# Compatibility Engine

## Multi-Dimensional Scoring
- **Interest Score** (30%): Jaccard overlap of profile interests.
- **Lifestyle Score** (20%): Binary match on lifestyle field.
- **Relationship Goal Score** (25%): Binary match on relationship goals.
- **Conversation Score** (25%): Cosine similarity of profile embeddings.

## AI Explanation
After computing the numeric score, the engine calls the `AIGateway` to generate a natural-language compatibility explanation.

## Caching
Results are cached in Redis (TTL: 3600s) keyed by sorted user ID pair.
