# Storage Architecture

## Abstraction Strategy
The backend utilizes a dynamic dependency injection layer via `src/services/storage.service.js`.

### Provider Identification
The system reads the `STORAGE_PROVIDER` variable.

#### Local Development
Defaults to `local`.
Media drops directly into `/uploads` anchored against the root execution environment. The client natively addresses them via relative mounting routes.

#### Production Cloud
Targets `supabase` dynamically if ENV values detect proper instantiation.
Leveraging `@supabase/supabase-js`, binaries stream instantly from Express Memory structures straight to the Bucket configurations (`SUPABASE_BUCKET`). 

This architecture supports 1-to-1 immediate swapping for AWS S3 or Google Cloud Storage in the future by adding an `else if` routing logic, with identical `uploadBuffer()` expectations.
