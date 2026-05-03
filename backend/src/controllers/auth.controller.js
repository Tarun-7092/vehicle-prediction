import User from '../models/User.model.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtHelper.js';
import { sendSuccess, sendError } from '../utils/ApiResponse.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return next(new AppError('An account with this email already exists.', 409));
    }

    const user = await User.create({ name, email, password, role: 'user' });

    const token = generateToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.cookie('refreshToken', refreshToken, cookieOptions);

    logger.info(`New user registered: ${user.email}`);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Account created successfully.',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password.', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated. Contact support.', 403));
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.cookie('refreshToken', refreshToken, cookieOptions);

    logger.info(`User logged in: ${user.email}`);

    return sendSuccess(res, {
      message: 'Logged in successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return next(new AppError('Refresh token is required.', 401));

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError('User not found or inactive.', 401));
    }

    const newToken = generateToken({ id: user._id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    return sendSuccess(res, { data: { token: newToken } });
  } catch (err) {
    next(err);
  }
};

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, { data: { user } });
  } catch (err) {
    next(err);
  }
};

// ─── Update Password ──────────────────────────────────────────────────────────

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect.', 401));
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(res, {
      message: 'Password updated successfully.',
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = (req, res) => {
  res.clearCookie('refreshToken');
  return sendSuccess(res, { message: 'Logged out successfully.' });
};