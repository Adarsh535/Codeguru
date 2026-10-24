/**
 * ============================================================================
 * API ROUTER: ADMIN ROUTES (adminRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for administrative management under `/admin/*` and `/api/admin/*`.
 * Every route is protected by `requireAdmin` (or requires Master Admin / Admin credentials).
 */

import express from 'express';
import {
  getAdminDashboardStats,
  getAdminUsers,
  deleteUser,
  updateUserRole,
  getAuditLogs
} from '../controllers/adminController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { requireRole } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /admin/dashboard
 * @desc    Metrics and statistics
 */
router.get('/dashboard', getAdminDashboardStats);

/**
 * @api    GET /admin/users
 * @desc    List all system users
 */
router.get('/users', getAdminUsers);

/**
 * @api    DELETE /admin/users/:id
 * @desc    Delete user account with audit trail (Master Admin only)
 */
router.delete('/users/:id', requireRole('Master Admin'), deleteUser);

/**
 * @api    PUT /admin/users/:id/role
 * @desc    Change user role with audit trail (Master Admin only — prevents privilege escalation)
 */
router.put('/users/:id/role', requireRole('Master Admin'), updateUserRole);

/**
 * @api    GET /admin/audit-logs
 * @desc    Retrieve immutable audit logs stream
 */
router.get('/audit-logs', getAuditLogs);

/**
 * @api    GET /admin/settings
 * @api    PUT /admin/settings
 */
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

/**
 * @api    GET/POST/PUT/DELETE /admin/courses
 */
router.get('/courses', getCourses);
router.post('/courses', addCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

/**
 * Catch-all: unknown /admin/* subroutes must 404 (never fake a 200 success).
 */
router.all('/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Admin endpoint not found',
    path: req.originalUrl || req.path
  });
});

export default router;
