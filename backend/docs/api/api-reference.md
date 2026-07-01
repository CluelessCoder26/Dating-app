# API Reference

## Authentication

### `POST /api/auth/register`
**Summary**: Register a new user
**Body**:
```json
{
  "phone": "+1234567890",
  "email": "user@example.com",
  "password": "Password!123"
}
```
**Response** `201 Created`:
```json
{
  "step": "otp_verification",
  "email": "user@example.com",
  "message": "OTP sent to email."
}
```

### `POST /api/auth/verify-otp`
**Summary**: Verify OTP
**Body**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```
**Response** `200 OK`:
```json
{
  "token": "eyJhb...",
  "refreshToken": "abcdef123456",
  "message": "Email verified successfully."
}
```

### `POST /api/auth/login`
**Summary**: Login user
**Body**:
```json
{
  "identifier": "user@example.com",
  "password": "Password!123"
}
```
**Response** `200 OK`:
```json
{
  "token": "eyJhb...",
  "refreshToken": "abcdef123456"
}
```

### `POST /api/auth/refresh`
**Summary**: Refresh JWT token
**Body**:
```json
{
  "refreshToken": "abcdef123456"
}
```

### `POST /api/auth/logout`
**Summary**: Logout current device
**Response** `200 OK`: `{ "message": "Logged out successfully" }`

### `POST /api/auth/logout-all`
**Summary**: Logout all devices
**Response** `200 OK`: `{ "message": "Logged out of all devices successfully" }`

### `GET /api/auth/me`
**Summary**: Get current authenticated user profile
**Headers**: `Authorization: Bearer <token>`
**Response** `200 OK`:
```json
{
  "profile": {
    "id": "uuid",
    "name": "Alex",
    "age": 25,
    "gender": "male",
    "preference": "everyone",
    "photos": []
  }
}
```

## Health

### `GET /health`
**Response** `200 OK`:
```json
{
  "status": "healthy",
  "timestamp": "2026-07-01T15:25:00.000Z",
  "services": {
    "database": "up",
    "redis": "up",
    "bullmq": "up",
    "socket": "up"
  }
}
```

## Profile
### `GET /api/profile`
### `POST /api/profile`
### `PUT /api/profile`

## Photos
### `POST /api/photos/upload`
### `DELETE /api/photos/{photoId}`

## Swipe
### `POST /api/swipe`
### `GET /api/swipe/matches`
### `GET /api/swipe/matches/{matchId}/messages`
### `POST /api/swipe/matches/{matchId}/read`

## Block
### `GET /api/block`
### `POST /api/block`
### `DELETE /api/block/{blockedId}`
