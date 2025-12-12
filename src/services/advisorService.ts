import { IExpense } from "../models/expense";

export const getAdvice = (expenses: IExpense[]): string => {
  const foodTotal = expenses
    .filter(e => e.category === "Food")
    .reduce((sum, e) => sum + e.amount, 0);

  if (foodTotal > 5000) return "Consider reducing dining expenses this month.";
  return "Spending looks balanced.";
};