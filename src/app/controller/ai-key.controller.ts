import { Controller } from './controller';
import { AiKeyService } from '../services';
import { applicationLogger, response } from '../../configs';

export class AiKeyController extends Controller {

    constructor() {
        super();
    }

    /**
     * Add a new AI API Key
     */
    async add() {
        try {
            const result = await new AiKeyService().addAiKey(this.req.body);
            return this.res.status(200).send({ status: 1, message: "AI API Key added successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("AiKeyController add", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Update an existing AI API Key
     */
    async update() {
        try {
            const { keyId } = this.req.body;
            const result = await new AiKeyService().updateAiKey(Number(keyId), this.req.body);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "AI API Key not found." });
            }
            return this.res.status(200).send({ status: 1, message: "AI API Key updated successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("AiKeyController update", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Change API Key status (ACTIVE/INACTIVE)
     */
    async changeStatus() {
        try {
            const { keyId, status } = this.req.body;
            const result = await new AiKeyService().updateStatus(Number(keyId), status);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "AI API Key not found." });
            }
            return this.res.status(200).send({ status: 1, message: "AI API Key status updated successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("AiKeyController changeStatus", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Delete an AI Key
     */
    async delete() {
        try {
            const keyId = Number(this.req.params.keyId);
            const result = await new AiKeyService().deleteAiKey(keyId);
            if (result.deletedCount === 0) {
                return this.res.status(200).send({ status: 0, message: "AI API Key not found or already deleted." });
            }
            return this.res.status(200).send({ status: 1, message: "AI API Key deleted successfully." });
        } catch (err: any) {
            applicationLogger.error("AiKeyController delete", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Select AI Key by keyId
     */
    async selectById() {
        try {
            const keyId = Number(this.req.params.keyId);
            const result = await new AiKeyService().findById(keyId);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "AI API Key not found." });
            }
            return this.res.status(200).send({ status: 1, message: "AI API Key details retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("AiKeyController selectById", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Search AI Keys with pagination, filters and sorting
     */
    async search() {
        try {
            const body = this.req.body;
            body.action = "COUNT";

            const countData = await new AiKeyService().searchAiKeys(body);
            const total = countData.length > 0 ? countData[0].count : 0;

            if (total > 0) {
                body.action = "SELECT";
                const data = await new AiKeyService().searchAiKeys(body);
                return this.res.status(200).send({ status: 1, message: "AI API Keys retrieved successfully.", data: { data, page: body.page, noOf: body.noOf, total } });
            } else {
                return this.res.status(200).send({ status: 1, message: "No AI API Keys found.", data: { data: [], page: body.page, noOf: body.noOf, total: 0 } });
            }
        } catch (err: any) {
            applicationLogger.error("AiKeyController search", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }
}
