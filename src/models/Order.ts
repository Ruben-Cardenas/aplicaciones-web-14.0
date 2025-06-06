import { Document, model, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
    _id: Types.ObjectId;
    creationDate: Date;
    createdBy: string;
    total: number;
    subtotal: number;
    status: string;
    updateDate: Date;
}

const orderSchema = new Schema<IOrder>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    creationDate: { type: Date, default: Date.now },
    createdBy: { type: String, required: true }, 
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    status: { type: String, required: true },
    updateDate: { type: Date }
});

export const Order = model<IOrder>('Order', orderSchema, 'orders');
