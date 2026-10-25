/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { Character, Category, getNextSequenceValue } from '../model';
import { MongoHelperService } from '../../services';
import { applicationLogger, configuration } from '../../configs';
import { ImageServiceService } from './image-service.service';

export interface GenerateAvatarParams {
    name: string;
    title?: string;
    description?: string;
    category?: string;
    style?: string;
    prompt?: string;
}

export class CharacterService {

    /**
     * Resolve or find a valid Category ObjectId
     */
    private async resolveCategoryId(categoryIdInput?: any): Promise<any> {
        // 1. If valid 24 hex chars ObjectId
        if (typeof categoryIdInput === 'string' && /^[0-9a-fA-F]{24}$/.test(categoryIdInput)) {
            const found = await Category.findById(categoryIdInput).lean();
            if (found) {
                return found._id;
            }
        }

        // 2. If numeric categoryId
        if (categoryIdInput && !isNaN(Number(categoryIdInput))) {
            const found = await Category.findOne({ categoryId: Number(categoryIdInput) }).lean();
            if (found) {
                return found._id;
            }
        }

        // 3. If category name string (e.g. "Anime", "Roleplay", "General")
        if (typeof categoryIdInput === 'string' && categoryIdInput.trim().length > 0) {
            const found = await Category.findOne({
                name: new RegExp('^' + categoryIdInput.trim() + '$', 'i')
            }).lean();
            if (found) {
                return found._id;
            }
        }

        // 4. Fallback: Find first active category in database
        const firstActive = await Category.findOne({ status: "ACTIVE" }).lean();
        if (firstActive) {
            return firstActive._id;
        }

        // 5. If no categories exist at all, create default General category
        const defaultCatId = await getNextSequenceValue("categoryId");
        const createdCat = await Category.create({
            categoryId: defaultCatId,
            name: "General",
            priority: 0,
            status: "ACTIVE"
        });
        return createdCat._id;
    }

