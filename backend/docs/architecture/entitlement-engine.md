# Entitlement Engine

Instead of writing `if (user.plan == 'Premium')`, the codebase uses `entitlementEngine.canUserAccess(userId, 'feature_key')`.

## Resolution Flow
1. Check Redis `entitlement:{userId}:{featureKey}`.
2. If miss, query PostgreSQL `Entitlement` table joining `Subscription` and `Feature`.
3. Cache the boolean result in Redis (TTL: 3600s).

This guarantees sub-millisecond permission checks on high-frequency routes like the Swiping Engine.
