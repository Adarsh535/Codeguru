/**
 * ============================================================================
 * API ROUTER: LEAD ROUTES (leadRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Student Lead Inquiries & CRM.
 */

import express from 'express';
import { getLeads, addLead, updateLeadStatus, deleteLead } from '../controllers/leadController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /api/leads
 * @desc   Retrieves all student inquiry lead records
 * @access Admin Private (Requires Master Admin JWT)
 */
router.get('/', requireAdmin, getLeads);

/**
 * @api    POST /api/leads
 * @desc   Submits a new student lead inquiry
 * @access Public / Inquiry Form
 */
router.post('/', addLead);

/**
 * @api    PUT /api/leads/:id
 * @desc   Updates lead status ('New' | 'Contacted' | 'In Progress' | 'Enrolled')
 * @access Admin Private (Requires Master Admin JWT)
 */
router.put('/:id', requireAdmin, updateLeadStatus);

/**
 * @api    DELETE /api/leads/:id
 * @desc   Deletes a lead record by ID
 * @access Admin Private (Requires Master Admin JWT)
 */
router.delete('/:id', requireAdmin, deleteLead);

export default router;
