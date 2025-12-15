"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.updateExpense = exports.getFamilyExpenses = exports.getExpenses = exports.addExpense = void 0;
const expense_1 = __importDefault(require("../models/expense"));
const notification_1 = __importDefault(require("../models/notification"));
const nlpService_1 = require("../services/nlpService");
const transalationService_1 = require("../services/transalationService");
const advisorService_1 = require("../services/advisorService");
const forecastService_1 = require("../services/forecastService");
const user_1 = __importDefault(require("../models/user"));
const addExpense = async (req, res) => {
    try {
        const { description, amount, category, lang } = req.body;
        const currentUser = req.user;
        // 1️⃣ AI categorization
        let finalCategory = category || await (0, nlpService_1.categorizeExpense)(description);
        // 2️⃣ Save expense
        const expense = await expense_1.default.create({
            description,
            amount,
            category: finalCategory,
            user: currentUser.id,
            family: currentUser.family
        });
        // 3️⃣ Family total
        const expenses = await expense_1.default.find({ family: currentUser.family });
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        // 4️⃣ AI advice + forecast
        const advice = (0, advisorService_1.getAdvice)(expenses);
        const forecast = (0, forecastService_1.forecastSpending)(expenses);
        // 5️⃣ Prepare notification message
        const memberName = currentUser.name || "A family member";
        let responseMessage = `${memberName} added ₹${amount} to ${finalCategory}. Family total: ₹${total}. ${advice}`;
        // Translate if language specified
        if (lang) {
            responseMessage = await (0, transalationService_1.translateText)(responseMessage, lang);
        }
        // 6️⃣ Find family head and notify them (only if current user is NOT the head)
        const familyHead = await user_1.default.findOne({
            family: currentUser.family,
            role: 'head'
        });
        if (familyHead && familyHead._id.toString() !== currentUser.id) {
            // Only notify if the person adding expense is not the head themselves
            await notification_1.default.create({
                family: currentUser.family,
                user: currentUser.id, // Who created the expense
                recipientUser: familyHead._id, // Who should receive the notification
                message: responseMessage,
                expenseId: expense._id, // Link to the expense
                date: new Date(),
                seen: false
            });
        }
        res.status(201).json({
            expense,
            total,
            advice,
            forecast,
            message: responseMessage
        });
    }
    catch (error) {
        console.error("Error adding expense:", error);
        res.status(500).json({ message: "Error adding expense", error });
    }
};
exports.addExpense = addExpense;
// @desc    Get all expenses for logged-in user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
    try {
        const expenses = await expense_1.default.find({ user: req.user.id });
        res.json(expenses);
        // ❌ REMOVE THIS - It's test/debug code left in production
        // const message = await translateText("Added ₹500 to Food", "ml");
        // console.log(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};
exports.getExpenses = getExpenses;
// @desc    Get family expenses
// @route   GET /api/expenses/family
// @access  Private
const getFamilyExpenses = async (req, res) => {
    try {
        const expenses = await expense_1.default.find({ family: req.user.family }).populate('user', 'name');
        res.json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching family expenses', error });
    }
};
exports.getFamilyExpenses = getFamilyExpenses;
// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
    try {
        const expense = await expense_1.default.findById(req.params.id);
        if (!expense)
            return res.status(404).json({ message: 'Expense not found' });
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const updatedExpense = await expense_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedExpense);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating expense', error });
    }
};
exports.updateExpense = updateExpense;
// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
    try {
        const expense = await expense_1.default.findById(req.params.id);
        if (!expense)
            return res.status(404).json({ message: 'Expense not found' });
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await expense.deleteOne();
        res.json({ message: 'Expense removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting expense', error });
    }
};
exports.deleteExpense = deleteExpense;
//# sourceMappingURL=expenseController.js.map