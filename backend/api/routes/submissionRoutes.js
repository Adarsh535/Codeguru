/**
 * ============================================================================
 * API ROUTER: SUBMISSION ROUTES (submissionRoutes.js)
 * ============================================================================
 * Student assignment and code submissions endpoints protected against IDOR.
 */

import express from 'express';
import { getSubmissionById, createSubmission } from '../controllers/submissionController.js';
import { requireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /api/submissions/:id
 * @desc   Retrieves student code submission (IDOR guarded: caller can only fetch own data or must be admin)
 * @access Authenticated User
 */
router.get('/:id', requireAuth, getSubmissionById);

/**
 * @api    POST /api/submissions
 * @desc   Creates code submission tied to authenticated student
 * @access Authenticated User
 */
router.post('/', requireAuth, createSubmission);

export default router;
