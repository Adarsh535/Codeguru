/**
 * ============================================================================
 * API ROUTER: AUTHENTICATION ROUTES (authRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Master Admin and Student authentication.
 * Hardened with RBAC, secure cryptographic token management, and cookies.
 */

import express from 'express';
import { 
  loginAdmin, 
  updateCredentials, 
  registerStudent, 
  loginStudent,
  phoneLoginStudent,
  updateStudentProfile,
  logoutUser,
  getCsrfToken
} from '../controllers/authController.js';
import { requireAdmin, requireAuth } from '../../middleware/authMiddleware.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @api    GET /api/auth/csrf-token
 * @desc    Provides anti-CSRF token
 * @access Public
 */
router.get('/csrf-token', getCsrfToken);

/**
 * @api    POST /api/auth/login
 * @desc   Authenticates master admin user against MongoDB admins collection
 * @access Public (Rate limited: 5/15min)
 */
router.post('/login', authLimiter, loginAdmin);

/**
 * @api    POST /api/auth/update-credentials
 * @desc   Updates master admin email address or password
 * @access Admin Private (Strict Master Admin JWT required)
 */
router.post('/update-credentials', requireAdmin, updateCredentials);

/**
 * @api    POST /api/auth/student/register
 * @desc   Registers a new student account
 * @access Public
 */
router.post('/student/register', registerStudent);

/**
 * @api    POST /api/auth/student/login
 * @desc   Authenticates student user via email and password
 * @access Public
 */
router.post('/student/login', loginStudent);

/**
 * @api    POST /api/auth/student/phone-login
 * @desc   Saves student inquiry lead (zero JWT, zero cookie, zero session)
 * @access Public
 */
router.post('/student/phone-login', phoneLoginStudent);

/**
 * @api    POST /api/auth/student/update-profile
 * @desc   Updates student name and email
 * @access Authenticated Student
 */
router.post('/student/update-profile', requireAuth, updateStudentProfile);

/**
 * @api    POST /api/auth/logout
 * @desc   Clears authentication cookies and logs user out
 * @access Public
 */
router.post('/logout', logoutUser);

export default router;
