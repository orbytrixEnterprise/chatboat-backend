/* eslint-disable camelcase */
import axios from 'axios';
import { AiKey, getNextSequenceValue } from '../model';
import { MongoHelperService } from '../../services';

export class AiKeyService {

    /**
     * Create a new AI API Key
     */
    async addAiKey(data: any) {
        const keyId = await getNextSequenceValue("keyId");
        const newKey = await AiKey.create({
            keyId,
            provider: data.provider,
            apiKey: data.apiKey,
            model: data.model,
            baseUrl: data.baseUrl || "",
            priority: data.priority ?? 0,
            status: data.status || "ACTIVE"
        });
        return newKey.toObject();
    }

    /**
     * Update an existing AI API Key
     */
    async updateAiKey(keyId: number, data: any) {
        const updated = await AiKey.findOneAndUpdate(
            { keyId },
            {
                $set: {
                    provider: data.provider,
                    apiKey: data.apiKey,
                    model: data.model,
                    baseUrl: data.baseUrl || "",
                    priority: data.priority ?? 0,
                    status: data.status || "ACTIVE"
                }
            },
            { returnDocument: 'after' }
        ).lean();
        return updated;
    }

    /**
     * Update Key status (ACTIVE/INACTIVE)
     */
    async updateStatus(keyId: number, status: string) {
        const updated = await AiKey.findOneAndUpdate(
            { keyId },
            { $set: { status, failCount: 0 } }, // Reset fail count when re-activating
            { returnDocument: 'after' }
        ).lean();
        return updated;
    }

    /**
     * Fetch key by numeric ID
     */
    async findById(keyId: number) {
        return AiKey.findOne({ keyId }).lean();
    }

    /**
     * Delete an AI Key
     */
    async deleteAiKey(keyId: number) {
        return AiKey.deleteOne({ keyId });
    }

    /**
     * Search AI Keys with pagination, filters and sorting
     */
    async searchAiKeys(body: any) {
        return MongoHelperService.search(
            AiKey,
            body,
            (k) => ({
                key_id: k.keyId,
                provider: k.provider,
                api_key: k.apiKey,
                model: k.model,
                base_url: k.baseUrl,
                priority: k.priority,
                status: k.status,
                fail_count: k.failCount,
                total_requests: k.totalRequests || 0,
                total_tokens: k.totalTokens || 0,
                usage_spent: k.usageSpent || "—",
                usage_limit: k.usageLimit || "—",
                rate_limit_remaining: k.rateLimitRemaining || "—",
                health_status: k.healthStatus || "HEALTHY",
                last_sync_date: k.lastSyncDate,
                last_failed_date: k.lastFailedDate,
                last_used_date: k.lastUsedDate,
                creating_date: k.creatingDate
            }),
            {
                filterFields: {
                    provider: "provider",
                    model: "model",
                    status: "status",
                    health_status: "healthStatus"
                },
                sortFields: {
                    provider: "provider",
                    model: "model",
                    priority: "priority",
                    status: "status",
                    total_requests: "totalRequests",
                    total_tokens: "totalTokens",
                    last_used_date: "lastUsedDate"
                }
            }
        );
    }

    /**
     * Live sync quota, remaining balance/limits, and health status for an AI key
     */
    async syncKeyUsage(keyId: number) {
        const key = await AiKey.findOne({ keyId });
        if (!key) {
            throw new Error("AI Key not found");
        }

        let usageSpent = key.usageSpent || "";
        let usageLimit = key.usageLimit || "";
        let rateLimitRemaining = key.rateLimitRemaining || "";
        let healthStatus = "HEALTHY";

        try {
            if (key.provider === "openrouter") {
                const res = await axios.get("https://openrouter.ai/api/v1/auth/key", {
                    headers: { Authorization: `Bearer ${key.apiKey}` },
                    timeout: 6000
                });
                const data = res.data?.data;
                if (data) {
                    if (data.usage !== undefined && data.usage !== null) {
                        usageSpent = `$${Number(data.usage).toFixed(5)}`;
                    }
                    if (data.limit !== null && data.limit !== undefined) {
                        usageLimit = `$${data.limit}`;
                    } else {
                        usageLimit = data.is_free_tier ? "Free Tier" : "Unlimited";
                    }

                    if (data.free_model_daily_requests) {
                        const { used, limit, remaining } = data.free_model_daily_requests;
                        rateLimitRemaining = `${remaining}/${limit} daily (${used} used)`;
                    }
                }
            } else if (key.provider === "groq") {
                const res = await axios.get("https://api.groq.com/openai/v1/models", {
                    headers: { Authorization: `Bearer ${key.apiKey}` },
                    timeout: 6000
                });
                if (res.headers?.["x-ratelimit-remaining-requests"]) {
                    rateLimitRemaining = `${res.headers["x-ratelimit-remaining-requests"]} / ${res.headers["x-ratelimit-limit-requests"] || "1000"} reqs`;
                }
                if (!usageLimit) {
                    usageLimit = "Rate Limited (Free Tier)";
                }
                if (!usageSpent) {
                    usageSpent = "Free ($0.00)";
                }
            } else if (key.provider === "gemini") {
                const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key.apiKey}`, {
                    timeout: 6000
                });
                if (res.status === 200) {
                    if (!usageLimit) {
                        usageLimit = "15 RPM / 1M TPM (Free)";
                    }
                    if (!usageSpent) {
                        usageSpent = "Free ($0.00)";
                    }
                    if (!rateLimitRemaining) {
                        rateLimitRemaining = "Active Quota";
                    }
                }
            } else if (key.provider === "openai") {
                await axios.get("https://api.openai.com/v1/models", {
                    headers: { Authorization: `Bearer ${key.apiKey}` },
                    timeout: 6000
                });
                if (!usageLimit) {
                    usageLimit = "Standard Tier";
                }
            } else if (key.provider === "grok") {
                await axios.get("https://api.x.ai/v1/models", {
                    headers: { Authorization: `Bearer ${key.apiKey}` },
                    timeout: 6000
                });
                if (!usageLimit) {
                    usageLimit = "xAI Tier";
                }
            }
        } catch (err: any) {
            healthStatus = "ERROR";
            if (err.response?.status === 429) {
                healthStatus = "DEGRADED";
                rateLimitRemaining = "429 Rate Limited";
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                healthStatus = "ERROR";
                rateLimitRemaining = "Invalid / Expired Key";
            }
        }

        await AiKey.updateOne(
            { keyId },
            {
                $set: {
                    usageSpent,
                    usageLimit,
                    rateLimitRemaining,
                    healthStatus,
                    lastSyncDate: new Date()
                }
            }
        );

        return AiKey.findOne({ keyId }).lean();
    }

    /**
     * Live sync quota for all registered AI keys in batch
     */
    async syncAllKeysUsage() {
        const keys = await AiKey.find({}).lean();
        const results = [];
        for (const k of keys) {
            try {
                const updated = await this.syncKeyUsage(k.keyId);
                results.push(updated);
            } catch (e: any) {
                results.push({ keyId: k.keyId, error: e.message });
            }
        }
        return results;
    }
}
