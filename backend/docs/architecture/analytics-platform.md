# Analytics Platform Architecture

## Responsibilities
The Analytics Platform is responsible for aggregating business intelligence and platform-wide engagement metrics into a unified view.

### Metrics Tracked
- **User Growth**: Daily Active Users (DAU), Monthly Active Users (MAU), new registrations, and verified users.
- **Engagement**: Total swipes (right/left), total matches generated, and total messages exchanged.
- **Conversion**: Funnel analysis from free to premium, subscription retention cohorts, and churn prediction models.
- **A/B Experiments**: Efficacy and statistical significance of rolled-out features via `GrowthPlatform`.

### Exporters
The analytics platform integrates with PDF and CSV exporters, allowing Data Analysts to dump aggregated reports for downstream BI tools.
