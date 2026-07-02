# REDIS API STANDARDIZATION

## Overview
The entire Spark backend has been migrated to use exclusively the official `node-redis` v4 API surface, wrapped completely behind `RedisManager`.

## Architectural Changes
- **Abstracted Wrapper:** All `.client.*` usages have been entirely replaced with native `RedisManager.*` wrapper calls.
- **Fail-Safe Processing:** Every Redis call operates inside a `try/catch` block. If Redis disconnects, the `RedisManager` gracefully catches the exception, logs it structurally via `logger`, and returns `null` or safe fallbacks to prevent the worker Node thread from crashing.
- **BullMQ:** Verified queue initialization and processing. All 22 background queues operate normally with the unified client pool.
