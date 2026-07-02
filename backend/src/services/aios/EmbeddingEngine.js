import prisma from '../../config/prisma.js';
import { providerRouter } from './ProviderRouter.js';
import { eventBus } from '../../events/eventBus.js';
import logger from '../../utils/logger.js';

class EmbeddingEngine {
  async generateAndStore(entityType, entityId, text) {
    const provider = providerRouter.getEmbeddingProvider('mock');
    const result = await provider.embed(text);
    const embedding = await prisma.embedding.upsert({
      where: { entityType_entityId: { entityType, entityId } },
      update: { vector: JSON.stringify(result.vector), model: result.model },
      create: { entityType, entityId, vector: JSON.stringify(result.vector), model: result.model, dimensions: result.dimensions }
    });
    eventBus.publish('spark.ai.embedding.generated.v1', { entityType, entityId }).catch(() => {});
    return embedding;
  }

  async getEmbedding(entityType, entityId) {
    return await prisma.embedding.findUnique({
      where: { entityType_entityId: { entityType, entityId } }
    });
  }

  cosineSimilarity(vecA, vecB) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] ** 2;
      normB += vecB[i] ** 2;
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const embeddingEngine = new EmbeddingEngine();
