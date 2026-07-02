# Runbook: Database Down

## Context
The primary database is the source of truth. Its unavailability results in a complete system outage.

## Symptoms
- API requests returning 500s or timing out.
- Application logs showing database connection errors (e.g., connection refused, timeout).
- Health check endpoints failing.

## Impact
- **Critical:** Complete application outage.

## Response Steps
1. **Acknowledge & Escalate:** Immediately acknowledge the alert and escalate to the core infrastructure team.
2. **Verify Outage:** Check DB monitoring dashboards and attempt direct connection using DB tools.
3. **Check Cloud Provider:** If using a managed database (e.g., RDS), check the provider's status page for regional outages.
4. **Investigate Cause:**
   - Check for CPU/Memory exhaustion.
   - Check for long-running queries causing locks or connection pool exhaustion.
   - Check disk space.
5. **Remediation:**
   - If connection pool is exhausted, kill stuck queries or restart application pods to sever connections.
   - If hardware failure, initiate failover to read replica/standby instance (managed services usually do this automatically).
   - If data corruption, prepare for point-in-time recovery from backups.

## Post-Incident
- Conduct a blameless post-mortem.
- Review query performance and indexing.
- Adjust connection pool limits.
