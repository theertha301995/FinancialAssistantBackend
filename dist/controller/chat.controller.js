"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_service_1 = require("../services/chat.service");
class ChatController {
    static async query(req, res) {
        try {
            const { message, userId, familyId } = req.body;
            console.log('📨 Chat query received:', { message, userId, familyId });
            // Validation
            if (!message) {
                res.status(400).json({
                    success: false,
                    error: 'Message is required'
                });
                return;
            }
            if (!userId || !familyId) {
                res.status(400).json({
                    success: false,
                    error: 'userId and familyId are required'
                });
                return;
            }
            // Analyze intent
            const intent = chat_service_1.ChatService.analyzeIntent(message);
            console.log('🤔 Detected intent:', intent.type);
            // Process intent and get response
            const response = await chat_service_1.ChatService.processIntent(intent, userId, familyId);
            console.log('✅ Response generated:', response.type);
            // Send response
            res.json({
                success: true,
                ...response
            });
        }
        catch (error) {
            console.error('❌ Chat query error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process your request',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map