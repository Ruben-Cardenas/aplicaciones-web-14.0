import mongoose from "mongoose";

export interface Menu extends Document {
    title: string;
    path: string;
    icon: string;
    roles: string[];
}

const menuSchema = new mongoose.Schema<Menu>({
    title: { type: String, required: true },
    path: { type: String, required: true },
    icon: { type: String, required: true },
    roles: { type: [String], required: true }
});

export const MenuModel = mongoose.model<Menu>('Menu', menuSchema);