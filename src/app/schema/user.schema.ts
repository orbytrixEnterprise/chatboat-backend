import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService } from "../../services/field-helper.service";
import { configuration } from "../../configs";

export const userSchema = {

    guestSchema: joi.object({
        guestId: joi.string().trim().required().messages({
            "string.empty": `Guest ID is required.`,
            "any.required": `Guest ID is required.`
        })
    }),

    socialLoginSchema: joi.object({
        provider: joi.string().trim().valid("google", "apple").required().messages({
            "any.only": `Provider must be google or apple.`,
            "any.required": `Provider is required.`
        }),
        socialId: joi.string().trim().required().messages({
            "string.empty": `Social ID is required.`,
            "any.required": `Social ID is required.`
        }),
        emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
            "string.empty": `Email address is required.`,
            "any.required": `Email address is required.`,
            'string.pattern.base': `Email address is invalid.`
        }),
        name: joi.string().trim().max(500).allow("").optional(),
        guestId: joi.string().trim().allow("").optional()
    }),

    signupSchema: joi.object({
        name: joi.string().trim().max(500).required().messages({
            "string.empty": `User name is required.`,
            "any.required": `User name is required.`
        }),
        emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
            "string.empty": `Email address is required.`,
            "any.required": `Email address is required.`,
            'string.pattern.base': `Email address is invalid.`
        }),
        mobileNo: joi.string().trim().max(15).pattern(configuration.mobileNoPattern).allow("").optional().messages({
            'string.pattern.base': `Mobile number is invalid.`
        }),
        password: joi.string().min(6).max(100).required().messages({
            "any.required": `Password is required.`,
            "string.min": `Password must be at least 6 characters.`
        }),
        guestId: joi.string().trim().allow("").optional()
    }),

    loginSchema: joi.object({
        emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
            "string.empty": `Email address is required.`,
            "any.required": `Email address is required.`,
            'string.pattern.base': `Email address is invalid.`
        }),
        password: joi.string().trim().max(100).required().messages({
            "string.empty": `Password is required.`,
            "any.required": `Password is required.`
        })
    }),

    profileUpdateSchema: joi.object({
        name: joi.string().trim().max(500).optional(),
        mobileNo: joi.string().trim().max(15).pattern(configuration.mobileNoPattern).allow("").optional(),
        address: joi.string().trim().max(1000).allow("").optional(),
        profileImage: joi.string().trim().max(300).allow("").optional()
    }),

    SearchUserSchema: joi.object({
        name: joi.string().trim().max(500).allow("").optional(),
        emailId: joi.string().trim().max(320).allow("").optional(),
        mobileNo: joi.string().trim().max(15).allow("").optional(),
        userType: joi.string().trim().valid("ADMIN", "USER").allow("").optional(),
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

export const guestSanitize = (req: any, res: any, next: any) => {
    if (FieldHelperService.undefinedAndNullCheck(req.body.guestId)) {
        req.body.guestId = decode(req.sanitize(req.body.guestId + ""));
    }
    next();
};

export const socialLoginSanitize = (req: any, res: any, next: any) => {
    const fields = ["provider", "socialId", "emailId", "name", "guestId"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const signupSanitize = (req: any, res: any, next: any) => {
    const fields = ["name", "emailId", "mobileNo", "password", "guestId"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const loginSanitize = (req: any, res: any, next: any) => {
    const fields = ["emailId", "password"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const profileUpdateSanitize = (req: any, res: any, next: any) => {
    const fields = ["name", "mobileNo", "address", "profileImage"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const userSearchSanitize = (req: any, res: any, next: any) => {
    const fields = ["name", "emailId", "mobileNo", "userType", "status", "search", "page", "noOf"];
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
