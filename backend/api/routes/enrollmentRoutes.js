/**
 * ============================================================================
 * API ROUTER: ENROLLMENT ROUTES (enrollmentRoutes.js)
 * ============================================================================
 * REST API routes for student course enrollment & payment processing.
 */

import express from 'express';
import {
  getEnrollments,
  createEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment
} from '../controllers/enrollmentController.js';

const router = express.Router();

/**
 * GET /api/enrollments
 * Retrieve all enrollments
 */
router.get('/', getEnrollments);

/**
 * POST /api/enrollments
 * Create new enrollment & record payment
 */
router.post('/', createEnrollment);

/**
 * PUT /api/enrollments/:id
 * Update enrollment / fee status
 */
router.put('/:id', updateEnrollmentStatus);

/**
 * DELETE /api/enrollments/:id
 * Delete enrollment record
 */
router.delete('/:id', deleteEnrollment);

export default router;
