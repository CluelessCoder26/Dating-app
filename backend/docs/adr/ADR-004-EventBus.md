# ADR 004: EventBus for Decoupled Events

## Context
As the backend grows, different domains (e.g., user management, matching, notifications) need to react to changes in other domains without being tightly coupled.

## Problem
Direct function calls or API requests between domains create tight coupling, making the system harder to maintain, test, and scale independently.

## Decision
We will implement an EventBus pattern to publish and subscribe to domain events asynchronously.

## Alternatives Considered
- Direct HTTP calls: Tight coupling, poor resilience if a downstream service is unavailable.
- Shared Database: Leads to the "integration database" anti-pattern, hard to manage schema changes.

## Consequences
- **Positive:** Loose coupling between domains, easier to add new features that react to existing events, improved system resilience.
- **Negative:** Increased complexity in tracing execution flows, potential for event eventual consistency issues.

## Future Considerations
- Transition from an in-memory or Redis-based EventBus to a more robust event streaming platform like Apache Kafka or AWS EventBridge if the volume and complexity of events increase significantly.
- Define a strict schema registry for events.
