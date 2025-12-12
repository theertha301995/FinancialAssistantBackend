import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  description: string;
  amount: number;
  category: string;
  date: Date;
  user: mongoose.Types.ObjectId;
  family: mongoose.Types.ObjectId;
}

const ExpenseSchema: Schema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  family: { type: Schema.Types.ObjectId, ref: 'Family', required: true }
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);