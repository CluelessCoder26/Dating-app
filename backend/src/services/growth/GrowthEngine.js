import prisma from '../../config/prisma.js';
import { rewardEngine } from './RewardEngine.js';
import { eventBus } from '../../events/eventBus.js';

class GrowthEngine {
  async triggerProfileCompletionEvent(userId) {
    const achievementKey = 'profile_completed';
    const existing = await prisma.achievementProgress.findFirst({
      where: { userId, achievement: { key: achievementKey } }
    });
    
    if (existing && existing.progress === 100) return;

    let achievement = await prisma.achievement.findUnique({ where: { key: achievementKey } });
    if (!achievement) {
      achievement = await prisma.achievement.create({
        data: { key: achievementKey, name: 'Profile Complete', description: 'Finish onboarding', criteria: '{}' }
      });
    }

    const progress = await prisma.achievementProgress.upsert({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
      update: { progress: 100, completedAt: new Date() },
      create: { userId, achievementId: achievement.id, progress: 100, completedAt: new Date() }
    });

    if (progress.progress === 100) {
      // Automate behavioral reward
      await rewardEngine.grantReward(userId, 'COINS', 100);
      eventBus.publish('spark.achievement.unlocked.v1', { userId, achievementId: achievement.id }).catch(() => {});
    }
  }

  async getAchievements(userId) {
    return await prisma.achievementProgress.findMany({
      where: { userId },
      include: { achievement: true }
    });
  }
}

export const growthEngine = new GrowthEngine();
