import prisma from '../../config/prisma.js';
import { auditPlatform } from './AuditPlatform.js';

class IncidentPlatform {
  async createIncident(data, adminId) {
    const incident = await prisma.incident.create({ data });
    await auditPlatform.logAction(adminId, 'CREATE_INCIDENT', 'Incident', incident.id, null, incident, data.title);
    return incident;
  }
  
  async updateIncident(id, data, adminId) {
    const incident = await prisma.incident.update({ where: { id }, data });
    await auditPlatform.logAction(adminId, 'UPDATE_INCIDENT', 'Incident', id, null, incident, 'Update');
    return incident;
  }
}
export const incidentPlatform = new IncidentPlatform();
