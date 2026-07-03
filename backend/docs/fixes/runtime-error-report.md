# Runtime Error Report

**Date**: 2026-07-03
**Error**: `TypeError: Cannot read properties of undefined (reading 'create')`
**Location**: `backend/src/services/auth.service.js:42`

---

## Error Details

```
TypeError: Cannot read properties of undefined (reading 'create')
    at auth.service.js:42 (inside registerUser → prisma.$transaction)
```

The error occurs during user registration when the code attempts to create an audit log entry inside a Prisma interactive transaction.

---

## Root Cause

### The Bug

```javascript
// Line 42 (BEFORE FIX)
await tx.auditLog.create({
  data: {
    userId: txUser.id,
    action: 'register',
    ipAddress: ipAddress || 'unknown',
    details: 'User registered successfully'
  }
});
```

### Why It Fails

1. The Prisma schema (`schema.prisma`) does **not** define a model named `AuditLog`.
2. Prisma Client generates typed accessors only for models defined in the schema.
3. `tx.auditLog` evaluates to `undefined` because the property doesn't exist on the Prisma transaction client.
4. Calling `.create()` on `undefined` throws `TypeError: Cannot read properties of undefined (reading 'create')`.

### The Correct Model

The schema defines `SecurityAudit` (line 82–93 of schema.prisma), which Prisma Client exposes as `prisma.securityAudit`:

```prisma
model SecurityAudit {
  id        String   @id @default(uuid())
  userId    String?
  action    String
  ipAddress String?
  details   String?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([createdAt])
}
```

The fields `userId`, `action`, `ipAddress`, and `details` match exactly what the auth service writes.

---

## Fix Applied

```diff
-      await tx.auditLog.create({
+      await tx.securityAudit.create({
         data: {
           userId: txUser.id,
           action: 'register',
           ipAddress: ipAddress || 'unknown',
           details: 'User registered successfully'
         }
       });
```

**File modified**: `backend/src/services/auth.service.js`
**Line**: 42

---

## Impact

### Before Fix
- **Registration**: 💥 BROKEN — every registration attempt throws TypeError
- **Transaction**: Automatically rolled back by Prisma — no user, OTP, or audit record created
- **Email**: Never sent (code is after the transaction)

### After Fix
- **Registration**: ✅ User created, OTP created, audit logged, email sent
- **Transaction**: Commits successfully with all three operations (user + OTP + audit)
- **Email**: Sent after successful transaction commit

---

## How This Bug Could Have Been Prevented

1. **Prisma Client type checking**: Using TypeScript instead of JavaScript would have caught `tx.auditLog` as a compile-time error.
2. **Integration tests**: A test covering `registerUser()` against a real database would have caught this immediately.
3. **Generated client validation**: Running `npx prisma generate` and checking for type mismatches.

---

## Verification

After fix, the `logAudit()` helper method (line 192–196) and the transaction audit call (line 42) both consistently use `prisma.securityAudit` / `tx.securityAudit`, which is the canonical accessor for the `SecurityAudit` model.
