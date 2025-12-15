import mongoose, { Document } from 'mongoose';
export interface IFamily extends Document {
    name: string;
    head: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    inviteCode: string;
    createdAt: Date;
}
declare const _default: mongoose.Model<IFamily, {}, {}, {}, mongoose.Document<unknown, {}, IFamily, {}, mongoose.DefaultSchemaOptions> & IFamily & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IFamily>;
export default _default;
