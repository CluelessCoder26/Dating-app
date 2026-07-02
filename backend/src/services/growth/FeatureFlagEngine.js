import prisma from '../../config/prisma.js';
import redisManager from '../../config/redis.js';

class FeatureFlagEngine {
  async isEnabled(key, userId = null) {
    let flag = null;
    const cached = await redisManager.get(`fflag:${key}`);
    if (cached) {
      if (cached) flag = JSON.parse(cached);
    }
    
    if (!flag) {
      flag = await prisma.featureFlag.findUnique({ where: { key } });
      if (flag && redisManager) {
        await redisManager.setEx(`fflag:${key}`, 300, JSON.stringify(flag));
      }
    }

    if (!flag) return false;
    if (!flag.enabled) return false;

    if (flag.rules) {
      try {
        const rules = JSON.parse(flag.rules);
        if (rules.percentage && userId) {
          // Stable deterministic bucket based on user ID
          const hash = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
          if ((hash % 100) >= rules.percentage) return false;
        }
      } catch (e) {
        // ignore parse error
      }
    }

    return true;
  }
}

export const featureFlagEngine = new FeatureFlagEngine();
