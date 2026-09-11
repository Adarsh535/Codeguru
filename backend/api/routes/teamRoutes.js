/**
 * ============================================================================
 * API ROUTER: TEAM ROUTES (teamRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for CodeGuru Staff & Tech Instructors.
 */

import express from 'express';
import { getTeam, addTeamMember, deleteTeamMember } from '../controllers/teamController.js';

const router = express.Router();

/**
 * @api    GET /api/team
 * @desc   Retrieves all staff instructor profiles
 * @access Public
 */
router.get('/', getTeam);

/**
 * @api    POST /api/team
 * @desc   Creates a new instructor profile
 * @access Admin Private
 */
router.post('/', addTeamMember);

/**
 * @api    DELETE /api/team/:id
 * @desc   Deletes an instructor profile by ID
 * @access Admin Private
 */
router.delete('/:id', deleteTeamMember);

export default router;
