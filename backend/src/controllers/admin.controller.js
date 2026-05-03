import User from '../models/User.model.js';
import Prediction from '../models/Prediction.model.js';
import { sendSuccess, sendPaginated } from '../utils/ApiResponse.js';
import AppError from '../utils/AppError.js';
import { checkMLHealth } from '../services/ml.service.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// ─── Get All Users ────────────────────────────────────────────────────────────

export const getAllUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return sendPaginated(res, { data: users, total, page, limit });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Predictions ──────────────────────────────────────────────────────

export const getAllPredictions = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.userId) {
      if (!mongoose.Types.ObjectId.isValid(req.query.userId)) {
        return next(new AppError('Invalid user ID.', 400));
      }
      filter.user = new mongoose.Types.ObjectId(req.query.userId);
    }

    const [predictions, total] = await Promise.all([
      Prediction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email role')
        .lean(),
      Prediction.countDocuments(filter),
    ]);

    return sendPaginated(res, { data: predictions, total, page, limit });
  } catch (err) {
    next(err);
  }
};

// ─── Delete User ──────────────────────────────────────────────────────────────

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid user ID.', 400));
    }

    if (id === req.user._id.toString()) {
      return next(new AppError('You cannot delete your own account via admin API.', 400));
    }

    const user = await User.findById(id);
    if (!user) return next(new AppError('User not found.', 404));

    // Soft delete (deactivate) instead of hard delete
    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    logger.info(`Admin ${req.user._id} deactivated user ${id}`);

    return sendSuccess(res, { message: `User ${user.email} has been deactivated.` });
  } catch (err) {
    next(err);
  }
};

// ─── System Stats ─────────────────────────────────────────────────────────────

export const getSystemStats = async (req, res, next) => {
  try {
    const [userStats, predictionStats, mlHealth] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
            users: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } },
          },
        },
      ]),

      Prediction.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgProbability: { $avg: '$failure_probability' },
            failures: { $sum: { $cond: [{ $ne: ['$status', 'Normal'] }, 1, 0] } },
          },
        },
      ]),

      checkMLHealth(),
    ]);

    return sendSuccess(res, {
      data: {
        users: userStats[0] || { total: 0, active: 0, admins: 0, users: 0 },
        predictions: {
          ...(predictionStats[0] || { total: 0, avgProbability: 0, failures: 0 }),
          avgProbability: parseFloat((predictionStats[0]?.avgProbability || 0).toFixed(4)),
        },
        mlService: mlHealth,
        server: {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV,
          uptime: Math.floor(process.uptime()),
          memoryUsage: process.memoryUsage(),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};