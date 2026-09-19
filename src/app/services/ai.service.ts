/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import { AiKey } from '../model';
import { applicationLogger } from '../../configs';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ExecutionResult {
    text: string;
    tokens: number;
    rateLimitRemaining?: string;
}

// In-flight active requests tracker per key (Least Connections algorithm)
const inFlightRequests = new Map<string, number>();

// Adaptive cooldown tracker for rate-limited (HTTP 429) keys (keyId -> cooldownExpiresAt timestamp)
const rateLimitCooldowns = new Map<string, number>();

// Global round-robin sequence counter for tie-breaking
let roundRobinCounter = 0;

export class AIService {

    /**
     * Smart Load Balancing & Routing Engine:
     * 1. Active Cooldown Detection: Keys that hit 429 rate limits are temporarily deprioritized until their cooldown expires.
     * 2. Health Status: HEALTHY keys are prioritized over DEGRADED or WARNING keys.
     * 3. Priority Tier: Lower priority number keys are prioritized.
     * 4. In-Flight Concurrency (Least Connections): Traffic is distributed to keys with fewer ongoing chat requests so users get ultra-fast parallel responses.
     * 5. Fail Count: Keys with lower fail rates are preferred.
     * 6. Round-Robin Offset: Evenly distributes requests among equivalent keys.
     */
    private sortKeysByLoadAndPriority(keys: any[]): any[] {
        const now = Date.now();

        return [...keys].sort((a, b) => {
            const aKey = a.keyId?.toString() || a._id?.toString();
            const bKey = b.keyId?.toString() || b._id?.toString();

            // 1. Rate Limit Cooldown (if cooling down, push to bottom)
            const aCooldown = (rateLimitCooldowns.get(aKey) || 0) > now;
            const bCooldown = (rateLimitCooldowns.get(bKey) || 0) > now;
            if (aCooldown !== bCooldown) {
                return aCooldown ? 1 : -1;
            }

            // 2. Health status rank
            const healthRank: Record<string, number> = { HEALTHY: 0, WARNING: 1, DEGRADED: 2, ERROR: 3 };
            const aHealth = healthRank[a.healthStatus || "HEALTHY"] ?? 0;
            const bHealth = healthRank[b.healthStatus || "HEALTHY"] ?? 0;
            if (aHealth !== bHealth) {
                return aHealth - bHealth;
            }

            // 3. Priority tier (0, 1, 2...)
            const aPriority = a.priority ?? 0;
            const bPriority = b.priority ?? 0;
            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }

            // 4. In-flight active load (Least Connections - gives fastest response to waiting users)
            const aInFlight = inFlightRequests.get(aKey) || 0;
            const bInFlight = inFlightRequests.get(bKey) || 0;
            if (aInFlight !== bInFlight) {
                return aInFlight - bInFlight;
            }

            // 5. Fail count
            const aFails = a.failCount || 0;
            const bFails = b.failCount || 0;
            if (aFails !== bFails) {
                return aFails - bFails;
            }

            // 6. Round-Robin tie-breaker
            return ((roundRobinCounter++) % 2 === 0) ? -1 : 1;
        });
    }

    /**
     * Sends messages to the available AI models with smart load balancing and dynamic failover.
     */
    async chat(messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<string> {
        // 1. Fetch active keys from database
        const rawKeys = await AiKey.find({ status: "ACTIVE" }).lean();

        // 2. If no keys in DB, use environment variables as a temporary default fallback
        if (rawKeys.length === 0) {
            const envKeys = [];
            if (process.env.GROK_API_KEY) {
                envKeys.push({ provider: "grok", apiKey: process.env.GROK_API_KEY, model: "grok-beta" });
            }
            if (process.env.OPENAI_API_KEY) {
                envKeys.push({ provider: "openai", apiKey: process.env.OPENAI_API_KEY, model: "gpt-4o-mini" });
            }
            if (process.env.GEMINI_API_KEY) {
                envKeys.push({ provider: "gemini", apiKey: process.env.GEMINI_API_KEY, model: "gemini-3.5-flash" });
            }

            if (envKeys.length === 0) {
                throw new Error("No active AI API keys configured in the database or environment.");
            }

            for (const keyConfig of envKeys) {
                try {
                    const result = await this.executeChatRequest(keyConfig, messages, options);
                    return result.text;
                } catch (err: any) {
                    applicationLogger.error("AIService failed fallback env key", {
                        provider: keyConfig.provider,
                        model: keyConfig.model,
                        error: err.message
                    });
                }
            }
            throw new Error("All fallback environment keys failed to return a response.");
        }

        // 3. Load-balance candidate keys based on real-time load, priority, and rate-limit cooldown
        const balancedKeys = this.sortKeysByLoadAndPriority(rawKeys);

        // 4. Try candidate keys in load-balanced order with instant failover
        for (const keyConfig of balancedKeys) {
            const keyIdentifier = keyConfig.keyId?.toString() || keyConfig._id?.toString();

            // Track in-flight concurrency for this key
            const currentInFlight = inFlightRequests.get(keyIdentifier) || 0;
            inFlightRequests.set(keyIdentifier, currentInFlight + 1);

            try {
                applicationLogger.info("AIService dispatching to key", {
                    provider: keyConfig.provider,
                    model: keyConfig.model,
                    keyId: keyConfig.keyId,
                    inFlight: currentInFlight + 1
                });

                const { text, tokens, rateLimitRemaining } = await this.executeChatRequest(keyConfig, messages, options);

                // Clear cooldown on success
                rateLimitCooldowns.delete(keyIdentifier);

                const updatePayload: any = {
                    lastUsedDate: new Date(),
                    failCount: 0,
                    healthStatus: "HEALTHY"
                };
                if (rateLimitRemaining) {
                    updatePayload.rateLimitRemaining = rateLimitRemaining;
                }

                // Update metrics in background
                AiKey.updateOne(
                    { _id: keyConfig._id },
                    {
                        $inc: { totalRequests: 1, totalTokens: tokens || 0 },
                        $set: updatePayload
                    }
                ).catch((e: any) => applicationLogger.error("AiKey update error", { error: e.message }));

                return text;
            } catch (err: any) {
                const isRateLimit = err.response?.status === 429;
                const nextFailCount = (keyConfig.failCount || 0) + 1;

                if (isRateLimit) {
                    // Set 45-second adaptive cooldown so next user chats are routed to other available keys immediately
                    rateLimitCooldowns.set(keyIdentifier, Date.now() + 45000);
                    applicationLogger.warn("AIService Key Rate-Limited (429), dynamic load balancer shifting to next provider...", {
                        provider: keyConfig.provider,
                        keyId: keyConfig.keyId
                    });
                } else {
                    applicationLogger.error("AIService Key Failed, failing over to next available provider...", {
                        provider: keyConfig.provider,
                        model: keyConfig.model,
                        error: err.response?.data || err.message
                    });
                }

                const statusUpdate = nextFailCount >= 5 ? "INACTIVE" : "ACTIVE";
                const health = isRateLimit ? "DEGRADED" : (nextFailCount >= 3 ? "ERROR" : "WARNING");

                AiKey.updateOne(
                    { _id: keyConfig._id },
                    {
                        $set: {
                            failCount: nextFailCount,
                            status: statusUpdate,
                            healthStatus: health,
                            lastFailedDate: new Date(),
                            ...(isRateLimit ? { rateLimitRemaining: "429 Rate Limited" } : {})
                        }
                    }
                ).catch((e: any) => applicationLogger.error("AiKey fail update error", { error: e.message }));
            } finally {
                // Decrement in-flight count
                const active = inFlightRequests.get(keyIdentifier) || 1;
                inFlightRequests.set(keyIdentifier, Math.max(0, active - 1));
            }
        }

        throw new Error("All configured database AI API keys failed to return a response.");
    }

    /**
     * Executes API call for specific provider and model.
     */
    private async executeChatRequest(keyConfig: any, messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<ExecutionResult> {
        const { provider, apiKey, model, baseUrl } = keyConfig;

        if (provider === "grok" || provider === "openai" || provider === "openrouter" || provider === "groq") {
            let defaultUrl = "https://api.openai.com/v1/chat/completions";
            if (provider === "grok") {
                defaultUrl = "https://api.x.ai/v1/chat/completions";
            } else if (provider === "openrouter") {
                defaultUrl = "https://openrouter.ai/api/v1/chat/completions";
            } else if (provider === "groq") {
                defaultUrl = "https://api.groq.com/openai/v1/chat/completions";
            }

            const url = baseUrl || defaultUrl;

            const headers: any = {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            };
            if (provider === "openrouter") {
                headers["HTTP-Referer"] = "https://chatboat.ai";
                headers["X-Title"] = "Chatboat AI";
            }

            const payload: any = {
                model: model,
                messages: messages
            };
            if (options?.temperature !== undefined) {
                payload.temperature = options.temperature;
            }
            if (options?.maxTokens !== undefined) {
                payload.max_tokens = options.maxTokens;
            }

            const response = await axios.post(url, payload, {
                headers,
                timeout: 10000 // 10s timeout for fast failover
            });

            const text = response.data?.choices?.[0]?.message?.content || "";
            const tokens = response.data?.usage?.total_tokens || 0;

            let rateLimitRemaining: string | undefined;
            if (response.headers?.["x-ratelimit-remaining-requests"]) {
                rateLimitRemaining = `${response.headers["x-ratelimit-remaining-requests"]} / ${response.headers["x-ratelimit-limit-requests"] || "1000"} reqs`;
            }

            return { text, tokens, rateLimitRemaining };
        }

        else if (provider === "gemini") {
            const cleanModel = model.startsWith("models/") ? model.replace(/^models\//, "") : model;
            const url = baseUrl || `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

            const systemMsg = messages.find(m => m.role === "system");
            const conversationMsgs = messages.filter(m => m.role !== "system");

            const contents = conversationMsgs.map(msg => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            }));

            const payload: any = {
                contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "Hello" }] }]
            };

            if (systemMsg && systemMsg.content) {
                payload.systemInstruction = {
                    parts: [{ text: systemMsg.content }]
                };
            }

            if (options?.temperature !== undefined || options?.maxTokens !== undefined) {
                payload.generationConfig = {};
                if (options?.temperature !== undefined) {
                    payload.generationConfig.temperature = options.temperature;
                }
                if (options?.maxTokens !== undefined) {
                    payload.generationConfig.maxOutputTokens = options.maxTokens;
                }
            }

            const response = await axios.post(url, payload, {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 10000
            });

            const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const tokens = response.data?.usageMetadata?.totalTokenCount || 0;

            return { text, tokens };
        }

        else if (provider === "claude") {
            const url = baseUrl || "https://api.anthropic.com/v1/messages";
            const systemMessage = messages.find(m => m.role === "system")?.content;
            const userAssistantMessages = messages.filter(m => m.role !== "system").map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const payload: any = {
                model: model,
                max_tokens: options?.maxTokens || 4096,
                system: systemMessage,
                messages: userAssistantMessages
            };
            if (options?.temperature !== undefined) {
                payload.temperature = options.temperature;
            }

            const response = await axios.post(url, payload, {
                headers: {
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                },
                timeout: 10000
            });

            const text = response.data?.content?.[0]?.text || "";
            const tokens = (response.data?.usage?.input_tokens || 0) + (response.data?.usage?.output_tokens || 0);

            return { text, tokens };
        }

        throw new Error(`Unsupported AI provider: ${provider}`);
    }
}