    /**
     * Free AI Character Avatar Image Generator (Zero cost, no API key needed)
     * Uses Pollinations.ai with FLUX/SDXL models to create high quality character portraits
     * and downloads + saves the image locally on the server.
     */
    /**
     * Free AI Character Avatar Image Generator (Zero cost, no API key needed)
     * Primary: Pollinations.ai FLUX/SDXL model
     * Fallback 1: DiceBear stylized 512x512 portrait generator (handles 402 rate limit & timeouts)
     * Fallback 2: Robohash / Local SVG vector portrait
     */
    async generateAvatarImage(params: GenerateAvatarParams, customBaseUrl?: string): Promise<{ avatarImage: string; imageUrl: string; avatarUrl: string; promptUsed: string }> {
        const { name, title, description, category, style, prompt } = params;

        // Construct high-aesthetic portrait prompt
        let finalPrompt = prompt && prompt.trim().length > 0 ? prompt.trim() : "";
        if (!finalPrompt) {
            const styleDesc = style && style.trim().length > 0
                ? style.trim()
                : "cinematic digital 3d character portrait, trending on artstation, masterpiece, highly detailed face, studio lighting, sharp focus, 8k resolution";

            const parts: string[] = [];
            parts.push(`portrait of ${name}`);
            if (title && title.trim()) {
                parts.push(title.trim().replace(/^"/, ''));
            }
            if (category && category.trim()) {
                parts.push(`${category.trim()} theme`);
            }
            if (description && description.trim()) {
                const cleanDesc = description.replace(/[\r\n]+/g, ' ').slice(0, 100);
                parts.push(cleanDesc);
            }
            parts.push(styleDesc);
            finalPrompt = parts.join(", ");
        }

        // Sanitize prompt for URL safety
        const cleanPrompt = finalPrompt.replace(/[/\\?%*:|"<>]/g, ' ').replace(/\s+/g, ' ').trim();
        const seed = Math.floor(100000 + Math.random() * 900000);

        let imageBuffer: Buffer | null = null;
        let fileExtension = 'jpg';
        let usedProvider = 'pollinations';

        // 1. Primary: Chatboat Dedicated AI Image Microservice (Perchance AI)
        try {
            applicationLogger.info("CharacterService generateAvatarImage calling chatboat-image-service...", { prompt: cleanPrompt });
            const imageService = ImageServiceService.getInstance();
            const serviceResult = await imageService.generateAndSaveImage(cleanPrompt, {
                style: style || "painted_anime",
                shape: "portrait"
            }, customBaseUrl);
            return serviceResult;
        } catch (serviceErr: any) {
            applicationLogger.info("CharacterService: chatboat-image-service unavailable or failed, falling back to secondary generator", {
                error: serviceErr.message
            });
        }

        // 2. Fallback Tier 1: DiceBear 9.x High-Resolution Stylized Character Generator
        if (!imageBuffer) {
            try {
                // Determine style based on category, character name, and style keywords
                const combinedContext = `${name} ${title || ''} ${category || ''} ${style || ''}`.toLowerCase();
                let dicebearStyle = 'personas';
                if (/anime|manga|ninja|warrior|hero|fantasy|adventurer|dragon|magic|rpg/i.test(combinedContext)) {
                    dicebearStyle = 'adventurer';
                } else if (/robot|cyborg|mech|tech|ai|futuristic|sci-fi|bot/i.test(combinedContext)) {
                    dicebearStyle = 'bottts';
                } else if (/renaissance|art|history|historical|painter|scholar|philosopher|polymath|vintage/i.test(combinedContext)) {
                    dicebearStyle = 'lorelei';
                } else if (/cartoon|casual|comic|avatar/i.test(combinedContext)) {
                    dicebearStyle = 'micah';
                }

                const dicebearUrl = `https://api.dicebear.com/9.x/${dicebearStyle}/png?seed=${encodeURIComponent(name + '-' + seed)}&size=512`;
                applicationLogger.info("CharacterService generateAvatarImage using DiceBear fallback", { url: dicebearUrl, style: dicebearStyle });

                const dicebearRes = await axios.get(dicebearUrl, {
                    responseType: 'arraybuffer',
                    timeout: 8000
                });

                if (dicebearRes.data && dicebearRes.data.length > 200) {
                    imageBuffer = Buffer.from(dicebearRes.data);
                    fileExtension = 'png';
                    usedProvider = `dicebear-${dicebearStyle}`;
                }
            } catch (dicebearErr: any) {
                applicationLogger.info("CharacterService: DiceBear fallback failed, trying Robohash", { error: dicebearErr.message });
            }
        }

        // 3. Fallback Tier 2: Robohash set5 human portrait
        if (!imageBuffer) {
            try {
                const robohashUrl = `https://robohash.org/${encodeURIComponent(name)}?set=set5&size=512x512`;
                const roboRes = await axios.get(robohashUrl, {
                    responseType: 'arraybuffer',
                    timeout: 6000
                });
                if (roboRes.data && roboRes.data.length > 200) {
                    imageBuffer = Buffer.from(roboRes.data);
                    fileExtension = 'png';
                    usedProvider = 'robohash';
                }
            } catch (roboErr: any) {
                applicationLogger.info("CharacterService: Robohash fallback failed", { error: roboErr.message });
            }
        }

        // 4. Fallback Tier 3: Guaranteed local SVG gradient portrait (works 100% offline)
        if (!imageBuffer) {
            const initials = (name || "AI").split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
            const color1 = colors[Math.abs(seed) % colors.length];
            const color2 = colors[(Math.abs(seed) + 2) % colors.length];

            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${color1}"/>
                        <stop offset="100%" stop-color="${color2}"/>
                    </linearGradient>
                </defs>
                <rect width="512" height="512" rx="64" fill="url(#bg)"/>
                <circle cx="256" cy="220" r="110" fill="rgba(255,255,255,0.18)"/>
                <text x="256" y="250" font-family="Arial, Helvetica, sans-serif" font-size="110" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
                <text x="256" y="420" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="rgba(255,255,255,0.9)" text-anchor="middle">${name.slice(0, 24)}</text>
            </svg>`;
            imageBuffer = Buffer.from(svg, 'utf-8');
            fileExtension = 'svg';
            usedProvider = 'svg-local';
        }

        // Ensure directory exists
        const uploadDir = path.join(configuration.publicDirectory, 'public', 'uploads', 'characters');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `avatar-${Date.now()}-${seed}.${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, imageBuffer);

        const relativePath = `uploads/characters/${fileName}`;
        const effectiveBase = customBaseUrl || configuration.apiUrl;
        const baseUrl = effectiveBase.endsWith('/') ? effectiveBase : `${effectiveBase}/`;
        const fullImageUrl = `${baseUrl}${relativePath}`;

        applicationLogger.info("CharacterService generateAvatarImage success", { provider: usedProvider, file: fileName });

        return {
            avatarImage: relativePath,
            imageUrl: fullImageUrl,
            avatarUrl: relativePath,
            promptUsed: cleanPrompt
        };
    }

    /**
     * Create a new Character
     */
    async addCharacter(data: any) {
        const characterId = await getNextSequenceValue("characterId");

        // Resolve category
        const categoryId = await this.resolveCategoryId(data.categoryId);

        // Auto-generate avatar if requested or if avatar is blank and autoGenerateAvatar flag is true
        let avatarImage = data.avatarImage || "";
        if ((!avatarImage || avatarImage.trim() === "") && data.autoGenerateAvatar) {
            try {
                const generated = await this.generateAvatarImage({
                    name: data.name,
                    title: data.title,
                    description: data.description,
                    style: data.style
                });
                avatarImage = generated.avatarImage;
            } catch (err: any) {
                applicationLogger.error("addCharacter autoGenerateAvatar error", { error: err.toString() });
            }
        }

        // Auto-construct personality prompt if empty
        let personalityPrompt = data.personalityPrompt || "";
        if (!personalityPrompt || personalityPrompt.trim().length < 5) {
            personalityPrompt = `You are ${data.name}${data.title ? ', ' + data.title : ''}. ${data.description ? data.description : ''} Always stay in character, respond engagingly, and converse naturally in first person.`;
        }

        const visibility = data.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC";

        const newCharacter = await Character.create({
            characterId,
            name: data.name,
            avatarImage,
            title: data.title || "",
            tagline: data.tagline || "",
            description: data.description || "",
            categoryId,
            greetingMessage: data.greetingMessage || `Hello! I am ${data.name}. How can I help you today?`,
            personalityPrompt,
            temperature: data.temperature ?? 0.7,
            maxTokens: data.maxTokens ?? 250,
            exampleConversations: data.exampleConversations || "",
            priority: data.priority ?? 0,
            visibility,
            status: data.status || "ACTIVE",
            createdBy: data.createdBy ?? 0
        });

        return newCharacter.toObject();
    }

    /**
     * Update an existing Character with ownership check
     */
    async updateCharacter(characterId: number, data: any, userId = 0, role = "ADMIN") {
        const existing = await Character.findOne({ characterId });
        if (!existing) {
            return null;
        }

        // Authorization check: non-admin users can only update characters they authored
        if (role !== "ADMIN" && userId !== 0) {
            if (existing.createdBy !== userId) {
                return { permissionDenied: true };
            }
        }

        const updateSet: any = {
            updatingDate: new Date()
        };

        if (data.name !== undefined && data.name.trim().length > 0) {
            updateSet.name = data.name;
        }
        if (data.avatarImage !== undefined && data.avatarImage.trim().length > 0) {
            updateSet.avatarImage = data.avatarImage;
        }
        if (data.title !== undefined && data.title.trim().length > 0) {
            updateSet.title = data.title;
        }
        if (data.tagline !== undefined && data.tagline.trim().length > 0) {
            updateSet.tagline = data.tagline;
        }
        if (data.description !== undefined && data.description.trim().length > 0) {
            updateSet.description = data.description;
        }
        if (data.greetingMessage !== undefined && data.greetingMessage.trim().length > 0) {
            updateSet.greetingMessage = data.greetingMessage;
        }
        if (data.personalityPrompt !== undefined && data.personalityPrompt.trim().length > 0) {
            updateSet.personalityPrompt = data.personalityPrompt;
        }
        if (data.temperature !== undefined && data.temperature !== null && data.temperature !== "") {
            updateSet.temperature = Number(data.temperature);
        }
        if (data.maxTokens !== undefined && data.maxTokens !== null && data.maxTokens !== "" && Number(data.maxTokens) > 0) {
            updateSet.maxTokens = Number(data.maxTokens);
        }
        if (data.exampleConversations !== undefined && data.exampleConversations.trim().length > 0) {
            updateSet.exampleConversations = data.exampleConversations;
        }
        if (data.priority !== undefined && data.priority !== null && data.priority !== "") {
            updateSet.priority = Number(data.priority);
        }
        if (data.status !== undefined && data.status.trim().length > 0) {
            updateSet.status = data.status;
        }
        if (data.visibility !== undefined && data.visibility.trim().length > 0) {
            updateSet.visibility = data.visibility;
        }
        if (data.categoryId && data.categoryId.trim().length > 0) {
            updateSet.categoryId = await this.resolveCategoryId(data.categoryId);
        }

        const updated = await Character.findOneAndUpdate(
            { characterId },
            { $set: updateSet },
            { returnDocument: 'after' }
        ).populate("categoryId").lean();

        return updated;
    }

    /**
     * Fetch character by numeric ID with visibility & ownership check
     */
    async findById(characterId: number, userId = 0, role = "ADMIN") {
        const character: any = await Character.findOne({ characterId }).populate("categoryId").lean();
        if (!character) {
            return null;
        }

        // If character is PRIVATE, only creator and admin can access
        if (character.visibility === "PRIVATE" && role !== "ADMIN" && userId !== 0) {
            if (character.createdBy !== userId) {
                return { permissionDenied: true };
            }
        }

        return character;
    }

    /**
     * Delete a Character with ownership check
     */
    async deleteCharacter(characterId: number, userId = 0, role = "ADMIN") {
        const existing = await Character.findOne({ characterId });
        if (!existing) {
            return { deletedCount: 0 };
        }

        // Authorization check: non-admin users can only delete characters they authored
        if (role !== "ADMIN" && userId !== 0) {
            if (existing.createdBy !== userId) {
                return { permissionDenied: true };
            }
        }

        return Character.deleteOne({ characterId });
    }

    /**
     * Search Characters with pagination, filters, sorting and role-aware visibility
     */
    async searchCharacters(body: any, userId = 0, role = "ADMIN") {
        const defaultQuery: any = {};

        // If not admin, restrict visibility:
        // Users can see all PUBLIC characters, system characters (createdBy: 0), or their own custom characters
        if (role !== "ADMIN") {
            defaultQuery.status = "ACTIVE";

            if (body.myOnly === true) {
                defaultQuery.createdBy = userId;
            } else if (body.visibility === "PRIVATE") {
                defaultQuery.visibility = "PRIVATE";
                defaultQuery.createdBy = userId;
            } else if (body.visibility === "PUBLIC") {
                defaultQuery.$or = [
                    { visibility: "PUBLIC" },
                    { visibility: { $exists: false } },
                    { visibility: null }
                ];
            } else {
                defaultQuery.$or = [
                    { visibility: "PUBLIC" },
                    { visibility: { $exists: false } },
                    { visibility: null },
                    { createdBy: userId },
                    { createdBy: 0 },
                    { createdBy: { $exists: false } }
                ];
            }
        } else {
            // Admin can filter by visibility or createdBy if provided
            if (body.visibility === "PUBLIC") {
                defaultQuery.$or = [
                    { visibility: "PUBLIC" },
                    { visibility: { $exists: false } },
                    { visibility: null }
                ];
            } else if (body.visibility && body.visibility !== "ALL") {
                defaultQuery.visibility = body.visibility;
            }
            if (body.myOnly === true && userId) {
                defaultQuery.createdBy = userId;
            }
        }

        if (body.status && String(body.status).trim().length > 0 && body.status !== "ALL") {
            defaultQuery.status = body.status;
        }

        if (body.categoryId && String(body.categoryId).trim().length > 0) {
            const resolvedCat = await this.resolveCategoryId(body.categoryId);
            if (resolvedCat) {
                defaultQuery.categoryId = resolvedCat;
            }
        }

        return MongoHelperService.search(
            Character,
            body,
            (c) => ({
                _id: c._id,
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
                visibility: c.visibility || "PUBLIC",
                is_my_character: userId ? (c.createdBy === userId) : false,
                created_by: c.createdBy,
                creating_date: c.creatingDate,
                updating_date: c.updatingDate
            }),
            {
                populate: "categoryId",
                defaultQuery,
                filterFields: {
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

    /**
     * Get characters created specifically by the authenticated user
     */
    async getMyCustomCharacters(userId: number, page = 1, noOf = 20, search = "", visibility = "ALL") {
        const query: any = { createdBy: userId };

        if (visibility && visibility !== "ALL") {
            query.visibility = visibility;
        }

        if (search && search.trim().length > 0) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [{ name: regex }, { title: regex }, { tagline: regex }];
        }

        const total = await Character.countDocuments(query);
        const characters = await Character.find(query)
            .sort({ creatingDate: -1 })
            .skip((page - 1) * noOf)
            .limit(noOf)
            .populate("categoryId")
            .lean();

        const formatted = characters.map((c: any) => ({
            _id: c._id,
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
            priority: c.priority,
            status: c.status,
            visibility: c.visibility || "PUBLIC",
            is_my_character: true,
            created_by: c.createdBy,
            creating_date: c.creatingDate,
            updating_date: c.updatingDate
        }));

        return {
            data: formatted,
            page,
            noOf,
            total
        };
    }
}
