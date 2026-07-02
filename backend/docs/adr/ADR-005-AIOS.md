# ADR 005: AIOS (AI Orchestration System)

## Context
Spark leverages various AI models for profile analysis, compatibility scoring, and moderation. Managing these models, prompts, and their interactions is complex.

## Problem
Hardcoding AI integrations into the main business logic makes it difficult to swap models, perform A/B testing on prompts, and monitor AI-specific performance.

## Decision
We will build/use an AI Orchestration System (AIOS) to abstract the interaction with underlying LLMs and AI services.

## Alternatives Considered
- Direct API calls to OpenAI/Anthropic: Hard to manage rate limits, swap providers, or version prompts.
- LangChain: Evaluated, but may introduce too much abstraction overhead. We will selectively adopt its patterns or use a lighter-weight custom orchestrator tailored to our needs.

## Consequences
- **Positive:** Centralized prompt management, easier model swapping (fallback strategies), standardized logging and monitoring for AI requests.
- **Negative:** Additional layer of abstraction to maintain.

## Future Considerations
- Implement advanced caching strategies for AI responses to reduce costs and improve latency.
- Add support for self-hosted open-source models for sensitive data processing.
