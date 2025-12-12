import { Request, Response } from "express";
import Expense from "../models/expense";
import Notification from "../models/notification";
import { categorizeExpense } from "../services/nlpService";
import { translateText } from "../services/transalationService";
import { getAdvice } from "../services/advisorService";
import { forecastSpending } from "../services/forecastService";
import user from "../models/user";
export const addExpense = async (req: Request, res: Response) => {
  try {
    const { description, amount, category, lang } = req.body;
    const currentUser = (req as any).user;

    // 1️⃣ AI categorization
    let finalCategory = category || await categorizeExpense(description);

    // 2️⃣ Save expense
    const expense = await Expense.create({
      description,
      amount,
      category: finalCategory,
      user: currentUser.id,
      family: currentUser.family
    });

    // 3️⃣ Family total
    const expenses = await Expense.find({ family: currentUser.family });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 4️⃣ AI advice + forecast
    const advice = getAdvice(expenses);
    const forecast = forecastSpending(expenses);

    // 5️⃣ Prepare notification message
    const memberName = currentUser.name || "A family member";
    let responseMessage = `${memberName} added ₹${amount} to ${finalCategory}. Family total: ₹${total}. ${advice}`;
    
    // Translate if language specified
    if (lang) {
      responseMessage = await translateText(responseMessage, lang);
    }

    // 6️⃣ Find family head and notify them (only if current user is NOT the head)
    const familyHead = await user.findOne({ 
      family: currentUser.family, 
      role: 'head' 
    });

    if (familyHead && familyHead._id.toString() !== currentUser.id) {
      // Only notify if the person adding expense is not the head themselves
      await Notification.create({
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
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error });
  }
};


// @desc    Get all expenses for logged-in user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({ user: (req as any).user.id });
    res.json(expenses);
    
    // ❌ REMOVE THIS - It's test/debug code left in production
    // const message = await translateText("Added ₹500 to Food", "ml");
    // console.log(message);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
};

// @desc    Get family expenses
// @route   GET /api/expenses/family
// @access  Private
export const getFamilyExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find({ family: (req as any).user.family }).populate('user', 'name');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching family expenses', error });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.user.toString() !== (req as any).user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.user.toString() !== (req as any).user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
};