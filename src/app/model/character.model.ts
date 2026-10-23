/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, { Schema } from 'mongoose';

const CharacterSchema = new Schema({
    characterId: { type: Number, unique: true, index: true },
    name: { type: String, required: true },
    avatarImage: { type: String, default: "" },
    title: { type: String, default: "" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    greetingMessage: { type: String, default: "Hello! How can I help you today?" },
    
    // AI Parameters
    personalityPrompt: { type: String, required: true },
    temperature: { type: Number, default: 0.7 },
    maxTokens: { type: Number, default: 250 },
    exampleConversations: { type: String, default: "" },
    
    // Visibility & Sharing
    visibility: { type: String, enum: ["PUBLIC", "PRIVATE"], default: "PUBLIC", index: true },
    
    // Admin & Meta fields
    priority: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    createdBy: { type: Number, default: 0, index: true },
    creatingDate: { type: Date, default: Date.now },
    updatingDate: { type: Date, default: Date.now }
});

export const Character = mongoose.model('Character', CharacterSchema);
