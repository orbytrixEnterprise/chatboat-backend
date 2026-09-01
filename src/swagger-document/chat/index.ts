import tags from "../tag-constant";
import components from "./components";

import {
    startOrGetChat,
    sendMessageChat,
    getConversationsChat,
    myCharactersChat,
    getHistoryChat,
    clearChat
} from "./api";

const chat = {

    ...components,

    tags: [
        {
            name: tags.chat,
            description: "AI Character Chat & Long-Term Memory Conversation APIs"
        }
    ],

    paths: {
        "/Chat/StartOrGet": startOrGetChat,
        "/Chat/SendMessage": sendMessageChat,
        "/Chat/Conversations": getConversationsChat,
        "/Chat/MyCharacters": myCharactersChat,
        "/Chat/History/{conversationId}": getHistoryChat,
        "/Chat/Clear/{conversationId}": clearChat
    }

};

export default chat;
