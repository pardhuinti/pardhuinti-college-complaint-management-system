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
  res.json({
    status: 'ok',
    message: 'College Complaint Management System Backend API is active.',
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
      app.listen(PORT, () => {
        console.log(`[Server] Enterprise API Server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('[Server Error] Initial connection failed:', err.message);
      app.listen(PORT, () => {
        console.log(`[Server] API Server listening on port ${PORT} (Database pending)`);
      });
    });
}

export default app;

