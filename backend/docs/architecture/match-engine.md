# Match Engine Architecture

## Asynchronous Resolution
Matches are strictly evaluated in `MatchEngine.js` triggered by BullMQ queues. 
When `SWIPE_CREATED` fires, the Worker:
1. Queries the raw Swipe ledger for a reverse direction `LIKE` or `SUPER_LIKE`.
2. If absent, terminates cleanly.
3. If present, executes an `upsert` against the `Match` relational entity.
4. Updates the `Relationship` graph node natively to `MATCHED`.
5. Re-transmits a `MATCH_CREATED` payload back across the `EventBus`.

## Socket Emittance
The `MatchEngine` retains the authority to dispatch `io.to().emit()` payloads securely back to the active TCP connections, avoiding expensive polling from mobile apps.
