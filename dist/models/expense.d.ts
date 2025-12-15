import mongoose, { Document } from 'mongoose';
export interface IExpense extends Document {
    description: string;
    amount: number;
    category: string;
    date: Date;
    user: mongoose.Types.ObjectId;
    family: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<IExpense, {}, {}, {}, mongoose.Document<unknown, {}, IExpense, {}, mongoose.DefaultSchemaOptions> & IExpense & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IExpense>;
export default _default;
