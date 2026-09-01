/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, { Schema } from 'mongoose';

const ChatMessageSchema = new Schema({
    messageId: { type: Number, unique: true, index: true },
    conversationId: { type: Number, required: true, index: true },
    userId: { type: Number, required: true, index: true },
    characterId: { type: Schema.Types.ObjectId, ref: 'Character', index: true },
    sender: { type: String, enum: ["USER", "CHARACTER"], required: true },
    content: { type: String, required: true },
    creatingDate: { type: Date, default: Date.now }
});

export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
