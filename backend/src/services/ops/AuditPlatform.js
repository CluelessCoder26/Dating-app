import prisma from '../../config/prisma.js';

class AuditPlatform {
  async logAction(adminId, action, entityType, entityId, oldValue, newValue, reason, ipAddress) {
    return prisma.opsAudit.create({
      data: {
        adminId, action, entityType, entityId,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
        reason, ipAddress
      }
    });
  }

  async getAuditLogs(filters = {}, limit = 50) {
    return prisma.opsAudit.findMany({ where: filters, orderBy: { createdAt: 'desc' }, take: limit });
  }
}
export const auditPlatform = new AuditPlatform();
