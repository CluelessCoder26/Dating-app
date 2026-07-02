# API Platform Architecture

## Overview
The API platform configures how the frontend communicates with backend HTTP servers. We use **Axios** as the primary HTTP client.

## Configuration
The Axios instance is configured in `src/lib/apiClient.ts`. It includes base URLs, timeout settings, and default headers.

## Interceptors
We utilize Axios interceptors for cross-cutting concerns:

1. **Request Interceptor (Auth)**:
   - Attaches the JWT Bearer token from local storage/secure cookies to the `Authorization` header of every outbound request.
2. **Response Interceptor (Error Handling & Token Refresh)**:
   - Globally catches 401 Unauthorized responses.
   - Triggers the token refresh flow automatically. If the refresh fails, it logs the user out and redirects to the login page.
   - Formats and normalizes API error payloads into standard JavaScript `Error` objects for consistent handling in the UI.

## Environment Variables
The base API URL is driven by environment variables:
- `VITE_API_BASE_URL`: Base URL for REST endpoints.
