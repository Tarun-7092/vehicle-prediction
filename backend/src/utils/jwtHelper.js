import jwt from 'jsonwebtoken';
import AppError from './AppError.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
    issuer: 'vehicle-prediction-api',
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    issuer: 'vehicle-prediction-api',
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'vehicle-prediction-api',
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token has expired. Please log in again.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again.', 401);
    }
    throw new AppError('Authentication failed.', 401);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'vehicle-prediction-api',
    });
  } catch {
    throw new AppError('Invalid refresh token. Please log in again.', 401);
  }
};