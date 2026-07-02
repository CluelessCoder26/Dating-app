# Growth Platform Architecture

Spark's Growth Platform treats user engagement as a measurable, automated lifecycle. Instead of isolated scripts, the `GrowthEngine` listens to progression events (e.g. `profile_completed`) to inject `Rewards` and `Achievements`.

## The Engine Stack
- **GrowthService**: Top-level API Facade.
- **Micro-Engines**: Distinct classes handling single-responsibility tasks (e.g., `EntitlementEngine` checks permissions, `RewardEngine` handles inventory).

Every engine publishes standardized `EventBus` payloads for cross-domain interoperability.
