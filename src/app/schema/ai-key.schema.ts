import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService } from "../../services/field-helper.service";

export const aiKeySchema = {

    addSchema: joi.object({
        provider: joi.string().trim().valid("grok", "openai", "gemini", "claude").required().messages({
            "any.only": `Provider must be grok, openai, gemini, or claude.`,
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
        baseUrl: joi.string().trim().allow("").optional(),
        priority: joi.number().integer().optional(),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE").optional()
    }),

    updateSchema: joi.object({
        keyId: joi.number().integer().required().messages({
            "any.required": `Key ID is required.`
        }),
        provider: joi.string().trim().valid("grok", "openai", "gemini", "claude").required().messages({
            "any.only": `Provider must be grok, openai, gemini, or claude.`,
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
        baseUrl: joi.string().trim().allow("").optional(),
        priority: joi.number().integer().optional(),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE").optional()
    }),

    statusSchema: joi.object({
        keyId: joi.number().integer().required().messages({
            "any.required": `Key ID is required.`
        }),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE").required().messages({
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        })
    }),

    searchSchema: joi.object({
        provider: joi.string().trim().valid("grok", "openai", "gemini", "claude").allow("").optional(),
        model: joi.string().trim().allow("").optional(),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE").allow("").optional(),
        search: joi.string().trim().allow("").required(),
        page: joi.number().integer().positive().required(),
        noOf: joi.number().integer().positive().required(),
        filter: joi.array().items(joi.object({
            key: joi.string().trim().required(),
            type: joi.string().trim().valid('contains', 'equals', 'start with', 'end with').required(),
            value: joi.string().trim().required()
        })).default([]),
        orderBy: joi.array().items(joi.object({
            key: joi.string().trim().required(),
            orderType: joi.string().trim().valid('asc', 'desc').required()
        })).default([])
    })
};

// ==========================================
// Sanitizer Middleware
// ==========================================

export const aiKeyAddSanitize = (req: any, res: any, next: any) => {
    const fields = ["provider", "apiKey", "model", "baseUrl", "status"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const aiKeyUpdateSanitize = (req: any, res: any, next: any) => {
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
