import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createPredictionValidator,
  listPredictionsValidator,
} from '../middleware/validators/prediction.validator.js';
import {
  createPrediction,
  getUserPredictions,
  getPredictionById,
  deletePrediction,
} from '../controllers/prediction.controller.js';

const router = Router();

// All prediction routes require authentication
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Predictions
 *   description: Vehicle breakdown predictions
 */

/**
 * @swagger
 * /api/predictions:
 *   post:
 *     summary: Create a new breakdown prediction
 *     tags: [Predictions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [engine_rpm, lub_oil_pressure, fuel_pressure, coolant_pressure, lub_oil_temp, coolant_temp]
 *             properties:
 *               engine_rpm: { type: number, example: 1200 }
 *               lub_oil_pressure: { type: number, example: 3.5 }
 *               fuel_pressure: { type: number, example: 2.8 }
 *               coolant_pressure: { type: number, example: 1.2 }
 *               lub_oil_temp: { type: number, example: 75 }
 *               coolant_temp: { type: number, example: 88 }
 *               notes: { type: string, example: "Routine check" }
 *     responses:
 *       201:
 *         description: Prediction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prediction'
 *       422:
 *         description: Validation error
 *       503:
 *         description: ML service unavailable
 */
router.post('/', validate(createPredictionValidator), createPrediction);

/**
 * @swagger
 * /api/predictions:
 *   get:
 *     summary: Get authenticated user's predictions
 *     tags: [Predictions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Normal, Warning, Critical, Failure] }
 *       - in: query
 *         name: minProbability
 *         schema: { type: number }
 *       - in: query
 *         name: maxProbability
 *         schema: { type: number }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [createdAt, failure_probability, engine_rpm, status] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated predictions list
 */
router.get('/', validate(listPredictionsValidator), getUserPredictions);

/**
 * @swagger
 * /api/predictions/{id}:
 *   get:
 *     summary: Get a prediction by ID
 *     tags: [Predictions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Prediction details
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Prediction not found
 */
router.get('/:id', getPredictionById);

/**
 * @swagger
 * /api/predictions/{id}:
 *   delete:
 *     summary: Delete a prediction
 *     tags: [Predictions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Prediction deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Prediction not found
 */
router.delete('/:id', deletePrediction);

export default router;