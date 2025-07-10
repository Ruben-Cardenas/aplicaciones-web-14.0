import { Document, model, Schema, Types } from 'mongoose';

export interface IRole extends Document {
    _id: Types.ObjectId;
    type: string;
    name: string;
    creationDate: Date;
    status: string;
    updateDate: Date;
}

const roleSchema = new Schema<IRole>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    status: { type: String, required: true },
    updateDate: { type: Date }
});

export const Role = model<IRole>('Role', roleSchema, 'roles');
