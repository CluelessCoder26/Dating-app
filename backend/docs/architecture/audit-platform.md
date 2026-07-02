# Audit Platform Architecture

## Responsibilities
The Audit Platform provides a strict, immutable layer of accountability for all actions performed within SparkOps.

### Core Model: OpsAudit
Every state-mutating action taken by a Super Admin, Operations Admin, Moderator, or other internal role must be routed through `AuditPlatform.logAction()`.

### Tracked Metadata
- **Who**: `adminId` and their specific role.
- **When**: High-precision timestamp.
- **Why**: Administrator-provided justification or automated system reason.
- **Context**: IP address, User-Agent, and active session ID.
- **Change**: `oldValue` vs. `newValue` in JSON serialization.

### Integrity
Audit logs are write-only. There are no API routes or internal mechanisms to update or delete rows from the `OpsAudit` table.
