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
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
console.log("\n" + "=".repeat(60));
console.log("🚀 Starting Daily Spending API...");
console.log("=".repeat(60) + "\n");
// ============================================
// MIDDLEWARE - WRAPPED IN TRY-CATCH
// ============================================
try {
    console.log("⚙️  Setting up middleware...");
    const corsOptions = {
        origin: function (origin, callback) {
            const allowedOrigins = [
                'https://finanncial-tracker-frontend-theerthas-projects-66a7dc70.vercel.app',
                'https://finanncial-tracker-front-git-3e617b-theerthas-projects-66a7dc70.vercel.app',
                'https://finanncial-tracker-frontend-1n7yc9gvp.vercel.app',
                'https://brave-sand-01e5e4210.2.azurestaticapps.net',
                'http://localhost:3000',
            ];
            if (!origin) {
                console.log('✅ Request with no origin (Postman/curl) - allowed');
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) {
                console.log('✅ CORS allowed for origin:', origin);
                callback(null, true);
            }
            else {
                console.log('❌ CORS blocked for origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Length', 'X-Requested-With'],
        maxAge: 86400
    };
    app.use((0, cors_1.default)(corsOptions));
    console.log("✅ CORS configured");
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
    console.log("✅ Body parsers configured");
    // Import logger AFTER basic middleware
    console.log("📝 Importing logger...");
    const { requestLogger } = require('./utils/logger');
    app.use(requestLogger);
    console.log("✅ Logger configured");
    app.use((req, _res, next) => {
        console.log(`📨 ${req.method} ${req.path}`);
        next();
    });
}
catch (error) {
    console.error("💥 MIDDLEWARE SETUP FAILED:", error.message);
    console.error(error.stack);
    process.exit(1);
}
// ============================================
// DATABASE CONNECTION
// ============================================
try {
    console.log("🔌 Connecting to database...");
    const connectDB = require('./config/db').default;
    connectDB();
    console.log("✅ Database connection initiated");
}
catch (error) {
    console.error("💥 DATABASE CONNECTION FAILED:", error.message);
    console.error(error.stack);
    process.exit(1);
}
// ============================================
// IMPORT ROUTES
// ============================================
try {
    console.log("📦 Importing routes...");
    const authRoutes = require('./routes/authRoutes').default;
    const expenseRoutes = require('./routes/expenseRoutes').default;
    const familyRoutes = require('./routes/familyRoutes').default;
    const budgetRoutes = require('./routes/budgetRoutes').default;
    const notificationRoutes = require('./routes/notificationRoutes').default;
    const aiChatRoutes = require('./routes/aiChatRoutes').default;
    console.log("✅ Routes imported");
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
}
catch (error) {
    console.error("💥 ROUTE SETUP FAILED:", error.message);
    console.error(error.stack);
    process.exit(1);
}
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
// START SERVER
// ============================================
app.listen(PORT, '0.0.0.0', () => {
    console.log("=".repeat(60));
    console.log(`✨ Server is running on port ${PORT}`);
    console.log("=".repeat(60));
    console.log(`🟢 Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=server.js.map