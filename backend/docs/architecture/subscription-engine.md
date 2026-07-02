# Subscription Engine

The `SubscriptionEngine` maps Users to `Plan` records via a `Subscription` ledger.
It is entirely agnostic to the underlying payment processor, delegating PCI-compliant logic to the `BillingProvider`.

## Capabilities
- Multi-tier support (Free, Premium, VIP).
- Current Period start/end tracking.
- Asynchronous cancellation hooks.
