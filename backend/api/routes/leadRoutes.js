/**
 * ============================================================================
 * API ROUTER: LEAD ROUTES (leadRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Student Lead Inquiries & CRM.
 */

import express from 'express';
import { getLeads, addLead, updateLeadStatus, deleteLead, updateLeadDetails } from '../controllers/leadController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';
import { leadLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @api    GET /api/leads
 * @desc   Retrieves student inquiry lead records
 * @access Admin Private (Requires Admin / Counselor JWT)
 */
router.get('/', requireAdmin, getLeads);

/**
 * @api    POST /api/leads
 * @desc   Submits a new student lead inquiry (rate limited: 5 per hour per IP)
 * @access Public / Inquiry Form
 */
router.post('/', leadLimiter, addLead);

/**
 * @api    POST /api/leads/update-details
 * @desc   Updates existing lead with student's Name and Email (Step 2 completion)
 * @access Public / Step 2
 */
router.post('/update-details', leadLimiter, updateLeadDetails);

/**
 * @api    PUT /api/leads/:id
 * @desc   Updates lead status ('New' | 'Contacted' | 'In Progress' | 'Enrolled')
 * @access Admin Private (Requires Admin / Counselor JWT)
 */
router.put('/:id', requireAdmin, updateLeadStatus);

/**
 * @api    DELETE /api/leads/:id
 * @desc   Deletes a lead record by ID
 * @access Admin Private (Requires Admin / Counselor JWT)
 */
router.delete('/:id', requireAdmin, deleteLead);

export default router;
