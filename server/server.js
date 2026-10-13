import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads if directory exists
try {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
} catch (e) {
  // Ignore static directory mount errors on serverless
}

// Database Connection Middleware for Serverless & Standalone execution
app.use(async (req, res, next) => {
  // Allow health checks to run without blocking
  if (req.path === '/' || req.path === '/health' || req.path === '/api/health') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[Middleware Error] Database connection failed:', error.message);
    res.status(503).json({
      message: 'Database connection failed. Please ensure MONGODB_URI is configured correctly in Vercel / environment.',
      error: error.message,
    });
  }
});

// Health Check Endpoint
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    system: 'Enterprise College Complaint Management System API',
    environment: process.env.NODE_ENV || 'production',
    time: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
app.get('/api', healthHandler);
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Server - College Complaint Management System</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0F172A; color: #F8FAFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #1E293B; border: 1px solid #334155; border-radius: 8px; padding: 32px; max-width: 520px; width: 90%; }
    h1 { font-size: 20px; margin: 0 0 12px 0; color: #38BDF8; }
    p { color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; }
    .badge { display: inline-flex; align-items: center; background: #064E3B; color: #34D399; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    .links { margin-top: 24px; display: flex; gap: 12px; }
    a { display: inline-block; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; }
    .btn-primary { background: #2563EB; color: #FFFFFF; }
    .btn-secondary { background: #334155; color: #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">API SERVER ONLINE</div>
    <h1>College Complaint Management System</h1>
    <p>The backend REST API is operational on <strong>port ${process.env.PORT || 5000}</strong> with MongoDB Atlas connectivity.</p>
    <p>To view the full user interface, open the frontend portal:</p>
    <div class="links">
      <a href="http://localhost:3000" class="btn-primary">Open Frontend Portal</a>
      <a href="/api/health" class="btn-secondary">API Health Check</a>
    </div>
  </div>
</body>
</html>`);
    return;
  }
  res.json({
    status: 'ok',
    message: 'College Complaint Management System Backend API is active.',
    frontendUrl: 'http://localhost:3000',
  });
});

// Route registration helper to handle both /api/* and direct routes seamlessly on Vercel
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/complaints', complaintRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/admin', adminRoutes);

// Mount API routes under /api and also directly
app.use('/api', apiRouter);
app.use(apiRouter);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Listen only when server.js is run directly as standalone script (e.g. node backend/server.js)
const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]).toLowerCase() === path.resolve(__filename).toLowerCase();

if (isDirectRun && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      const server = app.listen(PORT, () => {
        console.log(`[Server] Enterprise API Server listening on:`);
        console.log(`         ➜ Local:   http://localhost:${PORT}/`);
        console.log(`         ➜ Health:  http://localhost:${PORT}/api/health`);
        console.log(`         ➜ Client:  ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`[Server Error] Port ${PORT} is already in use by another running process.`);
          console.error(`[Server Error] To free port ${PORT}, stop the existing process before restarting.`);
          process.exit(1);
        } else {
          console.error('[Server Error]:', err.message);
        }
      });
    })
    .catch((err) => {
      console.error('[Server Error] Initial connection failed:', err.message);
      const server = app.listen(PORT, () => {
        console.log(`[Server] API Server listening on port ${PORT} (Database pending)`);
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`[Server Error] Port ${PORT} is already in use by another running process.`);
          console.error(`[Server Error] To free port ${PORT}, stop the existing process before restarting.`);
          process.exit(1);
        } else {
          console.error('[Server Error]:', err.message);
        }
      });
    });
}

export default app;

