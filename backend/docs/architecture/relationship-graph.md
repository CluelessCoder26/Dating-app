# Relationship Graph Architecture

## Purpose
The `Relationship` model acts as a finite-state representation between any two unique Users.

## Convention
`user1Id` is always the lexicographically smaller UUID. `user2Id` is the larger.
This absolute constraint guarantees that `(A, B)` and `(B, A)` both map to the exact same database row, enabling ultra-fast Unique Index lookups without complex `OR` clauses in PostgreSQL.

## States
- `UNKNOWN`: The void.
- `VIEWED`: Surfaced in discovery, not interacted with.
- `LIKED`: One-sided approval.
- `PASSED`: One-sided rejection.
- `MATCHED`: Mutual approval.
- `BLOCKED`: Absolute termination.
