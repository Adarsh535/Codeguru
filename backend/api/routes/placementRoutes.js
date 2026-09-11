/**
 * ============================================================================
 * API ROUTER: PLACEMENT ROUTES (placementRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Student Placement Drive Records.
 */

import express from 'express';
import { getPlacements, addPlacement, deletePlacement } from '../controllers/placementController.js';

const router = express.Router();

/**
 * @api    GET /api/placements
 * @desc   Retrieves all placed student drive records
 * @access Public
 */
router.get('/', getPlacements);

/**
 * @api    POST /api/placements
 * @desc   Creates a new student placement record
 * @access Admin Private
 */
router.post('/', addPlacement);

/**
 * @api    DELETE /api/placements/:id
 * @desc   Deletes a placement record by ID
 * @access Admin Private
 */
router.delete('/:id', deletePlacement);

export default router;
