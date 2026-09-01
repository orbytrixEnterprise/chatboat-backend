/* eslint-disable camelcase */
import {
    Conversation,
    ChatMessage as ChatMessageModel,
    Character,
    getNextSequenceValue
} from '../model';
import { AIService, ChatMessage } from './ai.service';
import { applicationLogger } from '../../configs';

export class ChatService {

    /**
     * Start a new chat or retrieve existing conversation with character
     */
    async startOrGetConversation(userId: number, characterId: string) {
        let conversation: any = await Conversation.findOne({
            userId,
            characterId,
            status: "ACTIVE"
        }).populate("characterId").lean();

        let character: any = null;

        if (!conversation) {
            character = await Character.findById(characterId).lean();
            if (!character) {
                return null;
            }

            const conversationId = await getNextSequenceValue("conversationId");
            const greeting = character.greetingMessage || `Hello! I am ${character.name}. How can I help you today?`;

            const createdConv = await Conversation.create({
                conversationId,
                userId,
                characterId,
                title: `${character.name} Chat`,
                userMemories: [],
                lastMessage: greeting,
                lastMessageDate: new Date(),
                status: "ACTIVE"
            });

            const messageId = await getNextSequenceValue("messageId");
            await ChatMessageModel.create({
                messageId,
                conversationId,
                userId,
                characterId,
                sender: "CHARACTER",
                content: greeting
            });

            conversation = await Conversation.findById(createdConv._id).populate("characterId").lean();
        }

        // Fetch recent messages
        const messages = await ChatMessageModel.find({ conversationId: conversation.conversationId })
            .sort({ creatingDate: 1 })
            .limit(30)
            .lean();

        return {
            conversation: {
                conversation_id: conversation.conversationId,
                character_id: conversation.characterId?._id || conversation.characterId,
                character_name: conversation.characterId?.name || "",
                character_avatar: conversation.characterId?.avatarImage || "",
                title: conversation.title,
                user_memories: conversation.userMemories || [],
                last_message: conversation.lastMessage,
                last_message_date: conversation.lastMessageDate
            },
            messages: messages.map(m => ({
                message_id: m.messageId,
                sender: m.sender,
                content: m.content,
                creating_date: m.creatingDate
            }))
        };
    }

    /**
     * Send message, process long-term memory, and obtain AI character response
     */
    async sendMessage(userId: number, conversationId: number, text: string) {
        const conversation = await Conversation.findOne({ conversationId, userId, status: "ACTIVE" });
        if (!conversation) {
            return null;
        }

        const character: any = await Character.findById(conversation.characterId).lean();
        if (!character) {
            return null;
        }

        // 1. Save user message to database
        const userMsgId = await getNextSequenceValue("messageId");
        const userMessage = await ChatMessageModel.create({
            messageId: userMsgId,
            conversationId,
            userId,
            characterId: character._id,
            sender: "USER",
            content: text
        });

        // 2. Extract facts from user message and update long-term memories
        this.extractAndStoreMemory(conversation, text);

        // 3. Assemble prompt with 3-tier context: System Persona + User Memories + Sliding Window
        const memoryBullets = (conversation.userMemories || []).length > 0
            ? `\n\n[USER FACTS & MEMORY (Incorporate naturally into conversation where relevant)]:\n${conversation.userMemories.map(m => `• ${m}`).join('\n')}`
            : '';

        const exampleStyle = character.exampleConversations
            ? `\n\n[EXAMPLE DIALOGUE STYLE]:\n${character.exampleConversations}`
            : '';

        const fullSystemPrompt = `${character.personalityPrompt || `You are ${character.name}.`}${memoryBullets}${exampleStyle}`;

        // Fetch last 8 messages for sliding window dialogue context
        const recentHistory = await ChatMessageModel.find({ conversationId })
            .sort({ creatingDate: -1 })
            .limit(8)
            .lean();

        // Sort chronologically (oldest first)
        recentHistory.reverse();

        const aiMessages: ChatMessage[] = [
            { role: "system", content: fullSystemPrompt },
            ...recentHistory.map(m => ({
                role: (m.sender === "USER" ? "user" : "assistant") as 'user' | 'assistant',
                content: m.content
            }))
        ];

        // 4. Query AI model with failover
        let aiReply = "";
        try {
            aiReply = await new AIService().chat(aiMessages, {
                temperature: character.temperature ?? 0.7,
                maxTokens: character.maxTokens ?? 250
            });
        } catch (err: any) {
            applicationLogger.error("ChatService AI generation failed", { error: err.message, conversationId });
            aiReply = `I apologize, I am momentarily having trouble thinking. Could you please repeat that?`;
        }

        // 5. Save AI response
        const charMsgId = await getNextSequenceValue("messageId");
        const charMessage = await ChatMessageModel.create({
            messageId: charMsgId,
            conversationId,
            userId,
            characterId: character._id,
            sender: "CHARACTER",
            content: aiReply
        });

        // 6. Update conversation last message details
        conversation.lastMessage = aiReply;
        conversation.lastMessageDate = new Date();
        await conversation.save();

        return {
            conversation_id: conversationId,
            user_message: {
                message_id: userMessage.messageId,
                sender: userMessage.sender,
                content: userMessage.content,
                creating_date: userMessage.creatingDate
            },
            character_message: {
                message_id: charMessage.messageId,
                sender: charMessage.sender,
                content: charMessage.content,
                creating_date: charMessage.creatingDate
            },
            user_memories: conversation.userMemories || []
        };
    }

