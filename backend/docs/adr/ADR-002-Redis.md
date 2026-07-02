# ADR 002: Redis for Caching and Pub/Sub

## Context
The application requires fast data retrieval for frequently accessed but rarely changing data (e.g., user profiles, settings) and a mechanism for asynchronous communication between services.

## Problem
Relying solely on the primary database for all reads creates a bottleneck. We also need a lightweight, fast message broker for real-time features and event distribution.

## Decision
We will use Redis as our primary caching layer and for Pub/Sub messaging.

## Alternatives Considered
- Memcached: Good for simple caching but lacks advanced data structures and Pub/Sub capabilities.
- RabbitMQ / Kafka for Pub/Sub: More robust for complex messaging needs but introduces additional infrastructure overhead. Redis provides a good balance of speed and simplicity for our current needs.
- Database-level caching: Insufficient performance for high-throughput reads.

## Consequences
- **Positive:** Significantly improved read performance, simple and fast Pub/Sub mechanism, support for advanced data types.
- **Negative:** Data in cache can become stale (requires cache invalidation strategies), in-memory data store means potential data loss on restart if not configured for persistence (though mostly used ephemerally).

## Future Considerations
- Evaluate Redis Cluster for high availability and horizontal scaling as the data set grows.
- Monitor Redis memory usage and optimize cache eviction policies.
