# Observability Platform Architecture

## Strategy
Observability provides deep insights into system behavior, combining metrics, logs, and traces into a single pane of glass.

### Telemetry Stack
- **Prometheus**: Scrapes metrics from `node-exporter`, `redis-exporter`, and custom Express middleware exposing standard Node.js event loop and garbage collection metrics.
- **Grafana**: Acts as the primary visualization layer, sourcing from Prometheus (Metrics) and Loki (Logs). Dashboards are configured via Infrastructure as Code.
- **Jaeger**: Handles distributed tracing. Services inject correlation IDs into HTTP headers (W3C Trace Context) and BullMQ job payloads to trace a user request across API boundaries and async queue workers.
- **Loki**: Aggregates structured JSON logs emitted by the centralized `logger.js` utility, allowing querying of application errors by `trace_id` or `userId`.

### Alerting
Alertmanager connects to Prometheus to dispatch PagerDuty/Slack notifications for:
- API 5xx error rates > 1%.
- Redis hit rates < 80%.
- Queue latency > 5s.
- Node.js heap consumption > 85%.
