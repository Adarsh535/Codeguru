/**
 * CODEGURU REST API BACKEND SERVER (server.js)
 * Main entry point initializing Express server, CORS middleware, MongoDB Mongoose
 * database connection, static upload serving, and MVC API routes mounting.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import apiRouter from './api/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Compass / MongoDB Server
connectDB();

// Enable CORS for frontend & admin origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploaded media files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * @api GET /api/health
 * @desc System diagnostic health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'CodeGuru Backend API is running cleanly',
    timestamp: new Date().toISOString()
  });
});

// Unified API Router Mount (backend/api/index.js)
app.use('/api', apiRouter);

app.listen(PORT, () => {

  console.log(` CodeGuru REST API Backend running on port ${PORT}`);
  console.log(` Base API URL: http://localhost:${PORT}/api`);
  console.log(` Uploads URL:  http://localhost:${PORT}/uploads`);
 
});
