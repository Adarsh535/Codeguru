/**
 * CODEGURU REST API BACKEND SERVER (server.js)
 * Main entry point initializing Express server, CORS with origin allowlist,
 * Helmet security headers, cookie parser, rate limiting, and MVC API routes mounting.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB, switchDatabaseMode, currentDbMode } from './config/db.js';
import apiRouter from './api/index.js';
import { generalApiLimiter } from './middleware/rateLimiter.js';
import { requireAdmin } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// 1. Browser Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: false, // Prevents breaking dynamic Cloudinary / CDN embeds
  crossOriginEmbedderPolicy: false,
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// 2. Cookie Parser for HttpOnly Session & JWT token handling
app.use(cookieParser());

// 3. CORS with strict origin allowlist and credential support
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  'https://codegurru.in',
  'https://www.codegurru.in',
  'https://369.codegurru.in',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked request from unauthorized origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-api-key',
    'x-secret-key',
    'x-admin-token',
    'x-admin-email'
  ]
}));

// 4. Safe Request Body Size Limits (Prevents Denial of Service via large payloads)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 5. Hardened Static File Serving for uploads
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  next();
}, express.static(path.join(__dirname, 'uploads')));

/**
 * @api GET /api/health
 * @desc Sanitized System diagnostic health check endpoint (Zero Credential Leakage)
 */
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const host = mongoose.connection.host || 'Disconnected';
  const dbName = mongoose.connection.name || 'codeguru_db';
  const isAtlas = host.includes('mongodb.net') || host.includes('cluster') || currentDbMode === 'cloud';

  res.json({
    success: true,
    status: 'CodeGuru Backend API is running cleanly',
    database: {
      connected: isConnected,
      mode: isAtlas ? 'cloud' : 'local',
      host,
      name: dbName,
      isAtlas,
      provider: isAtlas ? 'MongoDB Atlas Cloud Cluster' : 'Local MongoDB Compass'
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * @api POST /api/health/switch-db
 * @desc Switch runtime database connection between Cloud Atlas and Local Compass
 * @access Admin Private (Requires Master Admin Authorization)
 */
app.post('/api/health/switch-db', requireAdmin, async (req, res) => {
  const { mode } = req.body || {}; // 'cloud' | 'local'
  const result = await switchDatabaseMode(mode);
  if (result.success) {
    return res.json({
      success: true,
      message: `Switched database connection to ${mode === 'cloud' ? 'MongoDB Atlas Cloud' : 'Local MongoDB Compass'}!`
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Failed to switch database connection'
    });
  }
});

// 6. Unified API Router Mount with General Rate Limiter
app.use('/api', generalApiLimiter, apiRouter);

// 7. Centralized Error Handling Middleware (Suppresses sensitive stack traces in production)
app.use((err, req, res, next) => {
  console.error('[Application Error]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again.'
      : (err.message || 'Internal server error')
  });
});

app.listen(PORT, () => {
  console.log(`🔒 CodeGuru REST API Backend running securely on port ${PORT}`);
  console.log(`📍 Base API URL: http://localhost:${PORT}/api`);
});
