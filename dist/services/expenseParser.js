"use strict";
// File: src/services/expenseParser.ts
// FREE VERSION - No API costs!
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParsingStats = exports.batchParseExpenses = exports.parseExpense = void 0;
const nlpService_1 = require("./nlpService");
/**
 * Parse expense using NLP (100% FREE)
 * No API calls, works offline, instant results
 */
const parseExpense = async (text, options) => {
    const { requireHighConfidence = false } = options || {};
    // First, check if this is actually an expense entry
    if (!(0, nlpService_1.isExpenseEntry)(text)) {
        return {
            amount: 0,
            category: "Other",
            description: text,
            confidence: 0,
            needsClarification: true,
            clarificationQuestion: "This doesn't look like an expense. Did you want to ask a question instead?",
            parser: "nlp"
        };
    }
    try {
        // Use NLP parsing (free and fast!)
        console.log("📝 Using NLP parsing (FREE)...");
        const nlpResult = await (0, nlpService_1.parseExpenseWithNLP)(text);
        return {
            ...nlpResult,
            needsClarification: requireHighConfidence
                ? nlpResult.confidence < 80
                : nlpResult.confidence < 50,
            clarificationQuestion: nlpResult.confidence < 70
                ? "Please confirm this expense is correct"
                : undefined,
            parser: "nlp"
        };
    }
    catch (error) {
        console.error("❌ Error in expense parsing:", error.message);
        // Return empty result on error
        return {
            amount: 0,
            category: "Other",
            description: text,
            confidence: 0,
            needsClarification: true,
            clarificationQuestion: "Could not parse expense. Please try rephrasing.",
            parser: "nlp"
        };
    }
};
exports.parseExpense = parseExpense;
/**
 * Batch parse multiple expenses
 */
const batchParseExpenses = async (messages) => {
    const results = await Promise.all(messages.map(message => (0, exports.parseExpense)(message)));
    return results;
};
exports.batchParseExpenses = batchParseExpenses;
/**
 * Get parsing statistics
 */
const getParsingStats = (results) => {
    const total = results.length;
    const successful = results.filter(r => r.amount > 0).length;
    const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / total;
    return {
        total,
        successful,
        successRate: (successful / total) * 100,
        nlpParsed: total,
        avgConfidence: Math.round(avgConfidence)
    };
};
exports.getParsingStats = getParsingStats;
//# sourceMappingURL=expenseParser.js.map