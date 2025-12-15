"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatAboutExpenses = exports.logExpenseByChat = void 0;
const expense_1 = __importDefault(require("../models/expense"));
const notification_1 = __importDefault(require("../models/notification"));
const logger_1 = __importDefault(require("../utils/logger"));
// Import services
const expenseParser_1 = require("../services/expenseParser");
const transalationService_1 = require("../services/transalationService");
/**
 * Generate a simple friendly response (no API needed)
 * Now returns in English - will be translated later
 */
const generateSimpleResponse = (amount, category, familyTotal) => {
    const responses = [
        `✅ Added ₹${amount} to ${category}. Family total: ₹${familyTotal}`,
        `Got it! ₹${amount} for ${category} recorded. Total: ₹${familyTotal}`,
        `Expense saved: ₹${amount} in ${category}. Running total: ₹${familyTotal}`,
        `✓ ₹${amount} tracked under ${category}. Family spent: ₹${familyTotal}`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
};
/**
 * Log expense using natural language - 100% FREE with Multilingual Support
 */
const logExpenseByChat = async (req, res, next) => {
    try {
        console.log("🎯 logExpenseByChat - START (Multilingual NLP Mode - FREE)");
        const { message } = req.body;
        // ============================================
        // VALIDATION
        // ============================================
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Please provide a message",
                error: "Message is required"
            });
        }
        if (!req.user?.id || !req.user?.family) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "User ID and family required"
            });
        }
        logger_1.default.info("Processing chat expense with multilingual NLP", {
            userId: req.user.id,
            messagePreview: message.substring(0, 100)
        });
        // ============================================
        // STEP 1: DETECT LANGUAGE & TRANSLATE TO ENGLISH
        // ============================================
        console.log("🌐 Detecting language and translating to English...");
        const translationResult = await (0, transalationService_1.translateToEnglish)(message);
        console.log(`📝 Original (${(0, transalationService_1.getLanguageName)(translationResult.detectedLanguage)}): ${message}`);
        console.log(`🔄 Translated (English): ${translationResult.translatedText}`);
        // ============================================
        // STEP 2: PARSE WITH NLP (FREE!)
        // ============================================
        console.log("🧠 Parsing with NLP (free)...");
        const expenseData = await (0, expenseParser_1.parseExpense)(translationResult.translatedText, { preferAI: false });
        console.log("📊 Parsed expense:", expenseData);
        // ============================================
        // VALIDATE AMOUNT
        // ============================================
        if (!expenseData.amount || expenseData.amount <= 0) {
            // Translate error message back to user's language
            const errorMsg = "Could not determine the amount. Please mention how much you spent (e.g., '200 rupees for food')";
            const translatedError = await (0, transalationService_1.translateFromEnglish)(errorMsg, translationResult.detectedLanguage);
            return res.status(400).json({
                success: false,
                message: translatedError,
                originalLanguage: translationResult.detectedLanguage,
                parsedData: expenseData
            });
        }
        // ============================================
        // SAVE EXPENSE
        // ============================================
        console.log("💾 Saving expense...");
        const expense = await expense_1.default.create({
            description: message, // Store original message in user's language
            amount: expenseData.amount,
            category: expenseData.category,
            user: req.user.id,
            family: req.user.family,
            date: new Date()
        });
        console.log("✅ Expense saved:", expense._id);
        logger_1.default.info("Expense created via multilingual NLP", {
            expenseId: expense._id,
            amount: expenseData.amount,
            category: expenseData.category,
            confidence: expenseData.confidence,
            language: translationResult.detectedLanguage
        });
        // ============================================
        // CALCULATE FAMILY TOTAL
        // ============================================
        const expenses = await expense_1.default.find({ family: req.user.family });
        const familyTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        // ============================================
        // STEP 3: GENERATE RESPONSE & TRANSLATE BACK
        // ============================================
        const englishResponse = generateSimpleResponse(expenseData.amount, expenseData.category, familyTotal);
        // Translate response back to user's language
        console.log(`🌐 Translating response back to ${(0, transalationService_1.getLanguageName)(translationResult.detectedLanguage)}...`);
        const localizedResponse = await (0, transalationService_1.translateFromEnglish)(englishResponse, translationResult.detectedLanguage);
        console.log(`✅ Final response (${(0, transalationService_1.getLanguageName)(translationResult.detectedLanguage)}): ${localizedResponse}`);
        // ============================================
        // CREATE NOTIFICATION
        // ============================================
        try {
            await notification_1.default.create({
                family: req.user.family,
                user: req.user.id,
                recipientUser: req.user.id,
                message: localizedResponse,
                expenseId: expense._id,
                date: new Date(),
                seen: false
            });
        }
        catch (notifError) {
            console.warn("⚠️ Notification creation failed (non-critical)");
        }
        // ============================================
        // SEND RESPONSE
        // ============================================
        return res.status(201).json({
            success: true,
            expense: {
                _id: expense._id,
                description: expense.description,
                amount: expense.amount,
                category: expense.category,
                date: expense.date
            },
            message: localizedResponse,
            parsedData: {
                amount: expenseData.amount,
                category: expenseData.category,
                confidence: expenseData.confidence,
                parser: 'nlp',
                detectedLanguage: translationResult.detectedLanguage,
                translatedInput: translationResult.translatedText
            },
            familyTotal,
            language: {
                detected: translationResult.detectedLanguage,
                name: (0, transalationService_1.getLanguageName)(translationResult.detectedLanguage)
            }
        });
    }
    catch (error) {
        console.error("❌ Error:", error);
        logger_1.default.error("Chat expense logging failed", {
            error: error.message,
            userId: req.user?.id
        });
        return res.status(500).json({
            success: false,
            message: "Error processing your expense",
            error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
        });
    }
};
exports.logExpenseByChat = logExpenseByChat;
/**
 * Chat about expenses - Simple responses with multilingual support
 */
