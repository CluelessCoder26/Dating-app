# Performance Platform Architecture

## Strategy
The Performance Platform ensures the system remains highly responsive under massive concurrent loads.

### Load Management
- **Horizontal Scaling**: Kubernetes HPA dynamically provisions additional API pods when CPU targets cross 70%, distributing traffic smoothly via the internal Service load balancer.
- **Queue Throttling**: BullMQ concurrency limits throttle background task processing (e.g., photo verification, AI analysis) to protect the Redis cluster and downstream AI provider APIs from sudden spikes in throughput.

### Caching Strategy
- **Redis Primary Cache**: Heavily leveraged for user discovery feeds, eligibility engines, and rate limiting state. Cache hits resolve in <5ms.
- **Stale-While-Revalidate**: Discovery feeds implement SWR; stale feeds are served immediately to users while the `discoveryRefreshQueue` asynchronously recalculates fresh feeds in the background.

### Database Optimization
- **PgBouncer**: Implements transaction-level connection pooling to prevent connection starvation in PostgreSQL under high pod concurrency.
- **Query Optimization**: Prisma queries are meticulously indexed on critical paths (e.g., location queries, matching algorithms).
