import { Controller } from './controller';
import { ChatService } from '../services';
import { applicationLogger, response } from '../../configs';

export class ChatController extends Controller {

    constructor() {
        super();
    }

    /**
     * Start a new chat or retrieve existing conversation with a character
     */
    async startOrGet() {
        try {
            const userId = this.req.user.userId;
            const { characterId } = this.req.body;

            const result = await new ChatService().startOrGetConversation(userId, characterId);
            if (!result) {
                return this.res.status(200).send({ status: 0, message: "Character not found." });
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
            const userId = this.req.user.userId;
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
            const userId = this.req.user.userId;
            const { page = 1, noOf = 10, search } = this.req.body;

            const result = await new ChatService().getConversations(userId, Number(page), Number(noOf), search);
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
            const userId = this.req.user.userId;
            const { page = 1, noOf = 20, search } = this.req.body;

            const result = await new ChatService().getMyChattedCharacters(userId, Number(page), Number(noOf), search);
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
            const userId = this.req.user.userId;
            const conversationId = Number(this.req.params.conversationId);
            const page = Number(this.req.query.page || 1);
            const noOf = Number(this.req.query.noOf || 30);

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
            const userId = this.req.user.userId;
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
}
