// File: src/server.ts
console.log("🔥🔥🔥 SERVER.TS IS LOADING - FILE PATH:", __filename);

import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes';
import familyRoutes from './routes/familyRoutes';
import budgetRoutes from './routes/budgetRoutes';
import notificationRoutes from './routes/notificationRoutes';
import aiChatRoutes from './routes/aiChatRoutes';

import { requestLogger } from './utils/logger';

const app = express();

const PORT = Number(process.env.PORT) || 5000;

console.log("\n" + "=".repeat(60));
console.log("🚀 Starting Daily Spending API...");
console.log("=".repeat(60) + "\n");

// ============================================
// MIDDLEWARE - CORS FIRST! 🔥
// ============================================
console.log("⚙️  Setting up middleware...");

// 🔥 IMPROVED CORS CONFIGURATION
const corsOptions = {
  origin: function(origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      'https://finanncial-tracker-frontend-theerthas-projects-66a7dc70.vercel.app',
      'https://finanncial-tracker-front-git-3e617b-theerthas-projects-66a7dc70.vercel.app',
      'https://finanncial-tracker-frontend-1n7yc9gvp.vercel.app',
      'https://brave-sand-01e5e4210.2.azurestaticapps.net',
      'http://localhost:3000',
    ];
    
    // Allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) {
      console.log('✅ Request with no origin (Postman/curl) - allowed');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// 🔥 CRITICAL: Handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(requestLogger);

// 🔥 Enhanced request logging
app.use((req, _res, next) => {
  console.log(`📨 ${req.method} ${req.path} from ${req.get('origin') || 'no origin'}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================
console.log("🔌 Connecting to database...");
connectDB();

// ============================================
// BASIC ROUTES
// ============================================
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Daily Spending API',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      expenses: '/api/expenses',
      family: '/api/family',
      budgets: '/api/budgets',
      notifications: '/api/notifications',
      chat: '/api/chat'
    }
  });
});

// ============================================
// API ROUTES
// ============================================
console.log("\n📋 Mounting API routes...");

app.use('/api/auth', authRoutes);
console.log("   ✓ /api/auth");

app.use('/api/expenses', expenseRoutes);
console.log("   ✓ /api/expenses");

app.use('/api/family', familyRoutes);
console.log("   ✓ /api/family");

app.use('/api/budgets', budgetRoutes);
console.log("   ✓ /api/budgets");

app.use('/api/notifications', notificationRoutes);
console.log("   ✓ /api/notifications");

app.use('/api/chat', aiChatRoutes);
console.log("   ✓ /api/chat");

console.log("\n✅ All routes mounted successfully!\n");

// ============================================
// 404 HANDLER
// ============================================
app.use((req: Request, res: Response) => {
  console.log(`❌ 404: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log("=".repeat(60));
  console.log(`✨ Server is running on port ${PORT}`);
  console.log("=".repeat(60));
  console.log(`🟢 Health check: /health`);
});

export default app;