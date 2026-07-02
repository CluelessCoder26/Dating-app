# Runbook: BullMQ Failure

## Context
BullMQ handles critical background tasks. If workers fail or queues back up, features like email delivery, matching algorithms, or data processing will stall.

## Symptoms
- Queue length increasing rapidly on monitoring dashboards.
- Background tasks (e.g., profile approval, match calculation) not completing.
- Worker pods crashing or restarting frequently.

## Impact
- **Moderate to High:** Core API may function, but asynchronous workflows are broken.

## Response Steps
1. **Check Queue Status:** Use BullMQ UI or CLI tools to inspect queue lengths, stalled jobs, and failed jobs.
2. **Check Redis:** BullMQ relies on Redis. Verify Redis is healthy and not out of memory (see `redis-down-runbook.md`).
3. **Inspect Workers:**
   - Check logs of worker pods for unhandled exceptions or connection errors.
   - Ensure worker pods have sufficient resources (CPU/Memory).
4. **Remediation:**
   - If workers are crashing due to bad data, identify and remove/fix the offending jobs from the queue.
   - If queue is simply backed up due to high load, scale up the number of worker pods horizontally.
   - Restart worker pods if they are in a stuck state.
5. **Review Failed Jobs:** Analyze the errors for failed jobs and retry them if appropriate once the underlying issue is resolved.

## Post-Incident
- Implement better error handling and retries within job processors.
- Setup alerting for queue length thresholds and job failure rates.
