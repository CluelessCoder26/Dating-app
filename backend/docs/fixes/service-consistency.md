# Service Consistency Report

**Date**: 2026-07-03
**Scope**: All backend services — Prisma model references, imports, and transactions

---

## Service Inventory & Prisma Consistency

### Core Services (src/services/)

| Service | Prisma Models Used | Status |
|---------|-------------------|--------|
| `auth.service.js` | user, otp, securityAudit, loginAttempt | ✅ Fixed |
| `jwt.service.js` | refreshToken | ✅ Clean |
| `email.service.js` | (none — external SMTP only) | ✅ Clean |
| `profile.service.js` | user, profile, securityAudit, preference, setting, photo, block | ✅ Clean |
| `photo.service.js` | profile, photo, photoVerification, securityAudit | ✅ Clean |
| `interaction.service.js` | interactionHistory, match, relationship | ✅ Clean |
| `ai.service.js` | (none — delegates to providers) | ✅ Clean |
| `storage.service.js` | (none — file system / Supabase) | ✅ Clean |

### Discovery Services (src/services/discovery/)

| Service | Prisma Models Used | Status |
|---------|-------------------|--------|
| `discovery.service.js` | discoveryMetric | ✅ Clean |
| `candidateGenerator.js` | profile, photo | ✅ Clean |
| `eligibilityEngine.js` | swipe, block | ✅ Clean |
| `rankingEngine.js` | (none — pure scoring) | ✅ Clean |
| `recommendationEngine.js` | (delegates to generators) | ✅ Clean |

### Trust Services (src/services/trust/)

| Service | Prisma Models Used | Status |
|---------|-------------------|--------|
| `TrustService.js` | block, mute, report | ✅ Clean |
| `RiskEngine.js` | riskAssessment, restriction, auditEvent | ✅ Clean |
| `ReputationEngine.js` | reputation | ✅ Clean |
| `ModerationEngine.js` | moderationCase, moderatorAction, appeal, restriction | ✅ Clean |
| `SafetyEngine.js` | (none — delegates to queues) | ✅ Clean |

### Growth Services (src/services/growth/)

| Service | Prisma Models Used | Status |
|---------|-------------------|--------|
| `SubscriptionEngine.js` | plan, subscription | ✅ Clean |
| `EntitlementEngine.js` | entitlement, feature | ✅ Clean |
| `PromotionEngine.js` | promotion, coupon | ✅ Clean |
| `ReferralEngine.js` | referral | ✅ Clean |
| `RewardEngine.js` | reward | ✅ Clean |
| `GrowthEngine.js` | achievementProgress, achievement | ✅ Clean |
| `ExperimentEngine.js` | experiment | ✅ Clean |
| `FeatureFlagEngine.js` | featureFlag | ✅ Clean |
| `GrowthService.js` | (facade — delegates to engines) | ✅ Clean |

### Interaction Services (src/services/interaction/)

| Service | Prisma Models Used | Status |
|---------|-------------------|--------|
| `SwipeEngine.js` | profile, interactionHistory, swipe, relationship | ✅ Clean |
| `MatchEngine.js` | swipe, match, matchMetadata, relationship | ✅ Clean |
| `relationship.service.js` | relationship | ✅ Clean |
| `AnalyticsService.js` | (logger only) | ✅ Clean |

### Ops Services (src/services/ops/)

| Service | Prisma Models Used | Status |
|---------|-------------------|--------|
| `AuditPlatform.js` | opsAudit | ✅ Clean |
| `IncidentPlatform.js` | incident | ✅ Clean |
| `MonitoringPlatform.js` | (raw SQL health check) | ✅ Clean |
| `AnalyticsPlatform.js` | user, match, message | ✅ Clean |
| `AIOperationsPlatform.js` | aIRequest | ✅ Clean |
| `SparkOpsGateway.js` | incident | ✅ Clean |

### AIOS Services (src/services/aios/)

| Service | Prisma Models Used | Status |
|---------|-------------------|--------|
| `AIGovernanceEngine.js` | aIUsage, aIAudit, aIRequest | ✅ Clean |
| `CompatibilityEngine.js` | profile, compatibilityProfile | ✅ Clean |
| `EmbeddingEngine.js` | embedding | ✅ Clean |
| `PromptEngine.js` | promptTemplate | ✅ Clean |
| `RelationshipMemoryEngine.js` | relationshipMemory, match | ✅ Clean |

---

## Transaction Audit

| File | Line | Type | Models Used | Status |
|------|------|------|-------------|--------|
| `auth.service.js` | 15 | Interactive (`tx =>`) | tx.user, tx.otp, tx.securityAudit | ✅ Fixed |
| `PromotionEngine.js` | 17 | Batch (array) | prisma.coupon, prisma.promotion | ✅ Clean |

---

## Import Consistency

### Issue: Stale `db.js` import path

Two route files imported Prisma through a legacy shim (`../db.js`) instead of the canonical path (`../config/prisma.js`):

| File | Before | After | Status |
|------|--------|-------|--------|
| `routes/block.js` | `import prisma from '../db.js'` | `import prisma from '../config/prisma.js'` | ✅ Fixed |
| `routes/swipe.js` | `import prisma from '../db.js'` | `import prisma from '../config/prisma.js'` | ✅ Fixed |

All other 40+ files consistently import from `config/prisma.js`.

---

## Duplicate Service Analysis

### StorageService.js vs storage.service.js

| File | Purpose | Used By | Status |
|------|---------|---------|--------|
| `StorageService.js` | Bootstrap: creates `uploads/` dir | `index.js` (init only) | Legacy utility |
| `storage.service.js` | Runtime: upload/delete with Supabase/local | `photo.service.js` | Active service |

**Assessment**: These serve different lifecycle phases (bootstrap vs runtime) and are NOT duplicate implementations. `StorageService.js` is a lightweight init utility. Documented as tech debt for future consolidation but no code change needed.

---

## Summary

- **1 critical fix**: `tx.auditLog` → `tx.securityAudit` in auth.service.js
- **2 import fixes**: Standardized block.js and swipe.js to use canonical Prisma import
- **0 other invalid model references** across 35+ service files
- **0 broken imports** detected
- **0 duplicate service implementations** requiring merge
