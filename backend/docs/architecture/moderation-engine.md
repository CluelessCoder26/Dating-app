# Moderation Engine Architecture

## Workflow
1. User submits a Report.
2. `TrustService` creates `Report (PENDING)`.
3. `ModerationWorker` picks up the job.
4. Passes payload to `SafetyEngine` (AI Check).
5. If actionable, triggers `RiskEngine`.
6. If severe, creates a `ModerationCase (OPEN)`.
7. Moderator invokes `/api/moderation/cases/:id` to execute `BAN/WARN`.

## Audit Logging
Every Moderator invocation triggers an immutable `AuditEvent` detailing `prevState`, `newState`, and `moderatorId`.
