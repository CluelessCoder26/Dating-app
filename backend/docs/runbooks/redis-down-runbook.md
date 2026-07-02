# Runbook: Redis Down

## Context
Redis is used for caching, Pub/Sub, and job queues (BullMQ). If Redis goes down, significant portions of the application will degrade or fail.

## Symptoms
- High API latency or timeouts.
- Background jobs not processing.
- Real-time features (chat, notifications) failing.
- Errors in logs indicating connection refused to Redis.

## Impact
- **Severe:** Read performance degrades, asynchronous tasks halt.

## Response Steps
1. **Verify Outage:** Check metrics (Prometheus/Grafana) and application logs to confirm Redis is unreachable.
2. **Check Infrastructure:**
   - If managed Redis (e.g., ElastiCache): Check the cloud provider's status page and console.
   - If self-hosted: Check the K8s pods or VMs hosting Redis.
3. **Restart/Failover:**
   - Attempt to restart the Redis service or pod.
   - If using Redis Sentinel/Cluster, verify if failover occurred automatically. If not, trigger manual failover.
4. **Investigate Cause:** Check Redis logs for OOM (Out of Memory) kills, disk space issues, or network partitions.
5. **Mitigation (if prolonged):**
   - Application should ideally fail gracefully (e.g., bypass cache and hit DB, though this might overload the DB).

## Post-Incident
- Review maxmemory policies and cache eviction strategies.
- Ensure appropriate alerts are set up for memory usage and connection limits.
