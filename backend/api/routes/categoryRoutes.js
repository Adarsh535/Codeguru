/**
 * ============================================================================
 * ROUTER: COURSE CATEGORIES ROUTES (categoryRoutes.js)
 * ============================================================================
 * API endpoint routing for course category management.
 * Hardened with Master Admin authorization.
 */

import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);

export default router;
