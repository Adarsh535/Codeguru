/**
 * ============================================================================
 * API ROUTER: AUTHENTICATION ROUTES (authRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Master Admin authentication & security credentials.
 */

import express from 'express';
import { loginAdmin, updateCredentials, registerStudent, loginStudent } from '../controllers/authController.js';

const router = express.Router();

/**
 * @api    POST /api/auth/login
 * @desc   Authenticates master admin user against MongoDB admins collection
 * @access Public
 */
router.post('/login', loginAdmin);

/**
 * @api    POST /api/auth/update-credentials
 * @desc   Updates master admin email address or password
 * @access Admin Private
 */
router.post('/update-credentials', updateCredentials);

/**
 * @api    POST /api/auth/student/register
 * @desc   Registers a new student account into MongoDB students collection
 * @access Public
 */
router.post('/student/register', registerStudent);

/**
 * @api    POST /api/auth/student/login
 * @desc   Authenticates student user against MongoDB students collection
 * @access Public
 */
router.post('/student/login', loginStudent);

export default router;