    /**
     * Get user's active conversations list
     */
    async getConversations(userId: number, page: number = 1, noOf: number = 10, search?: string) {
        const query: any = { userId, status: "ACTIVE" };

        const total = await Conversation.countDocuments(query);
        const conversations = await Conversation.find(query)
            .sort({ lastMessageDate: -1 })
            .skip((page - 1) * noOf)
            .limit(noOf)
            .populate("characterId")
            .lean();

        let filtered = conversations;
        if (search) {
            const s = search.toLowerCase();
            filtered = conversations.filter((c: any) =>
                c.characterId?.name?.toLowerCase().includes(s) ||
                c.title?.toLowerCase().includes(s) ||
                c.lastMessage?.toLowerCase().includes(s)
            );
        }

        const mapped = filtered.map((c: any) => ({
            conversation_id: c.conversationId,
            character_id: c.characterId?._id || c.characterId,
            character_name: c.characterId?.name || "",
            character_avatar: c.characterId?.avatarImage || "",
            character_title: c.characterId?.title || "",
            title: c.title,
            last_message: c.lastMessage,
            last_message_date: c.lastMessageDate,
            user_memories: c.userMemories || []
        }));

        return {
            data: mapped,
            page,
            noOf,
            total
        };
    }

    /**
     * Get unique characters the user has actively chatted with
     */
    async getMyChattedCharacters(userId: number, page: number = 1, noOf: number = 20, search?: string) {
        const query: any = { userId, status: "ACTIVE" };

        const conversations = await Conversation.find(query)
            .sort({ lastMessageDate: -1 })
            .populate({
                path: "characterId",
                populate: { path: "categoryId" }
            })
            .lean();

        // Extract unique characters in order of most recent interaction
        const characterMap = new Map();
        for (const c of conversations) {
            const char: any = c.characterId;
            if (char && char._id && !characterMap.has(char._id.toString())) {
                characterMap.set(char._id.toString(), {
                    character_id: char._id,
                    character_numeric_id: char.characterId,
                    name: char.name,
                    avatar_image: char.avatarImage || "",
                    title: char.title || "",
                    tagline: char.tagline || "",
                    description: char.description || "",
                    category_id: char.categoryId?._id || char.categoryId || null,
                    category_name: char.categoryId?.name || "",
                    conversation_id: c.conversationId,
                    last_message: c.lastMessage || "",
                    last_message_date: c.lastMessageDate
                });
            }
        }

        let characterList = Array.from(characterMap.values());
        if (search) {
            const s = search.toLowerCase();
            characterList = characterList.filter(char =>
                char.name?.toLowerCase().includes(s) ||
                char.title?.toLowerCase().includes(s) ||
                char.tagline?.toLowerCase().includes(s) ||
                char.category_name?.toLowerCase().includes(s)
            );
        }

        const total = characterList.length;
        const paginatedData = characterList.slice((page - 1) * noOf, page * noOf);

        return {
            data: paginatedData,
            page,
            noOf,
            total
        };
    }

