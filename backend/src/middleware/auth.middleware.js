import { jwtService } from '../services/jwt.service.js';
import { AuthenticationError } from '../utils/errors.js';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return next(new AuthenticationError('Access token missing or malformed'));
  }

  try {
    const user = jwtService.verifyAccessToken(token);
    req.userId = user.userId;
    req.userRole = user.role;
    next();
  } catch (err) {
    next(err);
  }
}
