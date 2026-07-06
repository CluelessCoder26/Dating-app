import prisma from '../../config/prisma.js';
import { getExcludedUserIds } from './exclusion.service.js';
import { processSwipe } from './swipe.service.js';
import { entitlementEngine } from '../growth/EntitlementEngine.js';
import { isLikeRating } from '../../utils/swipeRating.js';
import { socketManager } from '../../sockets/SocketManager.js';
import { calculateDistanceMiles } from '../../utils/distance.js';
import logger from '../../utils/logger.js';

const LIKE_RATINGS = ['LIKE', 'SUPER_LIKE'];

function buildProfilePreview(profile, { blurred, myProfile }) {
  if (!profile) return null;

  const primaryPhoto = profile.photos?.find((p) => p.isPrimary) || profile.photos?.[0];

  const base = {
    userId: profile.userId,
    name: blurred ? 'Someone' : profile.name,
    age: blurred ? null : profile.age,
    bio: blurred ? null : profile.bio,
    interests: blurred ? [] : profile.interests ?? [],
    photos: blurred || !primaryPhoto ? [] : [{ url: primaryPhoto.url, isPrimary: true }],
    blurred,
  };

  if (!blurred && myProfile?.latitude != null && profile.latitude != null) {
    base.distanceMiles = parseFloat(
      calculateDistanceMiles(
        myProfile.latitude,
        myProfile.longitude,
        profile.latitude,
        profile.longitude
      ).toFixed(2)
    );
  }

  return base;
}

export const likesReceivedService = {
  async getLikesReceived(userId, { page = 1, pageSize = 20 } = {}) {
    const skip = Math.max(0, (page - 1) * pageSize);
    const { blockedIds, matchedIds } = await getExcludedUserIds(userId);

    const mySwipes = await prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { targetId: true, rating: true },
    });
    const mySwipeMap = new Map(mySwipes.map((s) => [s.targetId, s.rating]));

    const excludeSwiperIds = new Set([...blockedIds, ...matchedIds, userId]);

    const incomingLikes = await prisma.swipe.findMany({
      where: {
        targetId: userId,
        rating: { in: LIKE_RATINGS },
        swiperId: { notIn: Array.from(excludeSwiperIds) },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pending = incomingLikes.filter((s) => !mySwipeMap.has(s.swiperId));
    const total = pending.length;
    const pageItems = pending.slice(skip, skip + pageSize);

    const canSeeProfiles = await entitlementEngine.canUserAccess(userId, 'see_who_liked_you');

    const myProfile = await prisma.profile.findUnique({
      where: { userId },
      include: { photos: { where: { isPrimary: true }, take: 1 } },
    });

    const likerIds = pageItems.map((s) => s.swiperId);
    const profiles = likerIds.length
      ? await prisma.profile.findMany({
          where: { userId: { in: likerIds } },
          include: {
            photos: { orderBy: [{ isPrimary: 'desc' }, { order: 'asc' }], take: 3 },
          },
        })
      : [];

    const profileMap = new Map(profiles.map((p) => [p.userId, p]));

    const likes = pageItems.map((swipe) => {
      const profile = profileMap.get(swipe.swiperId);
      const myRating = mySwipeMap.get(swipe.swiperId);
      const isMutualLike = myRating ? isLikeRating(myRating) : false;

      return {
        likerId: swipe.swiperId,
        likedAt: swipe.createdAt,
        isSuperLike: swipe.rating === 'SUPER_LIKE',
        isMutualLike,
        profile: buildProfilePreview(profile, { blurred: !canSeeProfiles, myProfile }),
      };
    });

    const empty = likes.length === 0;
    return {
      likes,
      pagination: {
        page,
        pageSize,
        hasMore: skip + pageSize < total,
        count: likes.length,
        total,
      },
      empty,
      canSeeProfiles,
      message: empty
        ? 'No one has liked you yet. Keep exploring — your spark is out there!'
        : undefined,
    };
  },

  async acceptLike(userId, likerId) {
    return processSwipe(userId, likerId, 'LIKE');
  },

  async rejectLike(userId, likerId) {
    return processSwipe(userId, likerId, 'PASS');
  },

  async buildIncomingLikePayload(likerId, recipientId) {
    const canSee = await entitlementEngine.canUserAccess(recipientId, 'see_who_liked_you');
    const profile = await prisma.profile.findUnique({
      where: { userId: likerId },
      include: { photos: { orderBy: [{ isPrimary: 'desc' }], take: 1 } },
    });
    const myProfile = await prisma.profile.findUnique({ where: { userId: recipientId } });

    const swipe = await prisma.swipe.findUnique({
      where: { swiperId_targetId: { swiperId: likerId, targetId: recipientId } },
    });

    return {
      likerId,
      likedAt: swipe?.createdAt ?? new Date().toISOString(),
      isSuperLike: swipe?.rating === 'SUPER_LIKE',
      isMutualLike: false,
      profile: buildProfilePreview(profile, { blurred: !canSee, myProfile }),
    };
  },

  async emitIncomingLike(recipientId, likerId) {
    try {
      const io = socketManager.getIO();
      if (!io) return;

      const payload = await this.buildIncomingLikePayload(likerId, recipientId);
      io.to(`user_${recipientId}`).emit('like_received', payload);
    } catch (err) {
      logger.warn(`Failed to emit like_received to ${recipientId}: ${err.message}`);
    }
  },
};
