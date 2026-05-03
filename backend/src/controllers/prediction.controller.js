import Prediction from "../models/Prediction.model.js";
import { getPrediction } from "../services/ml.service.js";
import { sendSuccess, sendError, sendPaginated } from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import mongoose from "mongoose";

// ─── Create Prediction ────────────────────────────────────────────────────────

export const createPrediction = async (req, res, next) => {
  try {
    const sensorData = {
      engine_rpm: req.body.engine_rpm,
      lub_oil_pressure: req.body.lub_oil_pressure,
      fuel_pressure: req.body.fuel_pressure,
      coolant_pressure: req.body.coolant_pressure,
      lub_oil_temp: req.body.lub_oil_temp,
      coolant_temp: req.body.coolant_temp,
    };

    // Call ML service
    const mlResult = await getPrediction(sensorData);

    // Normalize ML status
    const probability = mlResult.failure_probability;

    let normalizedStatus = "Normal";

    if (probability >= 0.8) {
      normalizedStatus = "Failure";
    } else if (probability >= 0.6) {
      normalizedStatus = "Critical";
    } else if (probability >= 0.3) {
      normalizedStatus = "Warning";
    }

    // Save prediction
    const prediction = await Prediction.create({
      user: req.user._id,
      ...sensorData,
      prediction: mlResult.prediction,
      failure_probability: mlResult.failure_probability,
      status: normalizedStatus,
      notes: req.body.notes,
    });

    logger.info(
      `Prediction created for user ${req.user._id}: status=${normalizedStatus}`,
    );

    return sendSuccess(res, {
      statusCode: 201,
      message: "Prediction generated successfully.",
      data: { prediction },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get User Predictions (with pagination, filter, sort) ─────────────────────

export const getUserPredictions = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user._id };

    if (req.query.status) filter.status = req.query.status;

    if (req.query.minProbability || req.query.maxProbability) {
      filter.failure_probability = {};
      if (req.query.minProbability)
        filter.failure_probability.$gte = parseFloat(req.query.minProbability);
      if (req.query.maxProbability)
        filter.failure_probability.$lte = parseFloat(req.query.maxProbability);
    }

    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    // Build sort
    const allowedSorts = [
      "createdAt",
      "failure_probability",
      "engine_rpm",
      "status",
    ];
    const sortField = allowedSorts.includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";
    const sortDir = req.query.sortOrder === "asc" ? 1 : -1;
    const sort = { [sortField]: sortDir };

    const [predictions, total] = await Promise.all([
      Prediction.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Prediction.countDocuments(filter),
    ]);

    return sendPaginated(res, { data: predictions, total, page, limit });
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Prediction ────────────────────────────────────────────────────

export const getPredictionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid prediction ID.", 400));
    }

    const prediction = await Prediction.findById(id).populate(
      "user",
      "name email",
    );

    if (!prediction) {
      return next(new AppError("Prediction not found.", 404));
    }

    // Users can only access their own predictions; admins can access all
    if (
      req.user.role !== "admin" &&
      prediction.user._id.toString() !== req.user._id.toString()
    ) {
      return next(
        new AppError(
          "You do not have permission to view this prediction.",
          403,
        ),
      );
    }

    return sendSuccess(res, { data: { prediction } });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Prediction ────────────────────────────────────────────────────────

export const deletePrediction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid prediction ID.", 400));
    }

    const prediction = await Prediction.findById(id);

    if (!prediction) {
      return next(new AppError("Prediction not found.", 404));
    }

    // Only owner or admin can delete
    if (
      req.user.role !== "admin" &&
      prediction.user.toString() !== req.user._id.toString()
    ) {
      return next(
        new AppError(
          "You do not have permission to delete this prediction.",
          403,
        ),
      );
    }

    await prediction.deleteOne();

    logger.info(`Prediction ${id} deleted by user ${req.user._id}`);

    return sendSuccess(res, { message: "Prediction deleted successfully." });
  } catch (err) {
    next(err);
  }
};
