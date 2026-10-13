/**
 * ============================================================================
 * API ROUTER: NAV MENU ROUTES (navMenuRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Header Dynamic Navigation Menus.
 * Hardened with Master Admin authorization.
 */

import express from 'express';
import { getNavMenus, addNavMenu, deleteNavMenu } from '../controllers/navMenuController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /api/navmenus
 * @desc   Retrieves dynamic navigation menu items
 * @access Public
 */
router.get('/', getNavMenus);

/**
 * @api    POST /api/navmenus
 * @desc   Creates a new navigation menu category
 * @access Admin Private
 */
router.post('/', requireAdmin, addNavMenu);

/**
 * @api    DELETE /api/navmenus/:id
 * @desc   Deletes a navigation menu category by ID
 * @access Admin Private
 */
router.delete('/:id', requireAdmin, deleteNavMenu);

export default router;
