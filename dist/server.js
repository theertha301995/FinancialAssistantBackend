"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// File: src/server.ts
console.log("🔥🔥🔥 SERVER.TS IS LOADING - FILE PATH:", __filename);
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const familyRoutes_1 = __importDefault(require("./routes/familyRoutes"));
const budgetRoutes_1 = __importDefault(require("./routes/budgetRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const aiChatRoutes_1 = __importDefault(require("./routes/aiChatRoutes"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
// ✅ IMPORTANT: Render provides PORT via env
const PORT = Number(process.env.PORT) || 5000;
console.log("\n" + "=".repeat(60));
console.log("🚀 Starting Daily Spending API...");
console.log("=".repeat(60) + "\n");
// ============================================
// MIDDLEWARE
// ============================================
console.log("⚙️  Setting up middleware...");
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use(logger_1.requestLogger);
// Extra request logging (safe to keep)
app.use((req, _res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});
// ============================================
// DATABASE CONNECTION
// ============================================
console.log("🔌 Connecting to database...");
(0, db_1.default)();
// ============================================
// BASIC ROUTES
// ============================================
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});
app.get('/', (_req, res) => {
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
app.use('/api/auth', authRoutes_1.default);
console.log("   ✓ /api/auth");
app.use('/api/expenses', expenseRoutes_1.default);
console.log("   ✓ /api/expenses");
app.use('/api/family', familyRoutes_1.default);
console.log("   ✓ /api/family");
app.use('/api/budgets', budgetRoutes_1.default);
console.log("   ✓ /api/budgets");
app.use('/api/notifications', notificationRoutes_1.default);
console.log("   ✓ /api/notifications");
app.use('/api/chat', aiChatRoutes_1.default);
console.log("   ✓ /api/chat");
console.log("\n✅ All routes mounted successfully!\n");
// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
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
app.use((err, _req, res, _next) => {
    console.error('❌ Error:', err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
// ============================================
// START SERVER (🔥 FIXED FOR RENDER)
// ============================================
app.listen(PORT, '0.0.0.0', () => {
    console.log("=".repeat(60));
    console.log(`✨ Server is running on port ${PORT}`);
    console.log("=".repeat(60));
    console.log(`🟢 Health check: /health`);
});
exports.default = app;
//# sourceMappingURL=server.js.map