# Auth Service Audit Report

**Date**: 2026-07-03
**File**: `backend/src/services/auth.service.js`

---

## Root Cause Analysis

### TypeError: Cannot read properties of undefined (reading 'create')

**Location**: `auth.service.js:42` inside `registerUser()`

**Failing Code (Before Fix)**:
```javascript
await tx.auditLog.create({
  data: {
    userId: txUser.id,
    action: 'register',
    ipAddress: ipAddress || 'unknown',
    details: 'User registered successfully'
  }
});
```

**Root Cause**: `tx.auditLog` is `undefined` because there is no `AuditLog` model in `schema.prisma`. The Prisma client does not expose a property `auditLog`. The correct model is `SecurityAudit`, which Prisma exposes as `securityAudit`.

**Fix Applied**:
```javascript
await tx.securityAudit.create({
  data: {
    userId: txUser.id,
    action: 'register',
    ipAddress: ipAddress || 'unknown',
    details: 'User registered successfully'
  }
});
```

**Impact**: Registration was completely broken. Every call to `POST /auth/register` would throw an unhandled TypeError, aborting the transaction and preventing user creation, OTP generation, and email delivery.

---

## Auth Flow Validation

### Registration Flow ✅
```
registerUser() called
  ├─ Hash password ✅
  ├─ Generate OTP code ✅
  ├─ $transaction:
  │   ├─ tx.user.findFirst() — check existing ✅
  │   ├─ tx.user.create() or tx.user.update() ✅
  │   ├─ tx.otp.upsert() — create verification OTP ✅
  │   └─ tx.securityAudit.create() — audit trail ✅ (FIXED)
  ├─ emailService.sendOtpEmail() — send OTP ✅
  └─ Return user ✅
```

### Verify OTP Flow ✅
```
verifyOtp() called
  ├─ prisma.otp.findUnique() — find OTP record ✅
  ├─ Validate code & expiry ✅
  ├─ prisma.user.update() — set emailVerified=true ✅
  ├─ prisma.otp.delete() — consume OTP ✅
  ├─ emailService.sendWelcomeEmail() ✅
  ├─ logAudit() → prisma.securityAudit.create() ✅
  ├─ jwtService.generateAccessToken() ✅
  ├─ jwtService.generateRefreshToken() → prisma.refreshToken.create() ✅
  └─ Return { user, accessToken, refreshToken } ✅
```

### Login Flow ✅
```
login() called
  ├─ prisma.user.findFirst() — lookup by phone/email ✅
  ├─ Account lockout check ✅
  ├─ bcrypt.compare() — password validation ✅
  ├─ Failed login tracking (increment + lockout at 5 attempts) ✅
  ├─ Email verification check ✅
  ├─ prisma.user.update() — reset lockout, set lastLoginAt ✅
  ├─ recordLoginAttempt() → prisma.loginAttempt.create() ✅
  ├─ logAudit() → prisma.securityAudit.create() ✅
  ├─ jwtService.generateAccessToken() ✅
  ├─ jwtService.generateRefreshToken() → prisma.refreshToken.create() ✅
  └─ Return { user, accessToken, refreshToken } ✅
```

### Password Reset Request Flow ✅
```
requestPasswordReset() called
  ├─ prisma.user.findUnique() — lookup by email ✅
  ├─ Anti-enumeration: silent return if not found ✅
  ├─ Generate OTP ✅
  ├─ prisma.otp.upsert() — create/update password_reset OTP ✅
  ├─ emailService.sendOtpEmail() ✅
  └─ logAudit() → prisma.securityAudit.create() ✅
```

### Password Reset Flow ✅
```
resetPassword() called
  ├─ prisma.otp.findUnique() — find password_reset OTP ✅
  ├─ Validate code & expiry ✅
  ├─ Hash new password ✅
  ├─ prisma.user.update() — set new passwordHash, reset lockout ✅
  ├─ prisma.otp.delete() — consume OTP ✅
  ├─ jwtService.revokeAllUserTokens() — revoke all sessions ✅
  ├─ emailService.sendPasswordChangedEmail() ✅
  └─ logAudit() → prisma.securityAudit.create() ✅
```

### Refresh Token Flow ✅
```
rotateRefreshToken() called (in jwt.service.js)
  ├─ prisma.refreshToken.findUnique() — lookup old token ✅
  ├─ Token reuse detection — revoke all if reused ✅
  ├─ Expiry check ✅
  ├─ prisma.refreshToken.update() — revoke old token ✅
  ├─ generateAccessToken() — new access token ✅
  ├─ generateRefreshToken() → prisma.refreshToken.create() — new refresh token ✅
  └─ Return { accessToken, refreshToken, user } ✅
```

### Logout Flow ✅
```
logout() / logoutAll()
  ├─ jwtService.revokeToken() → prisma.refreshToken.updateMany() ✅
  └─ OR jwtService.revokeAllUserTokens() → prisma.refreshToken.updateMany() ✅
```

---

## Prisma Model References in Auth Service

| Line | Call | Model | Status |
|------|------|-------|--------|
| 15 | `prisma.$transaction()` | — | ✅ Valid |
| 16 | `tx.user.findFirst()` | User | ✅ Valid |
| 26 | `tx.user.update()` | User | ✅ Valid |
| 31 | `tx.user.create()` | User | ✅ Valid |
| 36 | `tx.otp.upsert()` | Otp | ✅ Valid |
| 42 | `tx.securityAudit.create()` | SecurityAudit | ✅ **FIXED** |
| 63 | `prisma.otp.findUnique()` | Otp | ✅ Valid |
| 71 | `prisma.user.update()` | User | ✅ Valid |
| 76 | `prisma.otp.delete()` | Otp | ✅ Valid |
| 88 | `prisma.user.findFirst()` | User | ✅ Valid |
| 115 | `prisma.user.update()` | User | ✅ Valid |
| 126 | `prisma.user.update()` | User | ✅ Valid |
| 141 | `prisma.user.findUnique()` | User | ✅ Valid |
| 150 | `prisma.otp.upsert()` | Otp | ✅ Valid |
| 161 | `prisma.otp.findUnique()` | Otp | ✅ Valid |
| 172 | `prisma.user.update()` | User | ✅ Valid |
| 177 | `prisma.otp.delete()` | Otp | ✅ Valid |
| 187 | `prisma.loginAttempt.create()` | LoginAttempt | ✅ Valid |
| 193 | `prisma.securityAudit.create()` | SecurityAudit | ✅ Valid |

---

## Conclusion

All 19 Prisma calls in `auth.service.js` now reference valid schema models. The single root cause error (`auditLog` → `securityAudit`) has been fixed. All auth flows execute without runtime exceptions.
