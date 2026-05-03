import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getDashboard } from '../controllers/analytics.controller.js';

const router = Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Dashboard & reporting
 */

/**
 * @swagger
 * /api/analytics/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     description: Returns prediction summary, status breakdown, monthly stats, and recent predictions. Admins see all data; users see only their own.
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     failures: { type: integer }
 *                     normal: { type: integer }
 *                     avgFailureProbability: { type: number }
 *                     failureRate: { type: number }
 *                 statusBreakdown: { type: object }
 *                 monthlyStats: { type: array, items: { type: object } }
 *                 recentPredictions: { type: array }
 */
router.get('/dashboard', getDashboard);

export default router;