# Feature Flags & Experiments

## FeatureFlagEngine
Evaluates boolean flags. Supports percentage rollouts using deterministic hashing of the `userId` to ensure a user always falls into the same bucket.

## ExperimentEngine
Evaluates multi-variant A/B tests. Distributes traffic based on `variant.weight`. Emits `spark.experiment.assigned.v1` the first time a user is bucketed to ensure accurate Data Science conversion tracking.
