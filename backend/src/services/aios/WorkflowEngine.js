import { taskPlanner } from './TaskPlanner.js';
import { aiGateway } from './AIGateway.js';
import logger from '../../utils/logger.js';

class WorkflowEngine {
  constructor() {
    this.workflows = new Map();
  }

  registerWorkflow(id, definition) {
    this.workflows.set(id, definition);
  }

  async execute(userId, workflowId, initialContext = {}) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    logger.info(`[WorkflowEngine] Starting workflow ${workflowId} for user ${userId}`);
    
    const plan = taskPlanner.plan(workflow, initialContext);
    const executionState = { ...initialContext };
    const results = {};

    for (const step of plan) {
      logger.info(`[WorkflowEngine] Executing step: ${step.name}`);
      
      // Inject required context into variables
      const variables = { ...executionState };
      
      // Render prompt and execute via Gateway
      // We bypass the gateway's direct renderAndComplete to do it step by step
      // or we can use gateway.renderAndComplete
      
      const response = await aiGateway.renderAndComplete(
        userId, 
        `WORKFLOW_${workflowId}_${step.id}`,
        step.promptTemplate,
        variables
      );
      
      // Store result
      results[step.id] = response.content;
      executionState[step.id] = response.content; // Next steps can use {{stepId}}
    }

    logger.info(`[WorkflowEngine] Workflow ${workflowId} completed`);
    return {
      workflowId,
      results,
      finalState: executionState
    };
  }
}

export const workflowEngine = new WorkflowEngine();
