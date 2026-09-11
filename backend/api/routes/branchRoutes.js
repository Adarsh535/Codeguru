/**
 * ============================================================================
 * API ROUTER: BRANCH ROUTES (branchRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Regional Campus & Branch Locations.
 */

import express from 'express';
import { getBranches, addBranch, deleteBranch } from '../controllers/branchController.js';

const router = express.Router();

/**
 * @api    GET /api/branches
 * @desc   Retrieves all regional campuses and branch locations
 * @access Public
 */
router.get('/', getBranches);

/**
 * @api    POST /api/branches
 * @desc   Creates a new regional campus branch entry
 * @access Admin Private
 */
router.post('/', addBranch);

/**
 * @api    DELETE /api/branches/:id
 * @desc   Deletes a branch location by ID
 * @access Admin Private
 */
router.delete('/:id', deleteBranch);

export default router;
