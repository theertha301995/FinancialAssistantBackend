import mongoose, { Schema, Document } from 'mongoose';

export interface IFamily extends Document {
  name: string;
  head: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  inviteCode: string; // Add this
  createdAt: Date;
}

const FamilySchema: Schema = new Schema({
  name: { type: String, required: true },
  head: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  inviteCode: { type: String, unique: true, required: true },
}, { timestamps: true });

export default mongoose.model<IFamily>('Family', FamilySchema);