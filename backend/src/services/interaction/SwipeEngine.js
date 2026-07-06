import { processSwipe } from './swipe.service.js';

class SwipeEngine {
  async processSwipe(actorId, targetId, action) {
    return processSwipe(actorId, targetId, action);
  }
}

export const swipeEngine = new SwipeEngine();
