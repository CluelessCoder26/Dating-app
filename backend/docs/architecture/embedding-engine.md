# Embedding Engine

## Vector Generation
Uses `MockEmbeddingProvider` (384 dimensions) for development. Deterministic embeddings based on character codes ensure reproducible test results.

## Storage
Embeddings are stored in `Embedding` table as JSON-serialized float arrays. The schema uses a composite unique key `(entityType, entityId)`.

## Vector Search Readiness
The `VectorStore` abstract class supports future integration with:
- pgvector (PostgreSQL extension)
- Pinecone
- Weaviate
- Qdrant
- Milvus

## Similarity
Built-in `cosineSimilarity()` method for direct vector comparison.
