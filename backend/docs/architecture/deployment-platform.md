# Deployment Platform Architecture

## Strategy
The Deployment Platform embraces immutable infrastructure and declarative configuration via Kubernetes.

### Containerization
- **Base Image**: `node:22-alpine` for reduced attack surface and footprint.
- **Multi-Stage Build**: Compiles Prisma engines and installs dependencies in a builder stage, copying only production artifacts to the final image.
- **Non-Root Execution**: Runs under a dedicated `node` user to prevent privilege escalation.

### Orchestration (Kubernetes)
- **Namespaces**: Isolates resources into `spark-prod`, `spark-staging`, and `spark-monitoring`.
- **Deployments**: Manages stateless API servers and BullMQ workers.
- **StatefulSets**: Used for stateful dependencies (if hosted in-cluster) like Redis.
- **HPA**: Autoscales API pods on HTTP request latency and CPU limits.

### CI/CD Pipeline
GitHub Actions automates the lifecycle:
1. **Validation**: Lint, Unit Tests, Security/Dependency Scan.
2. **Build**: Docker build and ECR/GCR push.
3. **Deploy**: Updates K8s Deployment image tags via Rolling Updates.
