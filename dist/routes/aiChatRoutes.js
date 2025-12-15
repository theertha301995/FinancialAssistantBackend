"use strict";
// File: src/routes/aiChatRoutes.ts - FIXED VERSION
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiChatController_1 = require("../controller/aiChatController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// ============================================
// TEST ROUTE (no auth) - for debugging
// ============================================
// ============================================
// EXPENSE ROUTE (with auth)
// ============================================
router.post('/expense', authMiddleware_1.protect, aiChatController_1.logExpenseByChat);
exports.default = router;
//# sourceMappingURL=aiChatRoutes.js.map