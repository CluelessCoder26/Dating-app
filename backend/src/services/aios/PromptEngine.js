import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';

class PromptEngine {
  async getTemplate(key) {
    const cached = await redisManager.get(`prompt:${key}`);
    if (cached) {
      if (cached) return JSON.parse(cached);
    }
    const template = await prisma.promptTemplate.findUnique({
      where: { key },
      include: { versions: { where: { active: true }, take: 1 } }
    });
    if (template && redisManager) {
      await redisManager.setEx(`prompt:${key}`, 1800, JSON.stringify(template));
    }
    return template;
  }

  async render(key, variables = {}) {
    const template = await this.getTemplate(key);
    if (!template) return this._interpolate(key, variables);
    const content = template.versions?.[0]?.content || template.template;
    return this._interpolate(content, variables);
  }

  _interpolate(template, variables) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
      return variables[varName] !== undefined ? String(variables[varName]) : `{{${varName}}}`;
    });
  }
}

export const promptEngine = new PromptEngine();
