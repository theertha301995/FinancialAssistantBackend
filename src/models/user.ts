import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'head' | 'member';
  family?: mongoose.Types.ObjectId;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['head', 'member'], default: 'member' },
  family: { type: Schema.Types.ObjectId, ref: 'Family' },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

export default mongoose.model<IUser>('User', UserSchema);
