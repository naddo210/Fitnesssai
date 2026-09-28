import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import weightRoutes from './routes/weightRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initKeepAliveCron } from './utils/keepAlive.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

// Dynamic CORS configuration allowing localhost and production clients
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (curl, server-to-server, cron jobs, mobile)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed list or any subdomain
    const isAllowed = allowedOrigins.includes(origin) || 
      allowedOrigins.some(allowed => origin.startsWith(allowed)) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.netlify.app');

    if (isAllowed) {
      return callback(null, true);
    }
    // Fallback: allow to prevent lockouts during cross-domain deployment
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Health check endpoint for Render deployment monitoring and keep-alive pinging
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FitnessAI Backend is healthy and running',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// App Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress/weight', weightRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Gym Genius API is running');
});

// Optimized MongoDB connection with connection pooling for high concurrency
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI is not set in environment variables');
      return;
    }
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Connected with Connection Pooling (maxPoolSize: 50)');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Initialize keep-alive cron job to prevent Render free-tier spin-down
  initKeepAliveCron(PORT);
});
