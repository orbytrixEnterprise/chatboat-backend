import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService } from "../../services";

const chatSchema = {
    startOrGetSchema: joi.object().keys({
        characterId: joi.string().required()
    }),

    sendMessageSchema: joi.object().keys({
        conversationId: joi.number().required().integer(),
        message: joi.string().required().min(1).max(4000)
    }),

    conversationsSchema: joi.object().keys({
        page: joi.number().required().integer().min(1),
        noOf: joi.number().required().integer().min(1),
        search: joi.string().optional().allow('')
    }),

    myCharactersSchema: joi.object().keys({
        page: joi.number().optional().integer().min(1),
        noOf: joi.number().optional().integer().min(1),
        search: joi.string().optional().allow('')
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
    if (FieldHelperService.undefinedAndNullCheck(req.body.search)) {
        req.body.search = decode(req.sanitize(req.body.search + ""));
    }
    next();
};

export const chatMyCharactersSanitize = (req: any, res: any, next: any) => {
    if (FieldHelperService.undefinedAndNullCheck(req.body.search)) {
        req.body.search = decode(req.sanitize(req.body.search + ""));
    }
    next();
};

export { chatSchema };
