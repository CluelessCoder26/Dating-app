# AI Governance Engine

## Responsibilities
- **Rate Limiting**: Redis-based sliding window per user per category.
- **Prompt Sanitization**: Regex-based injection detection + PII redaction.
- **Response Validation**: Length and content checks.
- **Cost Tracking**: Per-request and per-period aggregation.
- **Audit Logging**: Immutable `AIAudit` records for every significant event.

## Prompt Injection Protection
Detects patterns like:
- `ignore previous instructions`
- `you are now`
- `system:`
- `[INST]`

## PII Protection
Automatically redacts:
- Email addresses → `[EMAIL_REDACTED]`
- Phone numbers → `[PHONE_REDACTED]`
