import prisma from '../../config/prisma.js';

class AIOperationsPlatform {
  async getAIUsageSummary() {
    const requests = await prisma.aIRequest.count();
    const aggregate = await prisma.aIRequest.aggregate({
      _sum: { promptTokens: true, responseTokens: true, costUsd: true },
      _avg: { latencyMs: true }
    });
    return { totalRequests: requests, metrics: aggregate };
  }
}
export const aiOperationsPlatform = new AIOperationsPlatform();
