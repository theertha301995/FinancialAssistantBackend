import mongoose, { Document } from 'mongoose';
export interface IBudget extends Document {
    family: mongoose.Types.ObjectId;
    limit: number;
    period: 'daily' | 'weekly' | 'monthly';
    createdAt: Date;
}
declare const _default: mongoose.Model<IBudget, {}, {}, {}, mongoose.Document<unknown, {}, IBudget, {}, mongoose.DefaultSchemaOptions> & IBudget & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IBudget>;
export default _default;
