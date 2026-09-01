/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    userId: { type: Number, unique: true, index: true },
    guestId: { type: String, unique: true, sparse: true, index: true },
    googleId: { type: String, unique: true, sparse: true, index: true },
    appleId: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, default: "" },
    emailId: { type: String, index: true, default: "" },
    mobileNo: { type: String, index: true, default: "" },
    password: { type: String, default: "" },
    userType: { type: String, enum: ["ADMIN", "USER"], default: "USER" },
    address: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    createdUpdatedBy: { type: Number, default: 0 },
    creatingDate: { type: Date, default: Date.now },
    updatingDate: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);
