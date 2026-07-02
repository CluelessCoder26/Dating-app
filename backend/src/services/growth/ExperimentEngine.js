import prisma from '../../config/prisma.js';
import { eventBus } from '../../events/eventBus.js';

class ExperimentEngine {
  async getVariant(userId, experimentKey) {
    const experiment = await prisma.experiment.findUnique({ 
      where: { key: experimentKey },
      include: { variants: true }
    });
    
    if (!experiment || experiment.status !== 'RUNNING' || experiment.variants.length === 0) {
      return null;
    }

    // Deterministic assignment
    const hash = Array.from(userId + experimentKey).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
    let bucket = hash % totalWeight;

    for (const variant of experiment.variants) {
      if (bucket < variant.weight) {
        eventBus.publish('spark.experiment.assigned.v1', { userId, experimentKey, variantKey: variant.key }).catch(() => {});
        return variant.key;
      }
      bucket -= variant.weight;
    }
    
    return null;
  }
}

export const experimentEngine = new ExperimentEngine();
