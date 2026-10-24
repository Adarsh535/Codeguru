/**
 * ============================================================================
 * UNIFIED BACKEND API ROUTER (api/index.js)
 * ============================================================================
 * Mounts all REST API route modules under the central `/api` path.
 */

import express from 'express';
import authRoutes from './routes/authRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import placementRoutes from './routes/placementRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import trafficRoutes from './routes/trafficRoutes.js';
import navMenuRoutes from './routes/navMenuRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import realtimeRoutes from './routes/realtimeRoutes.js';
import adRoutes from './routes/adRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
// SECURITY: public code-execution route disabled (vm is not a secure sandbox → RCE risk).
// import codeRoutes from './routes/codeRoutes.js';
import { validateApiKey, requireAdmin, requireJson } from '../middleware/authMiddleware.js';

const apiRouter = express.Router();

// Enforce Global API Key Security Shield on all /api endpoints
apiRouter.use(validateApiKey);

// Mount all API endpoints
apiRouter.use('/admin', requireJson, requireAdmin, adminRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/banners', bannerRoutes);
apiRouter.use('/ads', adRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/placements', placementRoutes);
apiRouter.use('/team', teamRoutes);
apiRouter.use('/branches', branchRoutes);
apiRouter.use('/leads', leadRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/traffic', trafficRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/navmenus', navMenuRoutes);
apiRouter.use('/enrollments', enrollmentRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/submissions', submissionRoutes);
// SECURITY: /code/run disabled — unauthenticated code execution (RCE) risk.
// To re-enable safely, run untrusted code in a real sandbox (isolated-vm / Docker /
// hosted judge like Judge0) behind auth + strict rate limiting.
apiRouter.use('/code', (req, res) => res.status(404).json({ success: false, message: 'Not found' }));
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/realtime', realtimeRoutes);
apiRouter.use('/events', realtimeRoutes);

export default apiRouter;

