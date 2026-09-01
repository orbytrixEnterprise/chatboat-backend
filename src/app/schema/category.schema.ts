import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService } from "../../services";

const categorySchema = {
    addSchema: joi.object().keys({
        name: joi.string().required().min(2).max(100),
        priority: joi.number().optional().integer(),
        status: joi.string().optional().valid("ACTIVE", "INACTIVE")
    }),

    updateSchema: joi.object().keys({
        categoryId: joi.number().required().integer(),
        name: joi.string().optional().min(2).max(100),
        priority: joi.number().optional().integer(),
        status: joi.string().optional().valid("ACTIVE", "INACTIVE")
    }),

    searchSchema: joi.object().keys({
        status: joi.string().optional().allow(''),
        search: joi.string().optional().allow(''),
        page: joi.number().required().integer().min(1),
        noOf: joi.number().required().integer().min(1),
        filter: joi.array().optional(),
        orderBy: joi.array().optional()
    })
};

// Express Middleware Sanitizers
export const categoryAddSanitize = (req: any, res: any, next: any) => {
    const fields = ['name', 'status'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const categoryUpdateSanitize = (req: any, res: any, next: any) => {
    const fields = ['name', 'status'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const categorySearchSanitize = (req: any, res: any, next: any) => {
    const fields = ['status', 'search'];
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

export { categorySchema };
