import { Document, model, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
    _id: Types.ObjectId;
    name: string;
    price: number;
    status: boolean;
    description: string;
    quantity: number;
}

const productSchema = new Schema<IProduct>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true }
});

export const Product = model<IProduct>('Product', productSchema);
