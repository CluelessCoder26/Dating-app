# Cloud Architecture

## Target Topologies
SparkCloud is designed to be cloud-agnostic but optimized for managed Kubernetes services (EKS, GKE, AKS).

### Public Cloud Footprint
1. **Compute**: Managed Kubernetes cluster across 3 availability zones (AZs) for high availability.
2. **Datastore**: Managed PostgreSQL instance (e.g., Amazon RDS, Google Cloud SQL) with read replicas and automated daily snapshots.
3. **Cache/Queue**: Managed Redis cluster (e.g., ElastiCache) providing persistence (AOF) and high-throughput memory storage.
4. **Object Storage**: S3-compatible object storage for photo uploads, serving via a global Content Delivery Network (CDN).

### Service Mesh Readiness
The architecture is prepared for an Istio/Linkerd service mesh to inject sidecars for mTLS, circuit breaking, and advanced layer-7 traffic routing without requiring application code changes.
