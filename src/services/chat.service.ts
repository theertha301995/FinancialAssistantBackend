import Expense from '../models/expense';
import Budget from '../models/budget';
import { Intent, IntentType, ChatResponse } from '../types/chat.types';
import mongoose from 'mongoose';

export class ChatService {
  // Analyze user intent from message
  static analyzeIntent(message: string): Intent {
    const msg = message.toLowerCase().trim();

    // Today's expenses
    if (msg.match(/today|today's|todays/i)) {
      return { type: 'VIEW_TODAY_EXPENSES' };
    }

    // Recent expenses with days
    const recentMatch = msg.match(/(?:last|past|recent)\s*(\d+)?\s*(?:days?|weeks?)/i);
    if (recentMatch || msg.includes('recent')) {
      const days = recentMatch?.[1] ? parseInt(recentMatch[1]) : 7;
      return { 
        type: 'VIEW_RECENT_EXPENSES', 
        days: days * (msg.includes('week') ? 7 : 1) 
      };
    }

    // Category breakdown
    if (msg.match(/category|categories|breakdown|distribution/i)) {
      return { 
        type: 'CATEGORY_BREAKDOWN',
        period: this.extractPeriod(msg)
      };
    }

    // Total spending
    if (msg.match(/total|sum|how much.*spent/i)) {
      return { 
        type: 'TOTAL_SPENDING',
        period: this.extractPeriod(msg)
      };
    }

    // Budget status
    if (msg.match(/budget.*status|remaining.*budget|budget.*left|how.*budget/i)) {
      return { type: 'BUDGET_STATUS' };
    }

    // Budget prediction
    if (msg.match(/predict|forecast|projection|will.*spend|expect/i)) {
      return { type: 'BUDGET_PREDICTION' };
    }

    // Spending trends
    if (msg.match(/trend|pattern|analysis|insights/i)) {
      return { 
        type: 'SPENDING_TRENDS',
        period: this.extractPeriod(msg)
      };
    }

    // Top/highest expenses
    if (msg.match(/top|highest|biggest|largest/i)) {
      return { 
        type: 'TOP_EXPENSES',
        period: this.extractPeriod(msg)
      };
    }

    // Average spending
    if (msg.match(/average|avg|mean/i)) {
      return { 
        type: 'AVERAGE_SPENDING',
        period: this.extractPeriod(msg)
      };
    }

    // Compare periods
    if (msg.match(/compare|vs|versus|difference/i)) {
      return { 
        type: 'COMPARE_PERIODS',
        period: this.extractPeriod(msg)
      };
    }

    // Category specific queries
    const categoryMatch = msg.match(/(?:food|transport|shopping|bills|entertainment|health|education|other)/i);
    if (categoryMatch) {
      return {
        type: 'CATEGORY_SPECIFIC',
        category: categoryMatch[0].toLowerCase(),
        period: this.extractPeriod(msg)
      };
    }

    // Add expense (e.g., "500 for food", "spent 200 on transport")
    const expenseMatch = msg.match(/(\d+)\s*(?:for|on|spent.*on)?\s*(\w+)/i);
    if (expenseMatch) {
      return {
        type: 'ADD_EXPENSE',
        data: {
          amount: parseFloat(expenseMatch[1]),
          category: expenseMatch[2].toLowerCase(),
          description: message
        }
      };
    }

    return { type: 'UNKNOWN' };
  }

  private static extractPeriod(message: string): string {
    if (message.includes('today')) return 'today';
    if (message.includes('week') || message.includes('7 days')) return 'week';
    if (message.includes('month')) return 'month';
    if (message.includes('year')) return 'year';
    return 'month';
  }

  private static getPeriodDates(period: string): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (period.toLowerCase()) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    return { startDate, endDate };
  }