const chatAboutExpenses = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !req.user?.id) {
            return res.status(400).json({
                success: false,
                message: "Message and authentication required"
            });
        }
        // Detect language and translate to English
        console.log("🌐 Translating query to English...");
        const translationResult = await (0, transalationService_1.translateToEnglish)(message);
        const englishQuery = translationResult.translatedText.toLowerCase();
        // Get user's expenses
        const recentExpenses = await expense_1.default.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(10);
        const totalSpent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const today = new Date();
        const todayExpenses = recentExpenses.filter(e => {
            const expDate = new Date(e.date);
            return expDate.toDateString() === today.toDateString();
        });
        const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
        // Simple keyword matching (in English)
        let englishResponse = "I can help you track expenses! Just tell me what you spent.";
        if (englishQuery.includes('total') || englishQuery.includes('how much')) {
            englishResponse = `You've spent ₹${totalSpent} in total across ${recentExpenses.length} expenses.`;
        }
        else if (englishQuery.includes('today')) {
            englishResponse = todayExpenses.length > 0
                ? `Today you've spent ₹${todayTotal} across ${todayExpenses.length} expenses.`
                : `No expenses recorded today yet.`;
        }
        else if (englishQuery.includes('summary') || englishQuery.includes('recent')) {
            const topExpenses = recentExpenses.slice(0, 3);
            englishResponse = topExpenses.length > 0
                ? `Recent expenses: ${topExpenses.map(e => `₹${e.amount} on ${e.category}`).join(', ')}`
                : `No recent expenses found.`;
        }
        else if (englishQuery.includes('category') || englishQuery.includes('breakdown')) {
            const byCategory = {};
            recentExpenses.forEach(e => {
                byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
            });
            const breakdown = Object.entries(byCategory)
                .map(([cat, amt]) => `${cat}: ₹${amt}`)
                .join(', ');
            englishResponse = `Spending by category: ${breakdown}`;
        }
        // Translate response back to user's language
        console.log(`🌐 Translating response to ${(0, transalationService_1.getLanguageName)(translationResult.detectedLanguage)}...`);
        const localizedResponse = await (0, transalationService_1.translateFromEnglish)(englishResponse, translationResult.detectedLanguage);
        return res.status(200).json({
            success: true,
            message: localizedResponse,
            context: {
                totalSpent,
                todayTotal,
                expenseCount: recentExpenses.length,
                recentExpenses: recentExpenses.slice(0, 5).map(e => ({
                    _id: e._id,
                    description: e.description,
                    amount: e.amount,
                    category: e.category,
                    date: e.date
                }))
            },
            language: {
                detected: translationResult.detectedLanguage,
                name: (0, transalationService_1.getLanguageName)(translationResult.detectedLanguage)
            }
        });
    }
    catch (error) {
        console.error("❌ Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error processing chat"
        });
    }
};
exports.chatAboutExpenses = chatAboutExpenses;
//# sourceMappingURL=aiChatController.js.map