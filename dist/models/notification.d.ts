import mongoose, { Document } from 'mongoose';
export interface INotification extends Document {
    family: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    recipientUser: mongoose.Types.ObjectId;
    message: string;
    expenseId?: mongoose.Types.ObjectId;
    date: Date;
    seen: boolean;
}
declare const _default: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, mongoose.DefaultSchemaOptions> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, INotification>;
export default _default;
