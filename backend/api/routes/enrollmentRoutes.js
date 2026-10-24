/**
 * ============================================================================
 * API ROUTER: ENROLLMENT ROUTES (enrollmentRoutes.js)
 * ============================================================================
 * REST API routes for student course enrollment & payment processing.
 * Hardened with student ownership check and Master Admin RBAC.
 */

import express from 'express';
import {
  getEnrollments,
  createEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment
} from '../controllers/enrollmentController.js';
import { requireAuth, requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/enrollments
 * Retrieve enrollments (Admin gets all, Student gets only own records)
 */
router.get('/', requireAuth, getEnrollments);

/**
 * POST /api/enrollments
 * Create new enrollment & record payment
 */
router.post('/', requireAuth, createEnrollment);

/**
 * PUT /api/enrollments/:id
 * Update enrollment / fee status (Admin only)
 */
router.put('/:id', requireAdmin, updateEnrollmentStatus);

/**
 * DELETE /api/enrollments/:id
 * Delete enrollment record (Admin only)
 */
router.delete('/:id', requireAdmin, deleteEnrollment);

export default router;
