import { verifyToken } from '../utils/jwtHelper.js';
import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

/**
 * Protect routes — verifies JWT and attaches req.user
 */
export const protect = async (req, res, next) => {
  try {
    // 1. Extract token
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Access denied. No token provided.', 401));
    }

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Check user still exists
    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (!user) {
      return next(new AppError('User no longer exists.', 401));
    }

    // 4. Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated.', 403));
    }

    // 5. Check if password changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('Password recently changed. Please log in again.', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Restrict access to specific roles
 * @param {...string} roles - Allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};