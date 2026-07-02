# Monitoring Platform Architecture

## Responsibilities
The Monitoring Platform is responsible for providing deep observability into the underlying infrastructure that powers Spark.

### Target Infrastructure
1. **Redis**: Cache hit/miss ratio, memory consumption, connection counts, evictions.
2. **BullMQ**: Queue depth (waiting, active, delayed, failed), worker status, dead letter queues (DLQs), and average processing time.
3. **Socket.IO**: Real-time connected clients, delivery latency, and un-ACKed messages.
4. **PostgreSQL (Prisma)**: Database pool connections, long transactions, slow queries, table growth.
5. **Event Bus**: Event throughput, DLQs, version tracking, and consumer lag.

### Integration
Data is collected synchronously for dashboards via the `/api/ops/system` endpoints, but a dedicated `MonitoringWorker` acts as an anomaly detector, pushing critical threshold events via Socket.IO directly to connected operations admins.
