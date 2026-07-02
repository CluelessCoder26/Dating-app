# Security Platform Architecture

## Strategy
The Security Platform operates on the principle of defense-in-depth, embedding security checks into both the software lifecycle and runtime environment.

### Pipeline Security
- **SAST (Static Application Security Testing)**: ESLint security plugins flag unsafe RegEx and proto-pollution risks.
- **SCA (Software Composition Analysis)**: `npm audit` and Dependabot automatically detect and patch vulnerable transitive dependencies.
- **Container Scanning**: Trivy scans the Docker image for OS-level vulnerabilities during the CI/CD build phase.

### Runtime Security
- **Network Policies**: Kubernetes Network Policies isolate namespaces; workers cannot be accessed by external ingress, and databases can only be accessed by the API and workers.
- **Application Hardening**: Helmet secures HTTP headers (HSTS, CSP, X-Frame-Options). Rate limiting protects brute-force login and GraphQL/API endpoints.
- **Authentication**: Stateless, short-lived JWTs paired with long-lived refresh tokens stored securely as HttpOnly cookies.
- **AI Governance**: Prompt injection protection middleware validates user inputs before routing to external LLMs.
