/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
    categoryId: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true, unique: true },
    priority: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    creatingDate: { type: Date, default: Date.now },
    updatingDate: { type: Date, default: Date.now }
});

export const Category = mongoose.model('Category', CategorySchema);
