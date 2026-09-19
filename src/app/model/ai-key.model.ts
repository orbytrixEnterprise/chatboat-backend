/* eslint-disable @typescript-eslint/naming-convention */
import mongoose, { Schema } from 'mongoose';

const AiKeySchema = new Schema({
    keyId: { type: Number, unique: true, index: true },
    provider: { type: String, enum: ["grok", "openai", "gemini", "claude", "openrouter", "groq"], required: true },
    apiKey: { type: String, required: true },
    model: { type: String, required: true }, // e.g. "grok-beta", "gpt-4o-mini", "gemini-1.5-flash"
    baseUrl: { type: String }, // Optional override for custom API proxies / gateways
    priority: { type: Number, default: 0 }, // Lower priority number is tried first
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    failCount: { type: Number, default: 0 },
    lastFailedDate: { type: Date },
    lastUsedDate: { type: Date },
    
    // Usage & Monitoring Telemetry
    totalRequests: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
    usageSpent: { type: String, default: "" },
    usageLimit: { type: String, default: "" },
    rateLimitRemaining: { type: String, default: "" },
    healthStatus: { type: String, enum: ["HEALTHY", "WARNING", "DEGRADED", "ERROR"], default: "HEALTHY" },
    lastSyncDate: { type: Date },
    
    creatingDate: { type: Date, default: Date.now }
});

export const AiKey = mongoose.model('AiKey', AiKeySchema);
