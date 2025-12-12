import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  family: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId; // Who created the expense
  recipientUser: mongoose.Types.ObjectId; // Who receives the notification (head)
  message: string;
  expenseId?: mongoose.Types.ObjectId; // Link to the expense
  date: Date;
  seen: boolean;
}

const notificationSchema = new Schema<INotification>({
  family: { 
    type: Schema.Types.ObjectId, 
    ref: 'Family', 
    required: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  recipientUser: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  expenseId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Expense' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  seen: { 
    type: Boolean, 
    default: false 
  }
});

export default mongoose.model<INotification>('Notification', notificationSchema);