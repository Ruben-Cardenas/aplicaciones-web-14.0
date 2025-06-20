import { Document, model, Schema, Types } from 'mongoose';

interface IOrderProduct {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    _id: Types.ObjectId;
    creationDate: Date;
    createdBy: string;
    total: number;
    subtotal: number;
    status: string;
    updateDate?: Date;
    products: IOrderProduct[];
}

const orderProductSchema = new Schema<IOrderProduct>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
    createdBy: { // coincide con la interfaz
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'pending' // ejemplo de valor por defecto
    },
    products: {
        type: [orderProductSchema],
        required: true,
        validate: {
            validator: (arr: IOrderProduct[]) => arr.length > 0,
            message: 'Debe contener al menos un producto',
        },
    },
    creationDate: { // coincide con la interfaz
        type: Date,
        default: Date.now,
    },
    updateDate: {
        type: Date,
    },
});

export const Order = model<IOrder>('Order', orderSchema, 'orders');
