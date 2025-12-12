import { Request, Response } from 'express';
import Budget from '../models/budget';
import Expense from '../models/expense';

// @desc    Set a new budget
// @route   POST /api/budgets
// @access  Private (head only)
export const setBudget = async (req: Request, res: Response) => {
  try {
    const { limit, period } = req.body;
    const familyId = (req as any).user.family;

    const budget = await Budget.create({ family: familyId, limit, period });
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Error setting budget', error });
  }
};

// @desc    Get current budget status
// @route   GET /api/budgets
// @access  Private
export const getBudgetStatus = async (req: Request, res: Response) => {
  try {
    const familyId = (req as any).user.family;
    const budget = await Budget.findOne({ family: familyId }).sort({ createdAt: -1 });
    if (!budget) return res.status(404).json({ message: 'No budget set' });

    // Calculate spending based on period
    const now = new Date();
    let startDate = new Date();
    if (budget.period === 'daily') startDate.setHours(0, 0, 0, 0);
    if (budget.period === 'weekly') startDate.setDate(now.getDate() - 7);
    if (budget.period === 'monthly') startDate.setMonth(now.getMonth() - 1);

    const expenses = await Expense.find({
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budget status', error });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private (head only)
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBudget) return res.status(404).json({ message: 'Budget not found' });
    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Error updating budget', error });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private (head only)
export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
    if (!deletedBudget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget', error });
  }
};