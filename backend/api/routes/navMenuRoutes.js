/**
 * ============================================================================
 * API ROUTER: NAV MENU ROUTES (navMenuRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Header Dynamic Navigation Menus.
 */

import express from 'express';
import { getNavMenus, addNavMenu, deleteNavMenu } from '../controllers/navMenuController.js';

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
router.post('/', addNavMenu);

/**
 * @api    DELETE /api/navmenus/:id
 * @desc   Deletes a navigation menu category by ID
 * @access Admin Private
 */
router.delete('/:id', deleteNavMenu);

export default router;
