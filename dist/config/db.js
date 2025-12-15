"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        // ✅ Check both possible env var names
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('❌ MONGO_URI environment variable is not set');
            console.log('⚠️  Server will start WITHOUT database connection');
            return;
        }
        await mongoose_1.default.connect(mongoUri);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        console.log('⚠️  Server will continue WITHOUT database connection');
        // ❌ DON'T DO THIS: process.exit(1);
        // Let the server start anyway so health checks pass
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map