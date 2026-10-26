import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import listingsRouter from './routes/listings.js';
import moderationRouter from './routes/moderation.js';
import { db, isSupabaseConfigured } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Allowed origins for CORS (local + Vercel deployments)
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, or same-origin browser calls)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      (process.env.VERCEL_URL && origin.includes(process.env.VERCEL_URL))
    ) {
      return callback(null, true);
    }
    // Fallback: allow request origin in cloud environments
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'RentCheck Backend API',
    supabaseConnected: isSupabaseConfigured,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim())
  });
});

// Profile & Demo Persona route
app.get('/api/auth/profiles', async (req, res, next) => {
  try {
    const profiles = await db.getProfiles();
    res.json({
      success: true,
      profiles
    });
  } catch (err) {
    next(err);
  }
});

// Mount Routes
app.use('/api/listings', listingsRouter);
app.use('/api/moderation', moderationRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('[RentCheck Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected server error occurred.'
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`RentCheck Backend API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: ${isSupabaseConfigured ? 'Supabase Postgres' : 'High-Resiliency Storage Store'}`);
    console.log(`Gemini AI: ${Boolean(process.env.GEMINI_API_KEY) ? 'Configured' : 'Heuristic Engine Active'}`);
    console.log(`===============================================`);
  });
}

export default app;
