import tags from "../tag-constant";
import { SwaggerService } from "../common";

export const startOrGetChat = {
    post: {
        tags: [tags.chat],
        summary: "Authorized User Access",
        description: "Open chat area with a character. Retrieves existing conversation and recent messages or starts a new conversation with the character's greeting message.",
        operationId: "startOrGetChat",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("startOrGetChatInput"),
        responses: SwaggerService.successResponse("Conversation ready.", "startOrGetChatOutput")
    }
};

export const sendMessageChat = {
    post: {
        tags: [tags.chat],
        summary: "Authorized User Access",
        description: "Send a user message to the AI character. Automatically extracts long-term user facts and generates realistic responses with token-efficient memory recall.",
        operationId: "sendMessageChat",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("sendMessageInput"),
        responses: SwaggerService.successResponse("Message sent and response generated.", "sendMessageOutput")
    }
};

export const getConversationsChat = {
    post: {
        tags: [tags.chat],
        summary: "Authorized User Access",
        description: "Get user's active character conversations list with last message and character metadata.",
        operationId: "getConversationsChat",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("conversationsInput"),
        responses: SwaggerService.successResponse("Conversations retrieved successfully.", "conversationsListOutput")
    }
};

export const myCharactersChat = {
    post: {
        tags: [tags.chat],
        summary: "Authorized User Access",
        description: "Get unique characters that the user has actively chatted with, populated with character details, conversation ID, and last message info.",
        operationId: "myCharactersChat",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("myCharactersInput"),
        responses: SwaggerService.successResponse("Chatted characters retrieved successfully.", "myCharactersListOutput")
    }
};

export const getHistoryChat = {
    get: {
        tags: [tags.chat],
        summary: "Authorized User Access",
        description: "Get paginated message history for a specific conversation.",
        operationId: "getHistoryChat",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "conversationId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            },
            {
                name: "page",
                in: "query",
                type: "integer",
                required: false,
                example: 1
            },
            {
                name: "noOf",
                in: "query",
                type: "integer",
                required: false,
                example: 30
            }
        ]),
        responses: SwaggerService.successResponse("Chat history retrieved successfully.", "chatHistoryOutput")
    }
};

export const clearChat = {
    delete: {
        tags: [tags.chat],
        summary: "Authorized User Access",
        description: "Clear conversation messages and reset long-term memory for a fresh start with the character.",
        operationId: "clearChat",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "conversationId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse("Conversation cleared successfully.", "chatCommonOutput")
    }
};
