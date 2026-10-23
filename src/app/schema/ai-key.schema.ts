import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService } from "../../services/field-helper.service";

export const aiKeySchema = {

    addSchema: joi.object({
        provider: joi.string().trim().valid("grok", "openai", "gemini", "claude", "openrouter", "groq").required().messages({
            "any.only": `Provider must be grok, openai, gemini, claude, openrouter, or groq.`,
            "any.required": `Provider is required.`
        }),
        apiKey: joi.string().trim().required().messages({
            "string.empty": `API Key is required.`,
            "any.required": `API Key is required.`
        }),
        model: joi.string().trim().required().messages({
            "string.empty": `Model name is required.`,
            "any.required": `Model name is required.`
        }),
        baseUrl: joi.string().trim().allow("").required().messages({
            "any.required": `Base URL is required.`
        }),
        priority: joi.number().integer().min(0).required().messages({
            "number.base": `Priority must be a number.`,
            "any.required": `Priority is required.`
        }),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE", "").allow("").required().messages({
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        })
    }),

    updateSchema: joi.object({
        keyId: joi.number().integer().min(0).required().messages({
            "number.base": `Key ID must be a number.`,
            "any.required": `Key ID is required.`
        }),
        provider: joi.string().trim().valid("grok", "openai", "gemini", "claude", "openrouter", "groq", "").allow("").required().messages({
            "any.only": `Provider must be grok, openai, gemini, claude, openrouter, or groq.`,
            "any.required": `Provider is required.`
        }),
        apiKey: joi.string().trim().allow("").required().messages({
            "any.required": `API Key is required.`
        }),
        model: joi.string().trim().allow("").required().messages({
            "any.required": `Model name is required.`
        }),
        baseUrl: joi.string().trim().allow("").required().messages({
            "any.required": `Base URL is required.`
        }),
        priority: joi.number().integer().min(0).required().messages({
            "number.base": `Priority must be a number.`,
            "any.required": `Priority is required.`
        }),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE", "").allow("").required().messages({
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        })
    }),

    statusSchema: joi.object({
        keyId: joi.number().integer().min(0).required().messages({
            "number.base": `Key ID must be a number.`,
            "any.required": `Key ID is required.`
        }),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE").required().messages({
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        })
    }),

    searchSchema: joi.object({
        provider: joi.string().trim().valid("grok", "openai", "gemini", "claude", "openrouter", "groq", "").allow("").required().messages({
            "any.required": `Provider is required.`
        }),
        model: joi.string().trim().allow("").required().messages({
            "any.required": `Model is required.`
        }),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE", "").allow("").required().messages({
            "any.required": `Status is required.`
        }),
        search: joi.string().trim().allow("").required().messages({
            "any.required": `Search is required.`
        }),
        page: joi.number().integer().min(0).required().messages({
            "number.base": `Page must be a number.`,
            "any.required": `Page is required.`
        }),
        noOf: joi.number().integer().min(0).required().messages({
            "number.base": `Number of records must be a number.`,
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
    })
};

// ==========================================
// Sanitizer Middleware
// ==========================================

export const aiKeyAddSanitize = (req: any, res: any, next: any) => {
    if (req.body.baseUrl === undefined || req.body.baseUrl === null) {
        req.body.baseUrl = "";
    }
    if (req.body.priority === undefined || req.body.priority === null) {
        req.body.priority = 0;
    }
    if (req.body.status === undefined || req.body.status === null) {
        req.body.status = "ACTIVE";
    }

    const fields = ["provider", "apiKey", "model", "baseUrl", "status"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const aiKeyUpdateSanitize = (req: any, res: any, next: any) => {
    if (req.body.provider === undefined || req.body.provider === null) {
        req.body.provider = "";
    }
    if (req.body.apiKey === undefined || req.body.apiKey === null) {
        req.body.apiKey = "";
    }
    if (req.body.model === undefined || req.body.model === null) {
        req.body.model = "";
    }
    if (req.body.baseUrl === undefined || req.body.baseUrl === null) {
        req.body.baseUrl = "";
    }
    if (req.body.priority === undefined || req.body.priority === null) {
        req.body.priority = 0;
    }
    if (req.body.status === undefined || req.body.status === null) {
        req.body.status = "";
    }

    const fields = ["provider", "apiKey", "model", "baseUrl", "status"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const aiKeyStatusSanitize = (req: any, res: any, next: any) => {
    if (FieldHelperService.undefinedAndNullCheck(req.body.status)) {
        req.body.status = decode(req.sanitize(req.body.status + ""));
    }
    next();
};

export const aiKeySearchSanitize = (req: any, res: any, next: any) => {
    if (req.body.provider === undefined || req.body.provider === null) {
        req.body.provider = "";
    }
    if (req.body.model === undefined || req.body.model === null) {
        req.body.model = "";
    }
    if (req.body.status === undefined || req.body.status === null) {
        req.body.status = "";
    }
    if (req.body.search === undefined || req.body.search === null) {
        req.body.search = "";
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

    const fields = ["provider", "model", "status", "search", "page", "noOf"];
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
