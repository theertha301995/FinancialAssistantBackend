import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  family: mongoose.Types.ObjectId;
  limit: number;           // Budget amount
  period: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}

const BudgetSchema: Schema = new Schema({
  family: { type: Schema.Types.ObjectId, ref: 'Family', required: true },
  limit: { type: Number, required: true },
  period: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBudget>('Budget', BudgetSchema);