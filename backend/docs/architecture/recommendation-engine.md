# Recommendation Engine Architecture

## Orchestrator Role
The `recommendationEngine.js` acts solely as the Traffic Director between Data Generation and Scoring logic.

## Logic Flow
1. Receives raw limit (e.g. 20).
2. Modifies request pulling `limit * 2` from Postgres to ensure the ranking engine has enough raw fodder to sort.
3. Injects the Array payload into the `RankingEngine`.
4. Attaches raw Distance computations manually mapping `distanceMiles` sequentially for Frontend consumption.
5. Executes an `O(N log N)` sort mapping descending `.recommendationScore` arrays.
6. Truncates securely back to the original client limit.
7. Dispatches final payload back to the Redis Caching tier.

By separating this from the Controller, we enable future Python microservices to intercept step 3 seamlessly if we move to Machine Learning pipelines.
