import { monitoringPlatform } from './MonitoringPlatform.js';
import { analyticsPlatform } from './AnalyticsPlatform.js';
import { aiOperationsPlatform } from './AIOperationsPlatform.js';
import { incidentPlatform } from './IncidentPlatform.js';
import { auditPlatform } from './AuditPlatform.js';

class SparkOpsGateway {
  async getDashboard() {
    return analyticsPlatform.getSystemDashboard();
  }

  async getSystemHealth() {
    const [sys, db, redis, queues] = await Promise.all([
      monitoringPlatform.getSystemHealth(),
      monitoringPlatform.getDatabaseHealth(),
      monitoringPlatform.getRedisHealth(),
      monitoringPlatform.getQueueHealth()
    ]);
    return { system: sys, database: db, redis: redis, queues: queues };
  }

  async getAIStats() {
    return aiOperationsPlatform.getAIUsageSummary();
  }
  
  async getIncidents() {
    // import prisma locally to avoid circular deps if any
    const { default: prisma } = await import('../../config/prisma.js');
    return prisma.incident.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  }
}
export const sparkOpsGateway = new SparkOpsGateway();
