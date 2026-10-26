import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService } from "../../services";

const chatSchema = {
    startOrGetSchema: joi.object().keys({
        characterId: joi.alternatives().try(joi.string().min(1), joi.number().min(0)).required().messages({
            "alternatives.match": `Character ID must be a valid string or number.`,
            "any.required": `Character ID is required.`
        })
    }),

    sendMessageSchema: joi.object().keys({
        conversationId: joi.number().required().integer().min(0).messages({
            "number.base": `Conversation ID must be a number.`,
            "number.min": `Conversation ID must be greater than or equal to 0.`,
            "any.required": `Conversation ID is required.`
        }),
        message: joi.string().required().min(1).max(4000).messages({
            "string.base": `Message must be a string.`,
            "string.empty": `Message cannot be empty.`,
            "string.min": `Message must be at least 1 character.`,
            "string.max": `Message cannot exceed 4000 characters.`,
            "any.required": `Message is required.`
        })
    }),

    conversationsSchema: joi.object().keys({
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
        })
    }),

    myCharactersSchema: joi.object().keys({
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
        })
    }),

    userChattedCharactersSchema: joi.object().keys({
        userId: joi.number().required().integer().min(0).messages({
            "number.base": `User ID must be a number.`,
            "number.min": `User ID must be greater than or equal to 0.`,
            "any.required": `User ID is required.`
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
        search: joi.string().required().allow('').messages({
            "string.base": `Search query must be a string.`,
            "any.required": `Search query is required.`
        })
    })
};

// Express Middleware Sanitizers
export const chatStartOrGetSanitize = (req: any, res: any, next: any) => {
    if (FieldHelperService.undefinedAndNullCheck(req.body.characterId)) {
        req.body.characterId = decode(req.sanitize(req.body.characterId + ""));
    }
    next();
};

export const chatSendMessageSanitize = (req: any, res: any, next: any) => {
    if (FieldHelperService.undefinedAndNullCheck(req.body.message)) {
        req.body.message = decode(req.sanitize(req.body.message + ""));
    }
    next();
};

export const chatConversationsSanitize = (req: any, res: any, next: any) => {
    if (req.body.page === undefined || req.body.page === null) {
        req.body.page = 1;
    } else {
        req.body.page = Number(req.body.page);
    }
    if (req.body.noOf === undefined || req.body.noOf === null) {
        req.body.noOf = 20;
    } else {
        req.body.noOf = Number(req.body.noOf);
    }
    if (req.body.search === undefined || req.body.search === null) {
        req.body.search = "";
    } else {
        req.body.search = decode(req.sanitize(req.body.search + ""));
    }
    next();
};

export const chatMyCharactersSanitize = (req: any, res: any, next: any) => {
    if (req.body.page === undefined || req.body.page === null) {
        req.body.page = 1;
    } else {
        req.body.page = Number(req.body.page);
    }
    if (req.body.noOf === undefined || req.body.noOf === null) {
        req.body.noOf = 20;
    } else {
        req.body.noOf = Number(req.body.noOf);
    }
    if (req.body.search === undefined || req.body.search === null) {
        req.body.search = "";
    } else {
        req.body.search = decode(req.sanitize(req.body.search + ""));
    }
    next();
};

export const chatUserChattedSanitize = (req: any, res: any, next: any) => {
    if (req.body.userId === undefined || req.body.userId === null) {
        req.body.userId = 0;
    } else {
        req.body.userId = Number(req.body.userId);
    }
    if (req.body.page === undefined || req.body.page === null) {
        req.body.page = 1;
    } else {
        req.body.page = Number(req.body.page);
    }
    if (req.body.noOf === undefined || req.body.noOf === null) {
        req.body.noOf = 20;
    } else {
        req.body.noOf = Number(req.body.noOf);
    }
    if (req.body.search === undefined || req.body.search === null) {
        req.body.search = "";
    } else {
        req.body.search = decode(req.sanitize(req.body.search + ""));
    }
    next();
};

export { chatSchema };
