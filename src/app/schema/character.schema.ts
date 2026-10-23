import joi from 'joi';
import { FieldHelperService } from '../../services';
import { decode } from 'html-entities';

const characterSchema = {
    addSchema: joi.object().keys({
        name: joi.string().required().min(1).max(100).messages({
            "string.empty": `Character name is required.`,
            "string.max": `Character name cannot exceed 100 characters.`,
            "any.required": `Character name is required.`
        }),
        avatarImage: joi.string().required().allow('').messages({
            "any.required": `Avatar image is required.`
        }),
        title: joi.string().required().allow('').messages({
            "any.required": `Title is required.`
        }),
        tagline: joi.string().required().allow('').messages({
            "any.required": `Tagline is required.`
        }),
        description: joi.string().required().allow('').messages({
            "any.required": `Description is required.`
        }),
        categoryId: joi.string().required().allow('').messages({
            "any.required": `Category ID is required.`
        }),
        greetingMessage: joi.string().required().allow('').messages({
            "any.required": `Greeting message is required.`
        }),
        personalityPrompt: joi.string().required().allow('').messages({
            "any.required": `Personality prompt is required.`
        }),
        temperature: joi.number().required().min(0.0).max(1.0).messages({
            "number.base": `Temperature must be a number between 0.0 and 1.0.`,
            "any.required": `Temperature is required.`
        }),
        maxTokens: joi.number().required().integer().min(0).max(4096).messages({
            "number.base": `Max tokens must be a number.`,
            "any.required": `Max tokens is required.`
        }),
        exampleConversations: joi.string().required().allow('').messages({
            "any.required": `Example conversations is required.`
        }),
        priority: joi.number().required().integer().min(0).messages({
            "number.base": `Priority must be a number.`,
            "any.required": `Priority is required.`
        }),
        status: joi.string().required().valid("ACTIVE", "INACTIVE", "").allow('').messages({
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        }),
        visibility: joi.string().required().valid("PUBLIC", "PRIVATE", "").allow('').messages({
            "any.only": `Visibility must be PUBLIC or PRIVATE.`,
            "any.required": `Visibility is required.`
        }),
        autoGenerateAvatar: joi.boolean().required().messages({
            "boolean.base": `Auto generate avatar must be a boolean.`,
            "any.required": `Auto generate avatar flag is required.`
        })
    }),

    updateSchema: joi.object().keys({
        characterId: joi.number().required().integer().min(0).messages({
            "number.base": `Character ID must be a number.`,
            "any.required": `Character ID is required.`
        }),
        name: joi.string().required().allow('').max(100).messages({
            "string.max": `Character name cannot exceed 100 characters.`,
            "any.required": `Character name is required.`
        }),
        avatarImage: joi.string().required().allow('').messages({
            "any.required": `Avatar image is required.`
        }),
        title: joi.string().required().allow('').messages({
            "any.required": `Title is required.`
        }),
        tagline: joi.string().required().allow('').messages({
            "any.required": `Tagline is required.`
        }),
        description: joi.string().required().allow('').messages({
            "any.required": `Description is required.`
        }),
        categoryId: joi.string().required().allow('').messages({
            "any.required": `Category ID is required.`
        }),
        greetingMessage: joi.string().required().allow('').messages({
            "any.required": `Greeting message is required.`
        }),
        personalityPrompt: joi.string().required().allow('').messages({
            "any.required": `Personality prompt is required.`
        }),
        temperature: joi.number().required().min(0.0).max(1.0).messages({
            "number.base": `Temperature must be a number between 0.0 and 1.0.`,
            "any.required": `Temperature is required.`
        }),
        maxTokens: joi.number().required().integer().min(0).max(4096).messages({
            "number.base": `Max tokens must be a number.`,
            "any.required": `Max tokens is required.`
        }),
        exampleConversations: joi.string().required().allow('').messages({
            "any.required": `Example conversations is required.`
        }),
        priority: joi.number().required().integer().min(0).messages({
            "number.base": `Priority must be a number.`,
            "any.required": `Priority is required.`
        }),
        status: joi.string().required().valid("ACTIVE", "INACTIVE", "").allow('').messages({
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        }),
        visibility: joi.string().required().valid("PUBLIC", "PRIVATE", "").allow('').messages({
            "any.only": `Visibility must be PUBLIC or PRIVATE.`,
            "any.required": `Visibility is required.`
        })
    }),

    searchSchema: joi.object().keys({
        categoryId: joi.string().required().allow('').messages({
            "any.required": `Category ID is required.`
        }),
        status: joi.string().required().allow('').messages({
            "any.required": `Status is required.`
        }),
        search: joi.string().required().allow('').messages({
            "any.required": `Search query is required.`
        }),
        visibility: joi.string().required().valid("PUBLIC", "PRIVATE", "ALL", "").allow('').messages({
            "any.only": `Visibility must be PUBLIC, PRIVATE, or ALL.`,
            "any.required": `Visibility is required.`
        }),
        myOnly: joi.boolean().required().messages({
            "boolean.base": `myOnly must be a boolean.`,
            "any.required": `myOnly flag is required.`
        }),
        page: joi.number().required().integer().min(0).messages({
            "number.base": `Page must be a number.`,
            "number.min": `Page must be greater than or equal to 0.`,
            "any.required": `Page is required.`
        }),
        noOf: joi.number().required().integer().min(0).messages({
            "number.base": `Number of records must be a number.`,
            "number.min": `Number of records must be greater than or equal to 0.`,
            "any.required": `Number of records is required.`
        }),
        filter: joi.array().required().messages({
            "array.base": `Filter must be an array.`,
            "any.required": `Filter is required.`
        }),
        orderBy: joi.array().required().messages({
            "array.base": `OrderBy must be an array.`,
            "any.required": `OrderBy is required.`
        })
    }),

    generateAvatarSchema: joi.object().keys({
        name: joi.string().required().min(1).max(100).messages({
            "string.base": `Character name must be a string.`,
            "string.empty": `Character name is required.`,
            "string.max": `Character name cannot exceed 100 characters.`,
            "any.required": `Character name is required.`
        }),
        title: joi.string().required().allow('').messages({
            "string.base": `Title must be a string.`,
            "any.required": `Title is required.`
        }),
        description: joi.string().required().allow('').messages({
            "string.base": `Description must be a string.`,
            "any.required": `Description is required.`
        }),
        category: joi.string().required().allow('').messages({
            "string.base": `Category must be a string.`,
            "any.required": `Category is required.`
        }),
        style: joi.string().required().allow('').messages({
            "string.base": `Style must be a string.`,
            "any.required": `Style is required.`
        }),
        prompt: joi.string().required().allow('').messages({
            "string.base": `Prompt must be a string.`,
            "any.required": `Prompt is required.`
        })
    }),

    myCustomCharactersSchema: joi.object().keys({
        page: joi.number().required().integer().min(0).messages({
            "number.base": `Page must be a number.`,
            "number.min": `Page must be greater than or equal to 0.`,
            "any.required": `Page is required.`
        }),
        noOf: joi.number().required().integer().min(0).messages({
            "number.base": `Number of records must be a number.`,
            "number.min": `Number of records must be greater than or equal to 0.`,
            "any.required": `Number of records is required.`
        }),
        search: joi.string().required().allow('').messages({
            "string.base": `Search query must be a string.`,
            "any.required": `Search query is required.`
        }),
        visibility: joi.string().required().valid("PUBLIC", "PRIVATE", "ALL", "").allow('').messages({
            "string.base": `Visibility must be a string.`,
            "any.only": `Visibility must be PUBLIC, PRIVATE, or ALL.`,
            "any.required": `Visibility is required.`
        })
    })
};

