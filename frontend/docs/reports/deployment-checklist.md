# Final Deployment Checklist

## Pre-Deployment
- [ ] Verify all PRs for the release are merged into `main`.
- [ ] Confirm E2E tests pass on the `Staging` environment.
- [ ] Verify Production environment variables in the CI/CD pipeline and hosting platform.
- [ ] Check Sentry/Monitoring dashboards to ensure no critical alerts in Staging.
- [ ] Review Frontend Final Audit and Readiness reports.

## Deployment Day
- [ ] Lock `main` branch to prevent unexpected merges.
- [ ] Trigger Production deployment via CI/CD.
- [ ] Monitor build logs for any unexpected warnings.
- [ ] Verify successful deployment to CDN/Hosting.

## Post-Deployment Validation
- [ ] Perform smoke test on live production URL.
- [ ] Verify SSL certificates and custom domain routing.
- [ ] Test critical user journeys (Signup, Login, Swipe, Messaging).
- [ ] Check Sentry for new error spikes in the first hour.
- [ ] Validate analytics events are appearing in the data warehouse.

## Rollback Plan
- [ ] In case of critical failure, press "Revert to Previous Deployment" in hosting dashboard.
- [ ] Inform stakeholders of the rollback.
