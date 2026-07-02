import { aiGateway } from './AIGateway.js';
import logger from '../../utils/logger.js';

class TaskPlanner {
  plan(workflowDef, context) {
    // Basic linear or DAG planner. For now, we assume steps are defined sequentially.
    // In a full implementation, this would resolve dependencies (e.g. step 4 needs step 1 and 2).
    const steps = workflowDef.steps || [];
    return steps.map(step => ({
      id: step.id,
      name: step.name,
      promptTemplate: step.promptTemplate,
      dependencies: step.dependencies || [],
      contextKeys: step.contextKeys || []
    }));
  }
}

export const taskPlanner = new TaskPlanner();
