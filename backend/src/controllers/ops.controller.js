import { sparkOpsGateway } from '../services/ops/SparkOpsGateway.js';
import { incidentPlatform } from '../services/ops/IncidentPlatform.js';

export const opsController = {
  async getDashboard(req, res) {
    const data = await sparkOpsGateway.getDashboard();
    res.json(data);
  },
  async getSystem(req, res) {
    const health = await sparkOpsGateway.getSystemHealth();
    res.json(health);
  },
  async getAI(req, res) {
    const stats = await sparkOpsGateway.getAIStats();
    res.json(stats);
  },
  async getIncidents(req, res) {
    const incidents = await sparkOpsGateway.getIncidents();
    res.json(incidents);
  },
  async createIncident(req, res) {
    const incident = await incidentPlatform.createIncident(req.body, req.userId);
    res.status(201).json(incident);
  }
};
