import joi from 'joi';
import { FieldHelperService } from '../../services';
import { decode } from 'html-entities';

const characterSchema = {
    addSchema: joi.object().keys({
        name: joi.string().required().min(2).max(100),
        avatarImage: joi.string().optional().allow(''),
        title: joi.string().optional().allow(''),
        tagline: joi.string().optional().allow(''),
        description: joi.string().optional().allow(''),
        categoryId: joi.string().required(),
        greetingMessage: joi.string().optional().allow(''),
        personalityPrompt: joi.string().required().min(10),
        temperature: joi.number().optional().min(0.0).max(1.0),
        maxTokens: joi.number().optional().min(1).max(2048),
        exampleConversations: joi.string().optional().allow(''),
        priority: joi.number().optional().integer(),
        status: joi.string().optional().valid("ACTIVE", "INACTIVE")
    }),

    updateSchema: joi.object().keys({
        characterId: joi.number().required().integer(),
        name: joi.string().optional().min(2).max(100),
        avatarImage: joi.string().optional().allow(''),
        title: joi.string().optional().allow(''),
        tagline: joi.string().optional().allow(''),
        description: joi.string().optional().allow(''),
        categoryId: joi.string().optional(),
        greetingMessage: joi.string().optional().allow(''),
        personalityPrompt: joi.string().optional().min(10),
        temperature: joi.number().optional().min(0.0).max(1.0),
        maxTokens: joi.number().optional().min(1).max(2048),
        exampleConversations: joi.string().optional().allow(''),
        priority: joi.number().optional().integer(),
        status: joi.string().optional().valid("ACTIVE", "INACTIVE")
    }),

    searchSchema: joi.object().keys({
        categoryId: joi.string().optional().allow(''),
        status: joi.string().optional().allow(''),
        search: joi.string().optional().allow(''),
        page: joi.number().required().integer().min(1),
        noOf: joi.number().required().integer().min(1),
        filter: joi.array().optional(),
        orderBy: joi.array().optional()
    })
};

// Express Middleware Sanitizers
export const characterAddSanitize = (req: any, res: any, next: any) => {
    const fields = ['name', 'avatarImage', 'title', 'tagline', 'description', 'categoryId', 'greetingMessage', 'personalityPrompt', 'exampleConversations', 'status'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const characterUpdateSanitize = (req: any, res: any, next: any) => {
    const fields = ['name', 'avatarImage', 'title', 'tagline', 'description', 'categoryId', 'greetingMessage', 'personalityPrompt', 'exampleConversations', 'status'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const characterSearchSanitize = (req: any, res: any, next: any) => {
    const fields = ['categoryId', 'status', 'search'];
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

export { characterSchema };
