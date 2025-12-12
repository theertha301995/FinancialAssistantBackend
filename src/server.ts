// File: src/server.ts - WORKING VERSION (No crash)
console.log("🔥🔥🔥 SERVER.TS IS LOADING - FILE PATH:", __filename)
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
import logger, { requestLogger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 5000;

console.log("\n" + "=".repeat(60));
console.log("🚀 Starting Daily Spending API...");
console.log("=".repeat(60) + "\n");

// ============================================
// MIDDLEWARE
// ============================================
console.log("⚙️  Setting up middleware...");
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(requestLogger);

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
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
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req: Request, res: Response) => {
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
app.use((req, res, next) => {
  console.log(`❌ 404: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log(`✨ Server is running on http://localhost:${PORT}`);
  console.log("=".repeat(60));
  console.log("\n📝 Available Endpoints:");
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   POST http://localhost:${PORT}/api/chat/expense`);
  console.log(`   POST http://localhost:${PORT}/api/chat/test`);
  console.log("\n💡 Example request:");
  console.log(`   POST /api/chat/expense`);
  console.log(`   Body: { "message": "spent 200 on food" }`);
  console.log(`   Header: Authorization: Bearer YOUR_TOKEN\n`);
});

export default app;