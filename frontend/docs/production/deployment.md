# Deployment Guide

## Environments
1. **Development**: Used for day-to-day development and feature testing.
2. **Staging**: Pre-production environment that mirrors production data (anonymized) and infrastructure.
3. **Production**: Live environment for end-users.

## CI/CD Pipeline
- **Continuous Integration**: On every PR to `main` or `develop`, the CI pipeline runs:
  - Linting (`npm run lint`)
  - Type checking (`npm run typecheck`)
  - Unit Tests (`npm run test:unit`)
  - Build test (`npm run build`)
- **Continuous Deployment**:
  - Merges to `main` trigger a deployment to Staging.
  - Releases (tags) trigger a deployment to Production.

## Rollback Strategy
In case of a critical failure in production, we employ a zero-downtime rollback strategy by reverting the active routing to the previous successful build artifact on our CDN.
