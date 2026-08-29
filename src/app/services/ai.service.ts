/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import { AiKey } from '../model';
import { applicationLogger } from '../../configs';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export class AIService {

    /**
     * Sends messages to the available AI models, automatically failing over to backup keys/providers if one fails.
     */
    async chat(messages: ChatMessage[]): Promise<string> {
        // 1. Fetch active keys ordered by priority (lower number first)
        const keys = await AiKey.find({ status: "ACTIVE" })
            .sort({ priority: 1, failCount: 1 })
            .lean();

        // 2. If no keys in DB, use environment variables as a temporary default fallback
        if (keys.length === 0) {
            const envKeys = [];
            if (process.env.GROK_API_KEY) {
                envKeys.push({ provider: "grok", apiKey: process.env.GROK_API_KEY, model: "grok-beta" });
            }
            if (process.env.OPENAI_API_KEY) {
                envKeys.push({ provider: "openai", apiKey: process.env.OPENAI_API_KEY, model: "gpt-4o-mini" });
            }
            if (process.env.GEMINI_API_KEY) {
                envKeys.push({ provider: "gemini", apiKey: process.env.GEMINI_API_KEY, model: "gemini-1.5-flash" });
            }

            if (envKeys.length === 0) {
                throw new Error("No active AI API keys configured in the database or environment.");
            }

            for (const keyConfig of envKeys) {
                try {
                    return await this.executeChatRequest(keyConfig, messages);
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

        // 3. Loop through database keys and try to request
        for (const keyConfig of keys) {
            try {
                const responseText = await this.executeChatRequest(keyConfig, messages);

                // Update last used date and reset fail count upon success
                await AiKey.updateOne(
                    { _id: keyConfig._id },
                    { $set: { lastUsedDate: new Date(), failCount: 0 } }
                );

                return responseText;
            } catch (err: any) {
                applicationLogger.error("AIService failed key", {
                    provider: keyConfig.provider,
                    model: keyConfig.model,
                    error: err.response?.data || err.message
                });

                // Increment fail count. If it fails 5 times, deactivate it.
                const nextFailCount = (keyConfig.failCount || 0) + 1;
                const statusUpdate = nextFailCount >= 5 ? "INACTIVE" : "ACTIVE";

                await AiKey.updateOne(
                    { _id: keyConfig._id },
                    {
                        $set: {
                            failCount: nextFailCount,
                            status: statusUpdate,
                            lastFailedDate: new Date()
                        }
                    }
                );
            }
        }

        throw new Error("All configured database AI API keys failed to return a response.");
    }

    /**
     * Executes API call for specific provider and model.
     */
    private async executeChatRequest(keyConfig: any, messages: ChatMessage[]): Promise<string> {
        const { provider, apiKey, model, baseUrl } = keyConfig;

        if (provider === "grok" || provider === "openai") {
            const url = baseUrl || (provider === "grok" ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions");

            const response = await axios.post(url, {
                model: model,
                messages: messages
            }, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                timeout: 30000 // 30s timeout
            });

            return response.data?.choices?.[0]?.message?.content || "";
        }

        else if (provider === "gemini") {
            const url = baseUrl || `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

            const contents = messages.map(msg => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }]
            }));

            const response = await axios.post(url, {
                contents: contents
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 30000
            });

            return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }

        else if (provider === "claude") {
            const url = baseUrl || "https://api.anthropic.com/v1/messages";
            const systemMessage = messages.find(m => m.role === "system")?.content;
            const userAssistantMessages = messages.filter(m => m.role !== "system").map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await axios.post(url, {
                model: model,
                max_tokens: 4096,
                system: systemMessage,
                messages: userAssistantMessages
            }, {
                headers: {
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                },
                timeout: 30000
            });

            return response.data?.content?.[0]?.text || "";
        }

        throw new Error(`Unsupported AI provider: ${provider}`);
    }
}
