# Risk Engine Architecture

## Vectors
- `spamRisk`
- `fraudRisk`
- `scamRisk`
- `botProbability`
- `messageAbuseScore`

## Automated Responses
The engine recalculates asynchronously. If `overallRiskScore > 0.6`, it deploys a `Restriction` row (`type: SHADOW_BAN`). The Discovery/Ranking engines exclude users with active restrictions.
