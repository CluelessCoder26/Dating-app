# Presence Engine Architecture

## Purpose
Track active user connections instantaneously across a horizontally scaled backend.

## Redis Sets
When a socket connects, `SADD presence:{userId}:sockets {socketId}` fires.
When a socket drops, `SREM presence:{userId}:sockets {socketId}` fires.

If the Set cardinality reaches `0`, the `PresenceEngine` writes `offline` to the master Hash and broadcasts `presence.update` across the mesh network. This completely circumvents stale online flags in PostgreSQL.
