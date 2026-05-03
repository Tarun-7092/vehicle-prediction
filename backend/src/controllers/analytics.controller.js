import Prediction from '../models/Prediction.model.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

// ─── Dashboard Analytics ──────────────────────────────────────────────────────

export const getDashboard = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const matchStage = isAdmin ? {} : { user: new mongoose.Types.ObjectId(req.user._id) };

    const [summary, statusBreakdown, monthlyStats, recentPredictions] = await Promise.all([
      // Total counts + avg probability
      Prediction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            failures: {
              $sum: { $cond: [{ $ne: ['$status', 'Normal'] }, 1, 0] },
            },
            normal: {
              $sum: { $cond: [{ $eq: ['$status', 'Normal'] }, 1, 0] },
            },
            avgFailureProbability: { $avg: '$failure_probability' },
          },
        },
      ]),

      // Status breakdown
      Prediction.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Monthly stats (last 12 months)
      Prediction.aggregate([
        {
          $match: {
            ...matchStage,
            createdAt: {
              $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            total: { $sum: 1 },
            failures: {
              $sum: { $cond: [{ $ne: ['$status', 'Normal'] }, 1, 0] },
            },
            avgProbability: { $avg: '$failure_probability' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            _id: 0,
            year: '$_id.year',
            month: '$_id.month',
            total: 1,
            failures: 1,
            avgProbability: { $round: ['$avgProbability', 4] },
          },
        },
      ]),

      // Recent 5 predictions
      Prediction.find(matchStage)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .lean(),
    ]);

    const stats = summary[0] || { total: 0, failures: 0, normal: 0, avgFailureProbability: 0 };

    return sendSuccess(res, {
      data: {
        summary: {
          total: stats.total,
          failures: stats.failures,
          normal: stats.normal,
          avgFailureProbability: parseFloat((stats.avgFailureProbability || 0).toFixed(4)),
          failureRate: stats.total > 0 ? parseFloat((stats.failures / stats.total).toFixed(4)) : 0,
        },
        statusBreakdown: statusBreakdown.reduce((acc, { _id, count }) => {
          acc[_id] = count;
          return acc;
        }, {}),
        monthlyStats,
        recentPredictions,
      },
    });
  } catch (err) {
    next(err);
  }
};