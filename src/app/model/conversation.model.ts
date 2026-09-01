/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, { Schema } from 'mongoose';

const ConversationSchema = new Schema({
    conversationId: { type: Number, unique: true, index: true },
    userId: { type: Number, required: true, index: true },
    characterId: { type: Schema.Types.ObjectId, ref: 'Character', required: true, index: true },
    title: { type: String, default: "New Chat" },
    userMemories: [{ type: String }],
    summary: { type: String, default: "" },
    lastMessage: { type: String, default: "" },
    lastMessageDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["ACTIVE", "ARCHIVED"], default: "ACTIVE" },
    creatingDate: { type: Date, default: Date.now },
    updatingDate: { type: Date, default: Date.now }
});

export const Conversation = mongoose.model('Conversation', ConversationSchema);
