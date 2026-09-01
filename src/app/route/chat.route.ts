import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { ChatController } from "../controller";
import {
    chatSchema,
    chatStartOrGetSanitize,
    chatSendMessageSanitize,
    chatConversationsSanitize,
    chatMyCharactersSanitize
} from "../schema";

const chatRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/Chat/";

    // Start new chat session or get existing conversation
    router.post(routerPath + "StartOrGet", [Global.isAuthorized, checkUserActive, chatStartOrGetSanitize, middleware(chatSchema.startOrGetSchema, "body")], (req: any, res: any) => {
        const task = (new ChatController()).boot(req, res);
        return task.startOrGet();
    });

    // Send user message and receive AI response with long-term memory
    router.post(routerPath + "SendMessage", [Global.isAuthorized, checkUserActive, chatSendMessageSanitize, middleware(chatSchema.sendMessageSchema, "body")], (req: any, res: any) => {
        const task = (new ChatController()).boot(req, res);
        return task.sendMessage();
    });

    // List user conversations
    router.post(routerPath + "Conversations", [Global.isAuthorized, checkUserActive, chatConversationsSanitize, middleware(chatSchema.conversationsSchema, "body")], (req: any, res: any) => {
        const task = (new ChatController()).boot(req, res);
        return task.getConversations();
    });

    // Get unique characters user has actively chatted with
    router.post(routerPath + "MyCharacters", [Global.isAuthorized, checkUserActive, chatMyCharactersSanitize, middleware(chatSchema.myCharactersSchema, "body")], (req: any, res: any) => {
        const task = (new ChatController()).boot(req, res);
        return task.myCharacters();
    });

    // Get chat message history
    router.get(routerPath + "History/:conversationId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new ChatController()).boot(req, res);
        return task.getHistory();
    });

    // Clear conversation messages and memories
    router.delete(routerPath + "Clear/:conversationId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new ChatController()).boot(req, res);
        return task.clear();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { chatRoute };
