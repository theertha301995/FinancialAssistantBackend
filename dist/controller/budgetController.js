"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudget = exports.updateBudget = exports.getBudgetStatus = exports.setBudget = void 0;
const budget_1 = __importDefault(require("../models/budget"));
const expense_1 = __importDefault(require("../models/expense"));
// @desc    Set a new budget
// @route   POST /api/budgets
// @access  Private (head only)
const setBudget = async (req, res) => {
    try {
        const { limit, period } = req.body;
        const familyId = req.user.family;
        const budget = await budget_1.default.create({ family: familyId, limit, period });
        res.status(201).json(budget);
    }
    catch (error) {
        res.status(500).json({ message: 'Error setting budget', error });
    }
};
exports.setBudget = setBudget;
// @desc    Get current budget status
// @route   GET /api/budgets
// @access  Private
const getBudgetStatus = async (req, res) => {
    try {
        const familyId = req.user.family;
        const budget = await budget_1.default.findOne({ family: familyId }).sort({ createdAt: -1 });
        if (!budget)
            return res.status(404).json({ message: 'No budget set' });
        // Calculate spending based on period
        const now = new Date();
        let startDate = new Date();
        if (budget.period === 'daily')
            startDate.setHours(0, 0, 0, 0);
        if (budget.period === 'weekly')
            startDate.setDate(now.getDate() - 7);
        if (budget.period === 'monthly')
            startDate.setMonth(now.getMonth() - 1);
        const expenses = await expense_1.default.find({
            family: familyId,
            date: { $gte: startDate }
        });
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = budget.limit - totalSpent;
        res.json({
            budget: budget.limit,
            period: budget.period,
            spent: totalSpent,
            remaining,
            status: remaining < 0 ? 'Exceeded' : 'Within limit'
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching budget status', error });
    }
};
exports.getBudgetStatus = getBudgetStatus;
// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private (head only)
const updateBudget = async (req, res) => {
    try {
        const updatedBudget = await budget_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBudget)
            return res.status(404).json({ message: 'Budget not found' });
        res.json(updatedBudget);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating budget', error });
    }
};
exports.updateBudget = updateBudget;
// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private (head only)
const deleteBudget = async (req, res) => {
    try {
        const deletedBudget = await budget_1.default.findByIdAndDelete(req.params.id);
        if (!deletedBudget)
            return res.status(404).json({ message: 'Budget not found' });
        res.json({ message: 'Budget deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting budget', error });
    }
};
exports.deleteBudget = deleteBudget;
//# sourceMappingURL=budgetController.js.map