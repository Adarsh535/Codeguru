/**
 * ============================================================================
 * API ROUTER: COURSE ROUTES (courseRoutes.js)
 * ============================================================================
 * Defines REST API endpoints for Training Courses Catalog & Curriculums.
 */

import express from 'express';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @api    GET /api/courses
 * @desc   Retrieves all training courses catalog
 * @access Public
 */
router.get('/', getCourses);

/**
 * @api    POST /api/courses
 * @desc   Creates a new training course entry
 * @access Admin Private
 */
router.post('/', requireAdmin, addCourse);

/**
 * @api    PUT /api/courses/:id
 * @desc   Updates course details by ID
 * @access Admin Private
 */
router.put('/:id', requireAdmin, updateCourse);

/**
 * @api    DELETE /api/courses/:id
 * @desc   Deletes a course entry by ID
 * @access Admin Private
 */
router.delete('/:id', requireAdmin, deleteCourse);

export default router;
