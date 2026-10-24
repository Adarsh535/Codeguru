/**
 * ============================================================================
 * API ROUTER: USER ROUTES (userRoutes.js)
 * ============================================================================
 * Routes for user profile retrieval protected against IDOR.
 */

import express from 'express';
import { getUserById } from '../controllers/userController.js';
import { requireAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /api/users/:id
 * @desc   Retrieves user profile (IDOR guarded: caller can only fetch own data or must be admin)
 * @access Authenticated User
 */
router.get('/:id', requireAuth, getUserById);

export default router;
