/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, { Schema } from 'mongoose';

// ==========================================
// Purchase Detail Schema
// ==========================================
const PurchaseDetailSchema = new Schema({
    purchaseDetailId: { type: Number, unique: true, index: true },
    purchaseId: { type: Number, required: true, index: true },
    categoryId: { type: Number, required: true },
    brandId: { type: Number, required: true },
    colorId: { type: Number, required: true },
    rate: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    minimumStockQty: { type: Number, required: true },
    meter: { type: Number, required: true },
    cgstId: { type: Number, required: true },
    sgstId: { type: Number, required: true },
    igstId: { type: Number, required: true },
    remark: { type: String, default: "" },
    itemImage: { type: String, default: "" },
    status: { type: String, default: "ACTIVE" },
    createdUpdatedBy: { type: Number, default: 0 },
    creatingDate: { type: Date, default: Date.now },
    updatingDate: { type: Date, default: Date.now }
});

export const PurchaseDetail = mongoose.model('PurchaseDetail', PurchaseDetailSchema);

// ==========================================
// Purchase Payment Schema
// ==========================================
const PurchasePaymentSchema = new Schema({
    purchasePaymentId: { type: Number, unique: true, index: true },
    purchaseId: { type: Number, required: true, index: true },
    paymentModeId: { type: Number, required: true },
    amount: { type: Number, required: true },
    remark: { type: String, default: "" },
    paymentDate: { type: String, required: true },
    status: { type: String, default: "ACTIVE" },
    createdUpdatedBy: { type: Number, default: 0 },
    creatingDate: { type: Date, default: Date.now },
    updatingDate: { type: Date, default: Date.now }
});

export const PurchasePayment = mongoose.model('PurchasePayment', PurchasePaymentSchema);

// ==========================================
// Purchase Schema
// ==========================================
const PurchaseSchema = new Schema({
    purchaseId: { type: Number, unique: true, index: true },
    shopId: { type: Number, required: true },
    vendorId: { type: Number, required: true },
    purchaseNo: { type: String, unique: true, index: true },
    purchaseDate: { type: String, required: true },
    remark: { type: String, default: "" },
    total: { type: Number, default: 0 },
    totalGst: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    roundOffAmount: { type: Number, default: 0 },
    gtotal: { type: Number, default: 0 },
    status: { type: String, default: "ACTIVE" },
    createdUpdatedBy: { type: Number, default: 0 },
    creatingDate: { type: Date, default: Date.now },
    updatingDate: { type: Date, default: Date.now }
});

export const Purchase = mongoose.model('Purchase', PurchaseSchema);
