/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    userId: { type: Number, unique: true, index: true },
    adminId: { type: Number, default: 0, index: true },
    name: { type: String, required: true },
    emailId: { type: String, required: true, index: true },
    mobileNo: { type: String, required: true, index: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    address: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    status: { type: String, default: "ACTIVE" },
    createdUpdatedBy: { type: Number, default: 0 },
    creatingDate: { type: Date, default: Date.now },
    updatingDate: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
