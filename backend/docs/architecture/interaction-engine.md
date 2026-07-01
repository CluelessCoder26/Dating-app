# Interaction Engine Architecture

## Purpose
Decouple client request latency from heavy background processing during matching algorithms.

## Flow
1. Client POSTs `/swipe` payload.
2. `SwipeRulesEngine` validates synchronously (Under 15ms).
3. `InteractionHistory` writes to PostgreSQL sequentially.
4. `Relationship` edge is drawn or updated to `LIKED`/`PASSED`.
5. 200 OK is returned to Client immediately.
6. `EventBus` broadcasts payload via pub/sub.
7. Background pools detect Mutual Matches, recalculate ELO, update Analytics.

This prevents the "Swiping Lag" phenomenon seen in monolithic dating architectures where 5-10 synchronous tasks block the socket.
