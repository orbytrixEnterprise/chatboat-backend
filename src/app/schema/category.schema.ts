import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService } from "../../services";

const categorySchema = {
    addSchema: joi.object().keys({
        name: joi.string().required().min(1).max(100).messages({
            "string.empty": `Category name is required.`,
            "string.min": `Category name must be at least 1 character.`,
            "string.max": `Category name cannot exceed 100 characters.`,
            "any.required": `Category name is required.`
        }),
        priority: joi.number().required().integer().min(0).messages({
            "number.base": `Priority must be a number.`,
            "number.min": `Priority must be greater than or equal to 0.`,
            "any.required": `Priority is required.`
        }),
        status: joi.string().required().valid("ACTIVE", "INACTIVE", "").allow('').messages({
            "string.base": `Status must be a string.`,
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        })
    }),

    updateSchema: joi.object().keys({
        categoryId: joi.number().required().integer().min(0).messages({
            "number.base": `Category ID must be a number.`,
            "number.min": `Category ID must be greater than or equal to 0.`,
            "any.required": `Category ID is required.`
        }),
        name: joi.string().required().allow('').max(100).messages({
            "string.base": `Category name must be a string.`,
            "string.max": `Category name cannot exceed 100 characters.`,
            "any.required": `Category name is required.`
        }),
        priority: joi.number().required().integer().min(0).messages({
            "number.base": `Priority must be a number.`,
            "number.min": `Priority must be greater than or equal to 0.`,
            "any.required": `Priority is required.`
        }),
        status: joi.string().required().valid("ACTIVE", "INACTIVE", "").allow('').messages({
            "string.base": `Status must be a string.`,
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        })
    }),

    searchSchema: joi.object().keys({
        status: joi.string().required().allow('').messages({
            "string.base": `Status must be a string.`,
            "any.required": `Status is required.`
        }),
        search: joi.string().required().allow('').messages({
            "string.base": `Search query must be a string.`,
            "any.required": `Search query is required.`
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
    })
};

// Express Middleware Sanitizers
export const categoryAddSanitize = (req: any, res: any, next: any) => {
    if (req.body.priority === undefined || req.body.priority === null) {
        req.body.priority = 0;
    }
    if (req.body.status === undefined || req.body.status === null) {
        req.body.status = "ACTIVE";
    }
    const fields = ['name', 'status'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const categoryUpdateSanitize = (req: any, res: any, next: any) => {
    if (req.body.name === undefined || req.body.name === null) {
        req.body.name = "";
    }
    if (req.body.priority === undefined || req.body.priority === null) {
        req.body.priority = 0;
    }
    if (req.body.status === undefined || req.body.status === null) {
        req.body.status = "";
    }
    const fields = ['name', 'status'];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const categorySearchSanitize = (req: any, res: any, next: any) => {
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
