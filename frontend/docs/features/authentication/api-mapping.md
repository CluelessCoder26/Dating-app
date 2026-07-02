# Authentication API Mapping

This document maps the REST/GraphQL endpoints used for authentication in the system.

## Endpoints

### `POST /api/auth/register`
- **Description**: Registers a new user account.
- **Request Body**: `{ "email": "...", "password": "...", "firstName": "..." }`
- **Response**: `201 Created` with User object.

### `POST /api/auth/login`
- **Description**: Authenticates a user.
- **Request Body**: `{ "email": "...", "password": "..." }`
- **Response**: `200 OK` with `{ "accessToken": "..." }` (Refresh token in Cookie).

### `POST /api/auth/refresh`
- **Description**: Issues a new access token using a valid refresh token.
- **Headers/Cookies**: Requires valid Refresh Cookie.
- **Response**: `200 OK` with `{ "accessToken": "..." }`.

### `POST /api/auth/logout`
- **Description**: Invalidates the current session.
- **Headers**: Requires Bearer token.
- **Response**: `204 No Content`.

### `POST /api/auth/forgot-password`
- **Description**: Initiates the password recovery flow.
- **Request Body**: `{ "email": "..." }`
- **Response**: `202 Accepted`.

### `POST /api/auth/reset-password`
- **Description**: Completes the password recovery flow.
- **Request Body**: `{ "token": "...", "newPassword": "..." }`
- **Response**: `200 OK`.

## Error Handling
- `400 Bad Request`: Invalid input validation.
- `401 Unauthorized`: Missing or invalid token/credentials.
- `403 Forbidden`: Insufficient permissions.
- `429 Too Many Requests`: Rate limit exceeded.
