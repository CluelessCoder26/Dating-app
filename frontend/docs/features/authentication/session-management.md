# Session Management

This document describes how user sessions are managed and maintained securely across the application.

## Token Strategy
- **Access Token**: Short-lived (e.g., 15 minutes) JWT token used for API authorization.
- **Refresh Token**: Long-lived (e.g., 7 days) opaque token or securely signed JWT used to obtain new access tokens.

## Storage
- **Web**: 
  - Access Tokens: Stored in memory or short-lived state.
  - Refresh Tokens: Stored in Secure `HTTPOnly` and `SameSite=Strict` cookies.
- **Mobile (React Native/etc.)**:
  - Stored in Encrypted Keychain / Keystore.

## Token Refresh Strategy
1. The client makes an API request.
2. If a `401 Unauthorized` (Token Expired) is received, the client pauses pending requests.
3. A background request is made to the `/auth/refresh` endpoint using the refresh token.
4. On success, the access token is updated, and pending requests are retried.
5. On failure, the user is redirected to the login screen.

## Session Invalidation
- **Explicit Logout**: Both Access and Refresh tokens are revoked on the backend and cleared locally.
- **Security Triggers**: Password changes or account locks automatically invalidate all active sessions.
