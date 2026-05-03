import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  registerValidator,
  loginValidator,
  updatePasswordValidator,
} from '../middleware/validators/auth.validator.js';
import {
  register,
  login,
  refreshToken,
  getMe,
  updatePassword,
  logout,
} from '../controllers/auth.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & account management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Jane Doe" }
 *               email: { type: string, format: email, example: "jane@example.com" }
 *               password: { type: string, minLength: 8, example: "SecurePass1" }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation error
 */
router.post('/register', validate(registerValidator), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginValidator), login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: New access token issued
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/auth/update-password:
 *   patch:
 *     summary: Update current user password
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: Password updated
 */
router.patch('/update-password', protect, validate(updatePasswordValidator), updatePassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', protect, logout);

export default router;