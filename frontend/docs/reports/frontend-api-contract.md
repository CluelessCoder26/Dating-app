# Frontend API Contract Agreement

## Overview
This document outlines the agreed-upon standards for REST API communication between the Frontend and Backend teams for the Dating Platform.

## Base Configuration
- **Content-Type**: `application/json` (except for multipart/form-data when absolutely required, though presigned URLs are preferred for uploads).
- **Authentication**: Bearer Token in the `Authorization` header (`Authorization: Bearer <token>`).

## Standard Response Format
All API responses must follow a predictable envelope structure.

### Success Response (2xx)
```json
{
  "success": true,
  "data": { ... },
  "meta": { 
    "page": 1,
    "total": 100
  } // Optional, for pagination
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      { "field": "email", "issue": "Invalid email format" }
    ]
  }
}
```

## Pagination Standard
Cursor-based pagination is preferred for feeds (e.g., Match feed, Message history). Offset-based pagination is acceptable for admin tables.

## HTTP Status Codes
- `200 OK`: Successful read/update.
- `201 Created`: Successful creation.
- `204 No Content`: Successful deletion (no body returned).
- `400 Bad Request`: Validation errors.
- `401 Unauthorized`: Missing or invalid JWT.
- `403 Forbidden`: Authenticated, but lacks permissions.
- `404 Not Found`: Resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Backend crash.
