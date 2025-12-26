"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controller/chat.controller");
const router = (0, express_1.Router)();
// POST /api/chat/query
router.post('/chat/query', chat_controller_1.ChatController.query);
// Health check for chat service
router.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Chat service is running',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=chat.routes.js.map