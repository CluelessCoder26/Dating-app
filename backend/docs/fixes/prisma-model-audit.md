# Prisma Model Audit Report

**Date**: 2026-07-03
**Scope**: `backend/prisma/schema.prisma` vs. all runtime service/controller references

---

## Schema Model Inventory

| # | Model Name | Prisma Client Accessor | Line Range | Status |
|---|-----------|----------------------|------------|--------|
| 1 | User | `prisma.user` | 11–35 | ✅ Valid |
| 2 | Otp | `prisma.otp` | 37–46 | ✅ Valid |
| 3 | RefreshToken | `prisma.refreshToken` | 48–61 | ✅ Valid |
| 4 | LoginAttempt | `prisma.loginAttempt` | 63–70 | ✅ Valid |
| 5 | DiscoveryMetric | `prisma.discoveryMetric` | 72–80 | ✅ Valid |
| 6 | SecurityAudit | `prisma.securityAudit` | 82–93 | ✅ Valid |
| 7 | Profile | `prisma.profile` | 95–122 | ✅ Valid |
| 8 | Preference | `prisma.preference` | 124–137 | ✅ Valid |
| 9 | Setting | `prisma.setting` | 139–150 | ✅ Valid |
| 10 | Photo | `prisma.photo` | 152–165 | ✅ Valid |
| 11 | PhotoVerification | `prisma.photoVerification` | 167–190 | ✅ Valid |
| 12 | Swipe | `prisma.swipe` | 192–202 | ✅ Valid |
| 13 | Match | `prisma.match` | 204–215 | ✅ Valid |
| 14 | MatchMetadata | `prisma.matchMetadata` | 217–227 | ✅ Valid |
| 15 | Relationship | `prisma.relationship` | 229–240 | ✅ Valid |
| 16 | InteractionHistory | `prisma.interactionHistory` | 242–253 | ✅ Valid |
| 17 | Conversation | `prisma.conversation` | 255–263 | ✅ Valid |
| 18 | Participant | `prisma.participant` | 265–278 | ✅ Valid |
| 19 | Message | `prisma.message` | 280–295 | ✅ Valid |
| 20 | Attachment | `prisma.attachment` | 297–306 | ✅ Valid |
| 21 | MessageStatus | `prisma.messageStatus` | 308–319 | ✅ Valid |
| 22 | Block | `prisma.block` | 321–329 | ✅ Valid |
| 23 | Mute | `prisma.mute` | 331–339 | ✅ Valid |
| 24 | Report | `prisma.report` | 341–358 | ✅ Valid |
| 25 | Appeal | `prisma.appeal` | 360–374 | ✅ Valid |
| 26 | ModerationCase | `prisma.moderationCase` | 376–388 | ✅ Valid |
| 27 | RiskAssessment | `prisma.riskAssessment` | 390–404 | ✅ Valid |
| 28 | Reputation | `prisma.reputation` | 406–416 | ✅ Valid |
| 29 | Restriction | `prisma.restriction` | 418–430 | ✅ Valid |
| 30 | AuditEvent | `prisma.auditEvent` | 432–445 | ✅ Valid |
| 31 | ModeratorAction | `prisma.moderatorAction` | 447–457 | ✅ Valid |
| 32 | Plan | `prisma.plan` | 459–469 | ✅ Valid |
| 33 | Subscription | `prisma.subscription` | 471–489 | ✅ Valid |
| 34 | Feature | `prisma.feature` | 491–497 | ✅ Valid |
| 35 | Entitlement | `prisma.entitlement` | 499–509 | ✅ Valid |
| 36 | FeatureFlag | `prisma.featureFlag` | 511–519 | ✅ Valid |
| 37 | Experiment | `prisma.experiment` | 521–528 | ✅ Valid |
| 38 | ExperimentVariant | `prisma.experimentVariant` | 530–536 | ✅ Valid |
| 39 | Promotion | `prisma.promotion` | 538–548 | ✅ Valid |
| 40 | Coupon | `prisma.coupon` | 550–558 | ✅ Valid |
| 41 | Referral | `prisma.referral` | 560–569 | ✅ Valid |
| 42 | Reward | `prisma.reward` | 571–582 | ✅ Valid |
| 43 | Achievement | `prisma.achievement` | 584–591 | ✅ Valid |
| 44 | AchievementProgress | `prisma.achievementProgress` | 593–602 | ✅ Valid |
| 45 | Purchase | `prisma.purchase` | 604–617 | ✅ Valid |
| 46 | Invoice | `prisma.invoice` | 619–625 | ✅ Valid |
| 47 | BillingEvent | `prisma.billingEvent` | 627–633 | ✅ Valid |
| 48 | PromptTemplate | `prisma.promptTemplate` | 635–645 | ✅ Valid |
| 49 | PromptVersion | `prisma.promptVersion` | 647–655 | ✅ Valid |
| 50 | AIRequest | `prisma.aIRequest` | 657–674 | ✅ Valid |
| 51 | AIResponse | `prisma.aIResponse` | 676–683 | ✅ Valid |
| 52 | Embedding | `prisma.embedding` | 685–696 | ✅ Valid |
| 53 | CompatibilityProfile | `prisma.compatibilityProfile` | 698–714 | ✅ Valid |
| 54 | RelationshipMemory | `prisma.relationshipMemory` | 716–729 | ✅ Valid |
| 55 | ConversationSummary | `prisma.conversationSummary` | 731–740 | ✅ Valid |
| 56 | AIUsage | `prisma.aIUsage` | 742–756 | ✅ Valid |
| 57 | AIAudit | `prisma.aIAudit` | 758–768 | ✅ Valid |
| 58 | OpsAudit | `prisma.opsAudit` | 770–785 | ✅ Valid |
| 59 | Incident | `prisma.incident` | 787–798 | ✅ Valid |
| 60 | OpsMetric | `prisma.opsMetric` | 800–809 | ✅ Valid |

---

## Issues Found & Fixed

### ❌ CRITICAL: `AuditLog` model referenced but does not exist

- **File**: `auth.service.js:42`
- **Code**: `tx.auditLog.create(...)` inside `registerUser()` transaction
- **Root Cause**: The code references `auditLog` which is not a model in `schema.prisma`. The correct model is `SecurityAudit` (Prisma accessor: `securityAudit`).
- **Fix**: Changed to `tx.securityAudit.create(...)`
- **Impact**: This was the direct cause of `TypeError: Cannot read properties of undefined (reading 'create')`

### ✅ No other invalid model references detected

All other `prisma.xxx` and `tx.xxx` calls reference models that exist in the schema.

---

## Audit Model Inventory

The schema defines **4 domain-specific audit models**, each serving a distinct bounded context:

| Model | Accessor | Domain | Used By |
|-------|----------|--------|---------|
| `SecurityAudit` | `prisma.securityAudit` | User security events | auth, profile, photo services |
| `AuditEvent` | `prisma.auditEvent` | Trust/moderation events | RiskEngine |
| `OpsAudit` | `prisma.opsAudit` | Admin operations audit | AuditPlatform |
| `AIAudit` | `prisma.aIAudit` | AI subsystem audit | AIGovernanceEngine |

> These are **architecturally distinct** and serve different bounded contexts. They are NOT duplicates.
