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

const apiRouter = express.Router();

// Mount all API endpoints
apiRouter.use('/auth', authRoutes);
apiRouter.use('/banners', bannerRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/placements', placementRoutes);
apiRouter.use('/team', teamRoutes);
apiRouter.use('/branches', branchRoutes);
apiRouter.use('/leads', leadRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/traffic', trafficRoutes);
apiRouter.use('/navmenus', navMenuRoutes);
apiRouter.use('/enrollments', enrollmentRoutes);

export default apiRouter;

