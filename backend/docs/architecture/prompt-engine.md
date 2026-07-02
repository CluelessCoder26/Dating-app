# Prompt Engine

## Template Storage
Prompts are stored in the `PromptTemplate` table with:
- Unique `key` for lookup.
- `category` for organization.
- `template` with `{{variable}}` interpolation syntax.

## Versioning
Each template can have multiple `PromptVersion` records. Only the `active` version is served. This enables A/B testing and instant rollback.

## Caching
Templates are cached in Redis (TTL: 1800s) to minimize database lookups.