// Express Middleware Sanitizers
export const characterAddSanitize = (req: any, res: any, next: any) => {
    if (req.body.avatarImage === undefined || req.body.avatarImage === null) {
        req.body.avatarImage = "";
    }
    if (req.body.title === undefined || req.body.title === null) {
        req.body.title = "";
    }
    if (req.body.tagline === undefined || req.body.tagline === null) {
        req.body.tagline = "";
    }
    if (req.body.description === undefined || req.body.description === null) {
        req.body.description = "";
    }
    if (req.body.categoryId === undefined || req.body.categoryId === null) {
        req.body.categoryId = "";
    }
    if (req.body.greetingMessage === undefined || req.body.greetingMessage === null) {
        req.body.greetingMessage = "";
    }
    if (req.body.personalityPrompt === undefined || req.body.personalityPrompt === null) {
        req.body.personalityPrompt = "";
    }
    if (req.body.temperature === undefined || req.body.temperature === null) {
        req.body.temperature = 0.7;
    }
    if (req.body.maxTokens === undefined || req.body.maxTokens === null) {
        req.body.maxTokens = 250;
    }
    if (req.body.exampleConversations === undefined || req.body.exampleConversations === null) {
        req.body.exampleConversations = "";
    }
    if (req.body.priority === undefined || req.body.priority === null) {
        req.body.priority = 0;
    }
    if (req.body.status === undefined || req.body.status === null) {
        req.body.status = "ACTIVE";
    }
    if (req.body.visibility === undefined || req.body.visibility === null) {
        req.body.visibility = "PUBLIC";
    }
    if (req.body.autoGenerateAvatar === undefined || req.body.autoGenerateAvatar === null) {
        req.body.autoGenerateAvatar = false;
    }

    const fields = ['name', 'avatarImage', 'title', 'tagline', 'description', 'categoryId', 'greetingMessage', 'personalityPrompt', 'exampleConversations', 'status', 'visibility'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const characterUpdateSanitize = (req: any, res: any, next: any) => {
    if (req.body.name === undefined || req.body.name === null) {
        req.body.name = "";
    }
    if (req.body.avatarImage === undefined || req.body.avatarImage === null) {
        req.body.avatarImage = "";
    }
    if (req.body.title === undefined || req.body.title === null) {
        req.body.title = "";
    }
    if (req.body.tagline === undefined || req.body.tagline === null) {
        req.body.tagline = "";
    }
    if (req.body.description === undefined || req.body.description === null) {
        req.body.description = "";
    }
    if (req.body.categoryId === undefined || req.body.categoryId === null) {
        req.body.categoryId = "";
    }
    if (req.body.greetingMessage === undefined || req.body.greetingMessage === null) {
        req.body.greetingMessage = "";
    }
    if (req.body.personalityPrompt === undefined || req.body.personalityPrompt === null) {
        req.body.personalityPrompt = "";
    }
    if (req.body.temperature === undefined || req.body.temperature === null) {
        req.body.temperature = 0.7;
    }
    if (req.body.maxTokens === undefined || req.body.maxTokens === null) {
        req.body.maxTokens = 250;
    }
    if (req.body.exampleConversations === undefined || req.body.exampleConversations === null) {
        req.body.exampleConversations = "";
    }
    if (req.body.priority === undefined || req.body.priority === null) {
        req.body.priority = 0;
    }
    if (req.body.status === undefined || req.body.status === null) {
        req.body.status = "";
    }
    if (req.body.visibility === undefined || req.body.visibility === null) {
        req.body.visibility = "";
    }

    const fields = ['name', 'avatarImage', 'title', 'tagline', 'description', 'categoryId', 'greetingMessage', 'personalityPrompt', 'exampleConversations', 'status', 'visibility'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const characterSearchSanitize = (req: any, res: any, next: any) => {
    if (req.body.categoryId === undefined || req.body.categoryId === null) {
        req.body.categoryId = "";
    }
    if (req.body.status === undefined || req.body.status === null) {
        req.body.status = "";
    }
    if (req.body.search === undefined || req.body.search === null) {
        req.body.search = "";
    }
    if (req.body.visibility === undefined || req.body.visibility === null) {
        req.body.visibility = "";
    }
    if (req.body.myOnly === undefined || req.body.myOnly === null) {
        req.body.myOnly = false;
    }
    if (req.body.page === undefined || req.body.page === null) {
        req.body.page = 1;
    }
    if (req.body.noOf === undefined || req.body.noOf === null) {
        req.body.noOf = 10;
    }
    if (req.body.filter === undefined || req.body.filter === null) {
        req.body.filter = [];
    }
    if (req.body.orderBy === undefined || req.body.orderBy === null) {
        req.body.orderBy = [];
    }

    const fields = ['categoryId', 'status', 'search', 'visibility'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    if (req.body.filter && Array.isArray(req.body.filter)) {
        for (const element of req.body.filter) {
            if (FieldHelperService.undefinedAndNullCheck(element.key)) {
                element.key = decode(req.sanitize(element.key));
            }
            if (FieldHelperService.undefinedAndNullCheck(element.type)) {
                element.type = decode(req.sanitize(element.type));
            }
            if (FieldHelperService.undefinedAndNullCheck(element.value)) {
                element.value = decode(req.sanitize(element.value + ""));
            }
        }
    }
    if (req.body.orderBy && Array.isArray(req.body.orderBy)) {
        for (const element of req.body.orderBy) {
            if (FieldHelperService.undefinedAndNullCheck(element.key)) {
                element.key = decode(req.sanitize(element.key));
            }
            if (FieldHelperService.undefinedAndNullCheck(element.orderType)) {
                element.orderType = decode(req.sanitize(element.orderType));
            }
        }
    }
    next();
};

export const characterGenerateAvatarSanitize = (req: any, res: any, next: any) => {
    if (req.body.title === undefined || req.body.title === null) {
        req.body.title = "";
    }
    if (req.body.description === undefined || req.body.description === null) {
        req.body.description = "";
    }
    if (req.body.category === undefined || req.body.category === null) {
        req.body.category = "";
    }
    if (req.body.style === undefined || req.body.style === null) {
        req.body.style = "";
    }
    if (req.body.prompt === undefined || req.body.prompt === null) {
        req.body.prompt = "";
    }

    const fields = ['name', 'title', 'description', 'category', 'style', 'prompt'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const characterMyCustomSanitize = (req: any, res: any, next: any) => {
    if (req.body.page === undefined || req.body.page === null) {
        req.body.page = 1;
    }
    if (req.body.noOf === undefined || req.body.noOf === null) {
        req.body.noOf = 20;
    }
    if (req.body.search === undefined || req.body.search === null) {
        req.body.search = "";
    }
    if (req.body.visibility === undefined || req.body.visibility === null) {
        req.body.visibility = "ALL";
    }

    const fields = ['search', 'visibility'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export { characterSchema };
