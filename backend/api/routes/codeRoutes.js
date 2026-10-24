/**
 * ============================================================================
 * API ROUTER: CODE RUNNER & SANDBOX ROUTES (codeRoutes.js)
 * ============================================================================
 * Defines REST API routes for sandboxed code execution.
 */

import express from 'express';
import { runCode } from '../controllers/codeExecutionController.js';

const router = express.Router();

/**
 * @api    POST /api/code/run
 * @desc   Runs student code in sandboxed VM with hard timeout & memory limits
 * @access Public / Authenticated
 */
router.post('/run', runCode);

export default router;
