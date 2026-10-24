/**
 * CODEGURU REST API BACKEND SERVER (server.js)
 * Hardened Express REST API Server
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { validateEnv } from './config/env.js';
import { connectDB } from './config/db.js';
import { globalLimiter, apiMinuteLimiter } from './middleware/rateLimiter.js';
import { requireAdmin } from './middleware/authMiddleware.js';
import adminRoutes from './api/routes/adminRoutes.js';
import apiRouter from './api/index.js';

// Validate required environment variables at startup
validateEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Cloud Atlas
connectDB();

// 1. Trust proxy for rate-limiters and secure cookies behind Render / reverse proxies
app.set('trust proxy', 1);

// 2. Browser Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "http:", "https:", "data:", "blob:", "'unsafe-inline'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  xContentTypeOptions: true,
  xFrameOptions: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// 3. Cookie Parser for HttpOnly Session & JWT token handling
app.use(cookieParser());

// 4. Strict CORS with exact allowlist
const getCORSOrigins = () => {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
  }
  const origins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'https://codegurru.in',
    'https://www.codegurru.in',
    'https://369.codegurru.in'
  ];
  if (process.env.NODE_ENV !== 'production') {
    origins.push(
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    );
  }
  return origins.filter(Boolean);
};

const allowedOrigins = getCORSOrigins();

app.use(cors({
  origin: (origin, callback) => {
    // Requests with no origin (curl, server-to-server) or in exact allowlist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-admin-token',
    'x-admin-email',
    'x-csrf-token'
  ]
}));

// 5. Strict Body Size Limits
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 6. Hardened Static File Serving
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  next();
}, express.static(path.join(__dirname, 'uploads')));

/**
 * @api GET /api/health
 * @desc Minimal health check without any credential or server topology leakage
 */
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'ok' : 'degraded',
    db: isConnected ? 'up' : 'down',
    uptime: Math.floor(process.uptime())
  });
});

// 7. NoSQL Injection key sanitization (Section 2.5)
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
};

app.use((req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  if (req.query) sanitizeObject(req.query);
  next();
});

// 8. API Minute Rate Limiter (100 requests per minute per IP)
app.use('/api', apiMinuteLimiter);

// 9. Unified API Router Mount
app.use('/api', apiRouter);

// 10. Direct Admin Mount (ensures /admin/* is strictly guarded by requireAdmin)
app.use('/admin', requireAdmin, adminRoutes);

// 11. Centralized Error Handling Middleware (Zero stack trace or internal path leakage)
app.use((err, req, res, next) => {
  console.error('[Application Error]:', err.message);

  // Handle Payload Too Large (e.g., 10MB payload)
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      success: false,
      message: 'Payload too large: Request body exceeds maximum allowed limit (100kb)'
    });
  }

  // Handle Malformed JSON Syntax
  if (err instanceof SyntaxError && (err.status === 400 || err.statusCode === 400) && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body'
    });
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for resource parameter: ${err.path || 'id'}`
    });
  }

  // Handle Mongoose / Joi ValidationError
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error: Input data does not satisfy required constraints'
    });
  }

  // Clean error response: NEVER expose err.stack or internal file paths
  const statusCode = err.status && err.status >= 400 && err.status < 500 ? err.status : 500;
  const safeMessage = statusCode < 500 ? err.message : 'Something went wrong';

  return res.status(statusCode).json({
    success: false,
    message: safeMessage
  });
});

app.listen(PORT, () => {
  console.log(` CodeGurru REST API Backend running securely on port ${PORT}`);
});

export default app;
