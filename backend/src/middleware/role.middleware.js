import { AuthorizationError } from '../utils/errors.js';
import prisma from '../config/prisma.js';

export const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true }
      });

      if (!user) {
        throw new AuthorizationError('User not found');
      }

      if (!roles.includes(user.role)) {
        throw new AuthorizationError('Access denied: Insufficient privileges');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
