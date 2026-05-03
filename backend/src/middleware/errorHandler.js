import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

// ─── Error Transformers ───────────────────────────────────────────────────────

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`${field} '${value}' already exists.`, 409);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join('. ')}`, 400);
};

// ─── Dev vs Prod Response ─────────────────────────────────────────────────────

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    // Don't leak error details in production
    logger.error('UNHANDLED ERROR', err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ─── Main Error Handler ───────────────────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  logger.error(`[${req.method}] ${req.path} — ${err.message}`, {
    statusCode: err.statusCode,
    user: req.user?._id,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (process.env.NODE_ENV === 'development') {
    return sendDevError(err, res);
  }

  // Transform known Mongoose errors
  let error = err;
  if (err instanceof mongoose.Error.CastError) error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationError(err);

  sendProdError(error, res);
};

export default errorHandler;