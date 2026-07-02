# Security Flows

This document details the standard authentication flows and security mechanisms implemented in the app.

## 1. Registration Flow
1. User enters email/password or selects a Social Provider.
2. Form validation ensures password strength (min 8 chars, alphanumeric + symbol).
3. Backend creates user and sends a verification email.
4. User clicks the verification link to activate the account.

## 2. Login Flow
1. Client sends credentials to `/auth/login`.
2. Backend validates credentials.
3. Backend returns Access Token and sets Refresh Token (via HTTPOnly cookie or response payload).
4. Client initializes the session and redirects to the dashboard.

## 3. Password Reset Flow
1. User requests reset via `/auth/forgot-password`.
2. A time-limited reset token is generated and emailed.
3. User accesses the link and submits a new password.
4. Backend invalidates all existing sessions upon successful reset.

## 4. Multi-Factor Authentication (MFA) - Future Scope
- Support for TOTP or SMS-based verification on new device logins.

## Rate Limiting & Brute Force Protection
- Maximum 5 failed login attempts per 15 minutes per IP/User.
- Account lockout after consecutive failures.
