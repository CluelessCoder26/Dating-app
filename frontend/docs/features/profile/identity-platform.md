# Identity Platform Documentation

## Overview
The Identity Platform handles user authentication, authorization, session management, and primary identity verification for the Dating App.

## Architecture
- **Auth Provider:** OAuth 2.0 / OIDC integrations (Google, Apple, Phone/SMS).
- **Session Manager:** JWT-based stateless sessions with refresh token rotation.
- **Identity Store:** Secure storage of primary credentials and identifiers.

## Key Components
- `LoginForm`: Handles credential collection and submission.
- `AuthProvider`: React Context provider managing global auth state.
- `ProtectedRoute`: HOC/Wrapper for enforcing authenticated access.

## API Interfaces
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
