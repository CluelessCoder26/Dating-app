# Provider Router

## Responsibility
Selects and routes AI requests to the appropriate provider. Implements automatic fallback.

## Fallback Strategy
If the primary provider fails, the router falls back to `MockLLMProvider`. This ensures zero downtime even during provider outages.

## Adding Providers
1. Implement the provider class (e.g., `OpenAILLMProvider extends LLMProvider`).
2. Register in `ProviderRouter.constructor()`.
3. Set as default or use `options.provider` per-request.
