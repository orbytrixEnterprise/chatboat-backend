/* eslint-disable camelcase */
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
                last_failed_date: k.lastFailedDate,
                last_used_date: k.lastUsedDate,
                creating_date: k.creatingDate
            }),
            {
                filterFields: {
                    provider: "provider",
                    model: "model",
                    status: "status"
                },
                sortFields: {
                    provider: "provider",
                    model: "model",
                    priority: "priority",
                    status: "status"
                }
            }
        );
    }
}
