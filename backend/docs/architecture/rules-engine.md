# Rules Engine Architecture

## Paradigm Shift
Monolithic Dating Apps rely on deep procedural validation:
```javascript
if (isBlocked) return;
if (isAlreadySwiped) return;
if (isNotActive) return;
```
This becomes an unmaintainable testing nightmare when Premium tiers, AI Moderation, and Verification gates are added.

## Strategy Deployment
The `SwipeRulesEngine` initializes a discrete array of modular classes extending the `SwipeRule` base construct.

Each class implements `.evaluate()`.
By iterating over the injection array, we can safely and cleanly add or remove verification parameters via feature flags globally, guaranteeing no side effects to adjacent logic chains.

For example, implementing a `GoldMemberLimitRule` in the future requires exactly one new localized file without touching the core Engine controller.