    /**
     * Get message history for a specific conversation
     */
    async getHistory(userId: number, conversationId: number, page: number = 1, noOf: number = 30) {
        const conversation = await Conversation.findOne({ conversationId, userId }).populate("characterId").lean();
        if (!conversation) {
            return null;
        }

        const total = await ChatMessageModel.countDocuments({ conversationId });
        const messages = await ChatMessageModel.find({ conversationId })
            .sort({ creatingDate: -1 })
            .skip((page - 1) * noOf)
            .limit(noOf)
            .lean();

        messages.reverse();

        return {
            conversation: {
                conversation_id: conversation.conversationId,
                character_id: (conversation.characterId as any)?._id || conversation.characterId,
                character_name: (conversation.characterId as any)?.name || "",
                character_avatar: (conversation.characterId as any)?.avatarImage || "",
                title: conversation.title,
                user_memories: conversation.userMemories || []
            },
            messages: messages.map(m => ({
                message_id: m.messageId,
                sender: m.sender,
                content: m.content,
                creating_date: m.creatingDate
            })),
            page,
            noOf,
            total
        };
    }

    /**
     * Clear all conversation messages and reset memory
     */
    async clearConversation(userId: number, conversationId: number) {
        const conversation = await Conversation.findOne({ conversationId, userId });
        if (!conversation) {
            return false;
        }

        await ChatMessageModel.deleteMany({ conversationId });

        const character: any = await Character.findById(conversation.characterId).lean();
        const greeting = character?.greetingMessage || "Hello! How can I help you today?";

        const messageId = await getNextSequenceValue("messageId");
        await ChatMessageModel.create({
            messageId,
            conversationId,
            userId,
            characterId: conversation.characterId,
            sender: "CHARACTER",
            content: greeting
        });

        conversation.userMemories = [];
        conversation.lastMessage = greeting;
        conversation.lastMessageDate = new Date();
        await conversation.save();

        return true;
    }

    /**
     * Internal rule-based memory extractor for user statements
     */
    private extractAndStoreMemory(conversation: any, text: string) {
        const newFacts: string[] = [];

        // 1. Age extraction
        const ageMatch = text.match(/\b(?:my age is|i am|i'm)\s+(\d{1,3})\s*(?:years old|yrs old|yo)?\b/i);
        if (ageMatch && Number(ageMatch[1]) > 0 && Number(ageMatch[1]) < 130) {
            newFacts.push(`User's age is ${ageMatch[1]}`);
        }

        // 2. Name extraction
        const nameMatch = text.match(/\b(?:my name is|i am called|call me)\s+([A-Z][a-z]+)\b/i);
        if (nameMatch) {
            newFacts.push(`User's name is ${nameMatch[1]}`);
        }

        // 3. Location / Residence extraction
        const locMatch = text.match(/\b(?:i live in|i am from|i'm from|i reside in)\s+([A-Za-z\s]+?)(?:\.|$|,)/i);
        if (locMatch && locMatch[1].trim().length > 2 && locMatch[1].trim().length < 40) {
            newFacts.push(`User lives in ${locMatch[1].trim()}`);
        }

        // 4. Profession / Work extraction
        const jobMatch = text.match(/\b(?:i work as an?|my job is|i am an?)\s+([A-Za-z\s]+?)(?:\.|$|,)/i);
        if (jobMatch && jobMatch[1].trim().length > 2 && jobMatch[1].trim().length < 40) {
            newFacts.push(`User works as ${jobMatch[1].trim()}`);
        }

        // 5. Likes / Hobbies extraction
        const likeMatch = text.match(/\b(?:i like|i love|my hobby is|i enjoy)\s+([A-Za-z\s]+?)(?:\.|$|,)/i);
        if (likeMatch && likeMatch[1].trim().length > 2 && likeMatch[1].trim().length < 40) {
            newFacts.push(`User likes ${likeMatch[1].trim()}`);
        }

        if (newFacts.length > 0) {
            const currentMemories: string[] = conversation.userMemories || [];
            for (const fact of newFacts) {
                // If not already in memories, add it
                if (!currentMemories.some(m => m.toLowerCase() === fact.toLowerCase())) {
                    currentMemories.push(fact);
                }
            }
            // Keep max 20 memory bullets to ensure minimal token consumption
            if (currentMemories.length > 20) {
                currentMemories.splice(0, currentMemories.length - 20);
            }
            conversation.userMemories = currentMemories;
        }
    }
}
