import { IExpense } from "../models/expense";

export const forecastSpending = (expenses: IExpense[]): string => {
  if (expenses.length === 0) return "No data to forecast.";
  const avg = expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;
  return `Expected spending next week: ₹${Math.round(avg * 7)}`;
};