# Security Review: Spark React Application

## Overview
This security review identifies vulnerabilities and weak practices within the frontend architecture of the Spark application. Immediate remediation is required to protect user data and ensure secure interactions with the backend.

## Security Vulnerabilities

### 1. Token Storage in `localStorage`
* **Critique:** The application currently stores authentication tokens (e.g., JWTs) in `localStorage`.
* **Impact:** `localStorage` is accessible via JavaScript. If the application is vulnerable to Cross-Site Scripting (XSS), attackers can easily extract these tokens and impersonate users.
* **Recommendation:** Migrate token storage to `HttpOnly`, `Secure`, `SameSite` cookies handled by the backend. If tokens must be stored client-side for architectural reasons, consider memory storage combined with a robust silent refresh mechanism.

### 2. Lack of CSRF/XSS Protection in Raw Fetch Wrappers
* **Critique:** The application uses raw `fetch` calls without centralized interceptors. This leads to inconsistent security headers and un-sanitized data handling.
* **Impact:** 
  * **XSS:** Rendering raw string data directly into the DOM without sanitization exposes the app to XSS.
  * **CSRF:** Without standardized headers (e.g., custom Anti-CSRF tokens), the application might be vulnerable if relying on cookie-based sessions.
* **Recommendation:** Implement a centralized API client (like Axios) that automatically attaches necessary security headers. Ensure that React's built-in XSS protections are not bypassed (avoid using `dangerouslySetInnerHTML` unless strictly necessary and combined with a sanitizer like DOMPurify).

### 3. Route Guards and Client-Side Authorization
* **Critique:** Because routing is manually managed via `useState`, enforcing strict access control (e.g., preventing an unauthenticated user from setting the state to `DiscoveryCanvas`) is complex and error-prone.
* **Impact:** Users may be able to force the client to render protected views, potentially exposing sensitive data if API calls fail open or client-side logic is flawed.
* **Recommendation:** Transition to a standardized routing library and implement declarative Route Guards (e.g., Higher-Order Components or layout wrappers) that automatically verify authentication state before rendering protected routes.

## Summary of Action Items
1. Remove JWTs from `localStorage` and transition to secure cookies.
2. Centralize network requests and enforce security headers.
3. Audit the codebase for dangerous DOM manipulations.
4. Implement strict, declarative route guarding.
