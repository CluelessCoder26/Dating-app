# Monitoring and Logging

## Error Tracking
- **Sentry Integration**: All unhandled exceptions, promise rejections, and React boundary errors are logged to Sentry.
- **Source Maps**: Uploaded securely to Sentry during the CI build process and never exposed to the public.

## Uptime & Health
- Synthetic monitoring ping our `/health` endpoints and critical user journeys (e.g., login flow) every 5 minutes.

## Application Logging
- **Log Levels**: 
  - `ERROR`: Critical failures (e.g., payment failure).
  - `WARN`: Degradation in service (e.g., image upload retry).
  - `INFO`: Lifecycle events.
- Client-side logs are batched and sent to our ingest servers periodically to monitor client health in the wild.