  // Process intent and get response
  static async processIntent(intent: Intent, userId: string, familyId: string): Promise<ChatResponse> {
    try {
      switch (intent.type) {
        case 'VIEW_TODAY_EXPENSES':
          return await this.getTodayExpensesResponse(userId, familyId);
        
        case 'VIEW_RECENT_EXPENSES':
          return await this.getRecentExpensesResponse(userId, familyId, intent.days!);
        
        case 'CATEGORY_BREAKDOWN':
          return await this.getCategoryBreakdownResponse(userId, familyId, intent.period!);
        
        case 'TOTAL_SPENDING':
          return await this.getTotalSpendingResponse(userId, familyId, intent.period!);
        
        case 'BUDGET_STATUS':
          return await this.getBudgetStatusResponse(familyId);
        
        case 'BUDGET_PREDICTION':
          return await this.getBudgetPredictionResponse(familyId);
        
        case 'SPENDING_TRENDS':
          return await this.getSpendingTrendsResponse(familyId, intent.period!);
        
        case 'CATEGORY_SPECIFIC':
          return await this.getCategorySpecificResponse(familyId, intent.category!, intent.period!);
        
        case 'TOP_EXPENSES':
          return await this.getTopExpensesResponse(familyId, intent.period!);
        
        case 'AVERAGE_SPENDING':
          return await this.getAverageSpendingResponse(familyId, intent.period!);
        
        case 'COMPARE_PERIODS':
          return await this.comparePeriodsResponse(familyId);
        
        case 'ADD_EXPENSE':
          return await this.addExpenseResponse(userId, familyId, intent.data);
        
        default:
          return this.getHelpResponse();
      }
    } catch (error) {
      console.error('Error processing intent:', error);
      throw error;
    }
  }

  // Response builders
  private static async getTodayExpensesResponse(userId: string, familyId: string): Promise<ChatResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expenses = await Expense.find({
      family: familyId,
      date: { $gte: today }
    }).sort({ date: -1 }).limit(20);
    
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    if (expenses.length === 0) {
      return {
        type: 'expenses_list',
        content: `No expenses recorded for today yet.`,
        data: { expenses: [], total: 0, count: 0 }
      };
    }

    const formatted = expenses
      .map(exp => `• ₹${exp.amount.toFixed(2)} - ${exp.category}${exp.description ? ` (${exp.description})` : ''}`)
      .join('\n');
    
