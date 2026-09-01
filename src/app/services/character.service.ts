/* eslint-disable camelcase */
import { Character, getNextSequenceValue } from '../model';
import { MongoHelperService } from '../../services';

export class CharacterService {

    /**
     * Create a new Character
     */
    async addCharacter(data: any) {
        const characterId = await getNextSequenceValue("characterId");
        const newCharacter = await Character.create({
            characterId,
            name: data.name,
            avatarImage: data.avatarImage || "",
            title: data.title || "",
            tagline: data.tagline || "",
            description: data.description || "",
            categoryId: data.categoryId,
            greetingMessage: data.greetingMessage || "Hello! How can I help you today?",
            personalityPrompt: data.personalityPrompt,
            temperature: data.temperature ?? 0.7,
            maxTokens: data.maxTokens ?? 250,
            exampleConversations: data.exampleConversations || "",
            priority: data.priority ?? 0,
            status: data.status || "ACTIVE",
            createdBy: data.createdBy ?? 0
        });
        return newCharacter.toObject();
    }

    /**
     * Update an existing Character
     */
    async updateCharacter(characterId: number, data: any) {
        const updated = await Character.findOneAndUpdate(
            { characterId },
            {
                $set: {
                    name: data.name,
                    avatarImage: data.avatarImage,
                    title: data.title,
                    tagline: data.tagline,
                    description: data.description,
                    categoryId: data.categoryId,
                    greetingMessage: data.greetingMessage,
                    personalityPrompt: data.personalityPrompt,
                    temperature: data.temperature,
                    maxTokens: data.maxTokens,
                    exampleConversations: data.exampleConversations,
                    priority: data.priority,
                    status: data.status,
                    updatingDate: new Date()
                }
            },
            { returnDocument: 'after' }
        ).lean();
        return updated;
    }

    /**
     * Fetch character by numeric ID
     */
    async findById(characterId: number) {
        return Character.findOne({ characterId }).populate("categoryId").lean();
    }

    /**
     * Delete a Character
     */
    async deleteCharacter(characterId: number) {
        return Character.deleteOne({ characterId });
    }

    /**
     * Search Characters with pagination, filters and sorting
     */
    async searchCharacters(body: any) {
        return MongoHelperService.search(
            Character,
            body,
            (c) => ({
                character_id: c.characterId,
                name: c.name,
                avatar_image: c.avatarImage,
                title: c.title,
                tagline: c.tagline,
                description: c.description,
                category_id: c.categoryId ? (typeof c.categoryId === 'object' ? c.categoryId._id : c.categoryId) : null,
                category_name: c.categoryId && typeof c.categoryId === 'object' ? c.categoryId.name : "",
                greeting_message: c.greetingMessage,
                personality_prompt: c.personalityPrompt,
                temperature: c.temperature,
                max_tokens: c.maxTokens,
                example_conversations: c.exampleConversations,
                priority: c.priority,
                status: c.status,
                created_by: c.createdBy,
                creating_date: c.creatingDate,
                updating_date: c.updatingDate
            }),
            {
                populate: "categoryId",
                filterFields: {
                    categoryId: "categoryId",
                    status: "status",
                    createdBy: "createdBy"
                },
                sortFields: {
                    name: "name",
                    priority: "priority",
                    creatingDate: "creatingDate",
                    updatingDate: "updatingDate"
                }
            }
        );
    }
}
