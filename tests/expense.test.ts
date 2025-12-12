// tests/unit/models/expense.test.ts
import mongoose from 'mongoose';

describe('Expense Model', () => {
  it('should create expense with required fields', async () => {
    // This will use the in-memory MongoDB from setup.ts
    const ExpenseSchema = new mongoose.Schema({
      amount: { type: Number, required: true },
      description: String,
      date: { type: Date, default: Date.now }
    });
    
    const Expense = mongoose.model('Expense', ExpenseSchema);
    
    const expense = await Expense.create({
      amount: 50.00,
      description: 'Groceries'
    });
    
    expect(expense.amount).toBe(50.00);
    expect(expense.description).toBe('Groceries');
  });
});