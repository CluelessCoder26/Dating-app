# SparkOps Platform Architecture (Phase 11)

## Executive Summary
SparkOps is the internal operating platform for the Spark dating ecosystem. It provides the command and control center for managing every subsystem, monitoring health, moderating users, handling incidents, and generating business intelligence.

## Platform Components

### 1. SparkOpsGateway & SparkOpsController
The central entry point for all administrative and operational requests. It enforces strict Role-Based Access Control (RBAC) and exposes the `/api/ops/*` namespace.

### 2. OperationsPlatform
Manages user accounts, trust histories, relationship timelines, and system-wide state changes. Allows actions like suspending, shadow banning, and resetting accounts.

### 3. MonitoringPlatform
Aggregates real-time metrics across infrastructure components:
- **Redis Status**: Hit ratio, memory usage, latency, evictions.
- **BullMQ Status**: Queue depth, retries, dead letter queue (DLQ) health.
- **Socket.IO Status**: Connected users, delivery queues.
- **PostgreSQL Status**: Connection pools, slow queries, storage.

### 4. AnalyticsPlatform
Generates real-time metrics and dashboards for:
- Daily/Monthly Active Users
- Matches and Messages today
- System Health Score

### 5. AuditPlatform
Provides immutable tracking of all admin actions (Who, When, Why, Old Value, New Value, IP, Browser, Session).

### 6. IncidentPlatform
Manages the lifecycle of system incidents (Create, Assign, Severity, RCA, Resolution Notes).

### 7. AIOperationsPlatform
Monitors the AI OS, including prompt versions, failures, prompt injection attempts, cache hit rates, token usage, and costs.

### 8. GrowthPlatform
Manages feature flags, revenue dashboards, premium subscriptions, cohorts, and A/B experiments.
