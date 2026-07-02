# Reward Engine Architecture

Treats gamification assets as a ledger.

## Assets
- `COINS`
- `SUPER_LIKE`
- `BOOST`
- `PREMIUM_DAYS`

Rewards are `GRANTED` via automated Growth Hooks (e.g., Referrals, Profile Completion) and moved to `REDEEMED` when consumed by the user via the `POST /api/growth/rewards/:id/redeem` endpoint.
