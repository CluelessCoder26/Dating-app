# AIOS Platform Architecture

## Overview
Spark AIOS is a fully decoupled AI operating system. No domain service (Discovery, Trust, Growth, Messaging) communicates directly with an AI provider. Instead, every AI request flows through the `AIGateway`, which enforces governance, caching, cost tracking, and provider routing.

## Request Lifecycle
1. **Controller** receives HTTP request.
2. **AIGateway.complete()** is called with userId, category, and messages.
3. **AIGovernanceEngine** checks rate limits and sanitizes prompts (injection + PII).
4. **Redis Cache** is checked for a matching response.
5. **ProviderRouter** selects the appropriate provider and executes with fallback.
6. **ResponseValidator** ensures output meets safety criteria.
7. **CostManager** calculates token cost based on model pricing.
8. **AIGovernanceEngine** logs the request to `AIRequest` and tracks usage in `AIUsage`.
9. **Redis** caches the response for subsequent requests.

## Provider Abstraction
Each provider type has a base class and one or more implementations:
- `LLMProvider` → `MockLLMProvider` (future: OpenAI, Gemini, Claude, Grok)
- `EmbeddingProvider` → `MockEmbeddingProvider` (future: OpenAI, Vertex AI)
- `VisionProvider` (future: AWS Rekognition, Google Vision)
- `ModerationProvider` (future: OpenAI Moderation, Perspective API)

## Adding a New Provider
1. Create a class extending the appropriate base class.
2. Register it in `ProviderRouter`.
3. No other code changes required.
