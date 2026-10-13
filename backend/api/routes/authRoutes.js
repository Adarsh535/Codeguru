/**
 * ============================================================================
 * API ROUTER: AUTHENTICATION ROUTES (authRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Master Admin and Student authentication.
 * Hardened with rate limiting, RBAC, and secure token management.
 */

import express from 'express';
import { 
  loginAdmin, 
  updateCredentials, 
  registerStudent, 
  loginStudent,
  sendStudentOtp,
  verifyStudentOtp,
  updateStudentProfile,
  logoutUser
} from '../controllers/authController.js';
import { requireAdmin, requireAuth } from '../../middleware/authMiddleware.js';
import { authLimiter, otpLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @api    POST /api/auth/login
 * @desc   Authenticates master admin user against MongoDB admins collection
 * @access Public (Protected with brute-force limiter)
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
 * @access Public (Protected with brute-force limiter)
 */
router.post('/student/register', authLimiter, registerStudent);

/**
 * @api    POST /api/auth/student/login
 * @desc   Authenticates student user
 * @access Public (Protected with brute-force limiter)
 */
router.post('/student/login', authLimiter, loginStudent);

/**
 * @api    POST /api/auth/student/send-otp
 * @desc   Sends 6-digit verification OTP to student phone
 * @access Public (Strict SMS rate limit)
 */
router.post('/student/send-otp', otpLimiter, sendStudentOtp);

/**
 * @api    POST /api/auth/student/verify-otp
 * @desc   Verifies OTP code and logs in/registers student
 * @access Public (Protected with rate limiter)
 */
router.post('/student/verify-otp', authLimiter, verifyStudentOtp);

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
