import { validationResult } from 'express-validator';
import { sendError } from '../utils/ApiResponse.js';

/**
 * Run validation chains and short-circuit on failure
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel
    await Promise.all(validations.map((v) => v.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const errors = result.array().map(({ path, msg, value }) => ({
      field: path,
      message: msg,
      received: value,
    }));

    return sendError(res, {
      message: 'Validation failed',
      statusCode: 422,
      errors,
    });
  };
};