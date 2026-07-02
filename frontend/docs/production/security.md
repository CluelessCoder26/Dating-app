# Security Best Practices

## Content Security Policy (CSP)
We enforce a strict CSP to prevent XSS attacks:
- `default-src 'self'`
- `img-src 'self' data: https://cdn.datingapp.com`
- `script-src 'self'`
- `style-src 'self' 'unsafe-inline'`

## Authentication & Authorization
- **JWT Tokens**: Stored securely. Access tokens are kept in memory, while refresh tokens are in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
- **CSRF Protection**: Standard anti-CSRF tokens are required for all state-changing API requests.

## Data Sanitization
All user-generated content (e.g., bios, messages) is strictly sanitized before rendering. `dangerouslySetInnerHTML` is heavily audited and avoided where possible.
