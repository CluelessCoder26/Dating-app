# Billing Provider Abstraction

## Contract
`BillingProvider` defines:
- `createSubscription(userId, planId)`
- `cancelSubscription(subscriptionId)`
- `processPayment(userId, amount, currency)`

## Implementations
- `MockBillingProvider`: Fulfills promises instantly with UUID mocks.
- (Future) `StripeBillingProvider`: Wraps Stripe SDK.
- (Future) `AppleStoreKitProvider`: Wraps Apple Receipt Validation.
