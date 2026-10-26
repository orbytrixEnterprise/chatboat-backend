import { Controller } from './controller';
import { ChatService } from '../services';
import { applicationLogger, Global, response } from '../../configs';

export class ChatController extends Controller {

    constructor() {
        super();
    }

    /**
     * Start a new chat or retrieve existing conversation with a character
     */
    async startOrGet() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const { characterId } = this.req.body;

            const result: any = await new ChatService().startOrGetConversation(userId, characterId);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Character not found." });
            }
            if (result.permissionDenied) {
                return this.res.status(200).send({ status: 0, message: "This character is private to its creator." });
            }
            return this.res.status(200).send({ status: 1, message: "Conversation ready.", data: result });
        } catch (err: any) {
            applicationLogger.error("ChatController startOrGet", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Send user message and get AI response with long-term memory
     */
    async sendMessage() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const { conversationId, message } = this.req.body;

            const result = await new ChatService().sendMessage(userId, Number(conversationId), message);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Conversation or character not found." });
            }
            return this.res.status(200).send({ status: 1, message: "Message sent and response generated.", data: result });
        } catch (err: any) {
            applicationLogger.error("ChatController sendMessage", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Get active conversations for the authenticated user
     */
    async getConversations() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const page = this.req.body.page !== undefined ? Number(this.req.body.page) : 1;
            const noOf = this.req.body.noOf !== undefined ? Number(this.req.body.noOf) : 10;
            const { search } = this.req.body;

            const result = await new ChatService().getConversations(userId, page, noOf, search);
            return this.res.status(200).send({ status: 1, message: "Conversations retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("ChatController getConversations", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Get unique characters the user has actively chatted with
     */
    async myCharacters() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const page = this.req.body.page !== undefined ? Number(this.req.body.page) : 1;
            const noOf = this.req.body.noOf !== undefined ? Number(this.req.body.noOf) : 20;
            const { search } = this.req.body;

            const result = await new ChatService().getMyChattedCharacters(userId, page, noOf, search);
            return this.res.status(200).send({ status: 1, message: "Chatted characters retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("ChatController myCharacters", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Get chat message history for a conversation
     */
    async getHistory() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const conversationId = Number(this.req.params.conversationId);
            const page = this.req.query.page !== undefined ? Number(this.req.query.page) : 1;
            const noOf = this.req.query.noOf !== undefined ? Number(this.req.query.noOf) : 30;

            const result = await new ChatService().getHistory(userId, conversationId, page, noOf);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Conversation not found." });
            }
            return this.res.status(200).send({ status: 1, message: "Chat history retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("ChatController getHistory", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Clear all chat messages and reset memories for a conversation
     */
    async clear() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const conversationId = Number(this.req.params.conversationId);

            const success = await new ChatService().clearConversation(userId, conversationId);
            if (!success) {
                return this.res.status(200).send({ status: 0, message: "Conversation not found." });
            }
            return this.res.status(200).send({ status: 1, message: "Conversation cleared successfully." });
        } catch (err: any) {
            applicationLogger.error("ChatController clear", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Admin: Get unique characters a specified user has chatted with
     */
    async userChattedCharacters() {
        try {
            const role = await Global.getTokenValue(this.req, "role");
            if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
                return this.res.status(200).send({ status: 0, message: "Unauthorized. Admin access required." });
            }
            const { userId, search = "" } = this.req.body;
            const page = this.req.body.page !== undefined ? Number(this.req.body.page) : 1;
            const noOf = this.req.body.noOf !== undefined ? Number(this.req.body.noOf) : 20;

            const result = await new ChatService().getMyChattedCharacters(Number(userId), page, noOf, search);
            return this.res.status(200).send({ status: 1, message: "User chatted characters retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("ChatController userChattedCharacters", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Admin: Get message history for any user conversation
     */
    async adminGetHistory() {
        try {
            const role = await Global.getTokenValue(this.req, "role");
            if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
                return this.res.status(200).send({ status: 0, message: "Unauthorized. Admin access required." });
            }
            const conversationId = Number(this.req.params.conversationId);
            const page = this.req.query.page !== undefined ? Number(this.req.query.page) : 1;
            const noOf = this.req.query.noOf !== undefined ? Number(this.req.query.noOf) : 100;

            const result = await new ChatService().getHistory(0, conversationId, page, noOf, true);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Conversation not found." });
            }
            return this.res.status(200).send({ status: 1, message: "Chat history retrieved successfully.", data: result });
        } catch (err: any) {
            applicationLogger.error("ChatController adminGetHistory", { params: this.req.params, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }
}
