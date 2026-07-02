# Reputation Engine Architecture

## The Ledger
The `Reputation` model acts as a financial ledger for Trust.
- Starts at 100.
- `reportCount` increments asynchronously.
- AI Validations increment `verifiedSignals`.

## Caching Strategy
Every database update writes to Redis with a TTL of 3600s. Subsequent queries hit Redis in ~2ms.
