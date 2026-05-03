import { body, query, param } from 'express-validator';

export const createPredictionValidator = [
  body('engine_rpm')
    .notEmpty().withMessage('Engine RPM is required')
    .isFloat({ min: 0, max: 10000 }).withMessage('Engine RPM must be a number between 0 and 10000'),

  body('lub_oil_pressure')
    .notEmpty().withMessage('Lub oil pressure is required')
    .isFloat({ min: 0 }).withMessage('Lub oil pressure must be a non-negative number'),

  body('fuel_pressure')
    .notEmpty().withMessage('Fuel pressure is required')
    .isFloat({ min: 0 }).withMessage('Fuel pressure must be a non-negative number'),

  body('coolant_pressure')
    .notEmpty().withMessage('Coolant pressure is required')
    .isFloat({ min: 0 }).withMessage('Coolant pressure must be a non-negative number'),

  body('lub_oil_temp')
    .notEmpty().withMessage('Lub oil temperature is required')
    .isFloat().withMessage('Lub oil temperature must be a number'),

  body('coolant_temp')
    .notEmpty().withMessage('Coolant temperature is required')
    .isFloat().withMessage('Coolant temperature must be a number'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
];

export const listPredictionsValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
  query('status')
    .optional()
    .isIn(['Normal', 'Warning', 'Critical', 'Failure'])
    .withMessage('Status must be Normal, Warning, Critical, or Failure'),
  query('minProbability').optional().isFloat({ min: 0, max: 1 }).withMessage('Min probability must be 0–1'),
  query('maxProbability').optional().isFloat({ min: 0, max: 1 }).withMessage('Max probability must be 0–1'),
  query('from').optional().isISO8601().withMessage('from must be a valid ISO 8601 date'),
  query('to').optional().isISO8601().withMessage('to must be a valid ISO 8601 date'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'failure_probability', 'engine_rpm', 'status'])
    .withMessage('Invalid sortBy field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be asc or desc'),
];