    return {
      type: 'expenses_list',
      content: `📊 Today's Expenses\n\nTotal: ₹${total.toFixed(2)}\nCount: ${expenses.length}\n\n${formatted}`,
      data: { expenses, total, count: expenses.length }
    };
  }

  private static async getRecentExpensesResponse(userId: string, familyId: string, days: number): Promise<ChatResponse> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const expenses = await Expense.find({
      family: familyId,
      date: { $gte: startDate }
    }).sort({ date: -1 }).limit(20);
    
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    if (expenses.length === 0) {
      return {
        type: 'expenses_list',
        content: `No expenses found in the last ${days} days.`,
        data: { expenses: [], total: 0, count: 0 }
      };
    }

    const formatted = expenses
      .map(exp => `• ₹${exp.amount.toFixed(2)} - ${exp.category}${exp.description ? ` (${exp.description})` : ''}`)
      .join('\n');
    
    return {
      type: 'expenses_list',
      content: `📊 Expenses from last ${days} days\n\nTotal: ₹${total.toFixed(2)}\nCount: ${expenses.length}\n\n${formatted}`,
      data: { expenses, total, count: expenses.length }
    };
  }

  private static async getCategoryBreakdownResponse(userId: string, familyId: string, period: string): Promise<ChatResponse> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    const breakdown = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    if (breakdown.length === 0) {
      return {
        type: 'category_breakdown',
        content: `No expenses found for ${period}.`,
        data: { breakdown: [], total: 0 }
      };
    }

    const total = breakdown.reduce((sum, item) => sum + item.total, 0);
    
    const percentages = breakdown.map(item => ({
      category: item._id,
      amount: item.total,
      count: item.count,
      percentage: ((item.total / total) * 100).toFixed(1)
    }));
    
    const formatted = percentages
      .map(item => `• ${item.category}: ₹${item.amount.toFixed(2)} (${item.percentage}%) - ${item.count} transactions`)
      .join('\n');
    
    return {
      type: 'category_breakdown',
      content: `📊 Category Breakdown (${period})\n\nTotal: ₹${total.toFixed(2)}\n\n${formatted}`,
      data: { breakdown: percentages, total }
    };
  }

  private static async getTotalSpendingResponse(userId: string, familyId: string, period: string): Promise<ChatResponse> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    const result = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = result.length > 0 ? result[0].total : 0;
    const count = result.length > 0 ? result[0].count : 0;
    
    return {
      type: 'total',
      content: `💰 Total Spending (${period})\n\nAmount: ₹${total.toFixed(2)}\nTransactions: ${count}`,
      data: { total, period, count }
    };
  }

  private static async getBudgetStatusResponse(familyId: string): Promise<ChatResponse> {
    const budget = await Budget.findOne({ family: familyId }).sort({ createdAt: -1 });
    
    if (!budget) {
      return {
        type: 'budget_status',
        content: '❌ No budget set. Please set a budget to track your spending.',
        data: null
      };
    }

    // Calculate spending based on budget period
    let startDate = new Date();
    if (budget.period === 'daily') {
      startDate.setHours(0, 0, 0, 0);
    } else if (budget.period === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (budget.period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const result = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const spent = result.length > 0 ? result[0].total : 0;
    const remaining = budget.limit - spent;
    const percentUsed = ((spent / budget.limit) * 100).toFixed(1);
    
    let status = 'on track';
    let emoji = '✅';
    if (parseFloat(percentUsed) > 100) {
      status = 'over budget';
      emoji = '🚨';
    } else if (parseFloat(percentUsed) > 90) {
      status = 'critical';
      emoji = '⚠️';
    } else if (parseFloat(percentUsed) > 75) {
      status = 'warning';
      emoji = '⚡';
    }
    
    return {
      type: 'budget_status',
      content: `${emoji} Budget Status (${budget.period})\n\nBudget: ₹${budget.limit.toFixed(2)}\nSpent: ₹${spent.toFixed(2)}\nRemaining: ₹${remaining.toFixed(2)}\n\n${percentUsed}% used - ${status}`,
      data: { budget: budget.limit, spent, remaining, percentUsed, status, period: budget.period }
    };
  }

  private static async getBudgetPredictionResponse(familyId: string): Promise<ChatResponse> {
    const budget = await Budget.findOne({ family: familyId }).sort({ createdAt: -1 });
    
    // Get last 30 days average
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyAverageResult = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          dailyTotal: { $sum: '$amount' }
        }
      },
      {
        $group: {
          _id: null,
          avgDaily: { $avg: '$dailyTotal' }
        }
      }
    ]);

    const dailyAverage = dailyAverageResult.length > 0 ? dailyAverageResult[0].avgDaily : 0;

    // Get current month spending
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const currentMonthResult = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const currentSpending = currentMonthResult.length > 0 ? currentMonthResult[0].total : 0;
    
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - now.getDate();
    
    const projectedSpending = dailyAverage * daysRemaining;
    const totalProjected = currentSpending + projectedSpending;
    
    let budgetComparison = '';
    if (budget) {
      const willExceed = totalProjected > budget.limit;
      const difference = Math.abs(totalProjected - budget.limit);
      budgetComparison = `\n\nYour ${budget.period} budget: ₹${budget.limit.toFixed(2)}\n${
        willExceed 
          ? `⚠️ May exceed by ₹${difference.toFixed(2)}` 
          : `✅ Should stay within budget (₹${difference.toFixed(2)} buffer)`
      }`;
    }
    
    return {
      type: 'prediction',
      content: `📈 Spending Prediction\n\nDaily average: ₹${dailyAverage.toFixed(2)}\nCurrent month: ₹${currentSpending.toFixed(2)}\nProjected total: ₹${totalProjected.toFixed(2)}\nDays remaining: ${daysRemaining}${budgetComparison}`,
      data: { dailyAverage, projectedSpending, totalProjected, currentSpending }
    };
  }

  private static async getSpendingTrendsResponse(familyId: string, period: string): Promise<ChatResponse> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    const breakdown = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    if (breakdown.length === 0) {
      return {
        type: 'trends',
        content: `No spending data available for ${period}`,
        data: null
      };
    }

    const total = breakdown.reduce((sum, item) => sum + item.total, 0);
    const topCategory = breakdown[0];
    
    // Calculate daily average
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyAverage = total / days;
    
    return {
      type: 'trends',
      content: `📈 Spending Trends (${period})\n\nTotal: ₹${total.toFixed(2)}\nDaily avg: ₹${dailyAverage.toFixed(2)}\n\nTop category: ${topCategory._id}\n  Amount: ₹${topCategory.total.toFixed(2)}\n  Count: ${topCategory.count} transactions`,
      data: { 
        topCategory: topCategory._id, 
        topCategoryAmount: topCategory.total,
        total,
        dailyAverage 
      }
    };
  }

  private static async getCategorySpecificResponse(familyId: string, category: string, period: string): Promise<ChatResponse> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    const expenses = await Expense.find({
      family: familyId,
      category: new RegExp(`^${category}$`, 'i'),
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 }).limit(10);
    
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const average = expenses.length > 0 ? total / expenses.length : 0;
    
    const formatted = expenses.length > 0 
      ? '\n\nRecent transactions:\n' + expenses
          .map(exp => `• ₹${exp.amount.toFixed(2)} - ${exp.description || 'No description'}`)
          .join('\n')
      : '';
    
    return {
      type: 'category_specific',
      content: `📊 ${category.charAt(0).toUpperCase() + category.slice(1)} Expenses (${period})\n\nTotal: ₹${total.toFixed(2)}\nTransactions: ${expenses.length}\nAverage: ₹${average.toFixed(2)}${formatted}`,
      data: { category, total, count: expenses.length, average, expenses }
    };
  }

  private static async getTopExpensesResponse(familyId: string, period: string): Promise<ChatResponse> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    const expenses = await Expense.find({
      family: familyId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ amount: -1 }).limit(10);
    
    if (expenses.length === 0) {
      return {
        type: 'top_expenses',
        content: `No expenses found for ${period}.`,
        data: { expenses: [] }
      };
    }

    const formatted = expenses
      .map((exp, idx) => `${idx + 1}. ₹${exp.amount.toFixed(2)} - ${exp.category}${exp.description ? ` (${exp.description})` : ''}`)
      .join('\n');
    
    return {
      type: 'top_expenses',
      content: `🏆 Top Expenses (${period})\n\n${formatted}`,
      data: { expenses }
    };
  }

  private static async getAverageSpendingResponse(familyId: string, period: string): Promise<ChatResponse> {
    const { startDate, endDate } = this.getPeriodDates(period);
    
    const result = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avg: { $avg: '$amount' }
        }
      }
    ]);
    
    if (result.length === 0) {
      return {
        type: 'average',
        content: `No expenses found for ${period}.`,
        data: null
      };
    }

    const { total, count, avg } = result[0];
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyAverage = total / days;
    
    return {
      type: 'average',
      content: `📊 Average Spending (${period})\n\nPer transaction: ₹${avg.toFixed(2)}\nPer day: ₹${dailyAverage.toFixed(2)}\nTotal: ₹${total.toFixed(2)}\nTransactions: ${count}`,
      data: { perTransaction: avg, perDay: dailyAverage, total, count }
    };
  }

  private static async comparePeriodsResponse(familyId: string): Promise<ChatResponse> {
    const now = new Date();
    
    // This month
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthResult = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: thisMonthStart }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthResult = await Expense.aggregate([
      {
        $match: {
          family: new mongoose.Types.ObjectId(familyId),
          date: { $gte: lastMonthStart, $lte: lastMonthEnd }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const thisMonth = thisMonthResult.length > 0 ? thisMonthResult[0].total : 0;
    const lastMonth = lastMonthResult.length > 0 ? lastMonthResult[0].total : 0;
    const difference = thisMonth - lastMonth;
    const percentChange = lastMonth > 0 ? ((difference / lastMonth) * 100).toFixed(1) : '0';
    
    const comparison = difference > 0 ? '📈 increased' : difference < 0 ? '📉 decreased' : '➡️ same';
    
    return {
      type: 'comparison',
      content: `📊 Month Comparison\n\nThis month: ₹${thisMonth.toFixed(2)}\nLast month: ₹${lastMonth.toFixed(2)}\n\nDifference: ₹${Math.abs(difference).toFixed(2)} (${percentChange}%)\n${comparison}`,
      data: { thisMonth, lastMonth, difference, percentChange }
    };
  }

  private static async addExpenseResponse(userId: string, familyId: string, data: any): Promise<ChatResponse> {
    const expense = await Expense.create({
      user: userId,
      family: familyId,
      amount: data.amount,
      category: data.category,
      description: data.description || `${data.amount} for ${data.category}`,
      date: new Date()
    });
    
    return {
      type: 'expense_added',
      content: `✅ Added expense\n\nAmount: ₹${data.amount.toFixed(2)}\nCategory: ${data.category}`,
      data: expense
    };
  }

  private static getHelpResponse(): ChatResponse {
    return {
      type: 'help',
      content: `👋 I can help you with:\n\n📊 View expenses:\n  • "show today's expenses"\n  • "last 7 days"\n  • "recent expenses"\n\n💰 Budget info:\n  • "budget status"\n  • "predict spending"\n\n📈 Analytics:\n  • "category breakdown"\n  • "spending trends"\n  • "top expenses"\n  • "compare this month vs last"\n\n➕ Add expense:\n  • "500 for food"\n  • "200 on transport"\n\nWhat would you like to know?`,
      data: null
    };
  }
}