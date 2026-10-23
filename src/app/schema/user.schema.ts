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
            "string.base": `Provider must be a string.`,
            "any.only": `Provider must be google or apple.`,
            "any.required": `Provider is required.`
        }),
        socialId: joi.string().trim().required().messages({
            "string.base": `Social ID must be a string.`,
            "string.empty": `Social ID is required.`,
            "any.required": `Social ID is required.`
        }),
        emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
            "string.base": `Email address must be a string.`,
            "string.empty": `Email address is required.`,
            "string.max": `Email address cannot exceed 320 characters.`,
            "any.required": `Email address is required.`,
            'string.pattern.base': `Email address is invalid.`
        }),
        name: joi.string().trim().max(500).allow("").required().messages({
            "string.base": `User name must be a string.`,
            "string.max": `User name cannot exceed 500 characters.`,
            "any.required": `User name is required.`
        }),
        guestId: joi.string().trim().allow("").required().messages({
            "string.base": `Guest ID must be a string.`,
            "any.required": `Guest ID is required.`
        })
    }),

    signupSchema: joi.object({
        name: joi.string().trim().max(500).required().messages({
            "string.base": `User name must be a string.`,
            "string.empty": `User name is required.`,
            "string.max": `User name cannot exceed 500 characters.`,
            "any.required": `User name is required.`
        }),
        emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
            "string.base": `Email address must be a string.`,
            "string.empty": `Email address is required.`,
            "string.max": `Email address cannot exceed 320 characters.`,
            "any.required": `Email address is required.`,
            'string.pattern.base': `Email address is invalid.`
        }),
        mobileNo: joi.string().trim().max(15).pattern(configuration.mobileNoPattern).allow("").required().messages({
            "string.base": `Mobile number must be a string.`,
            "string.max": `Mobile number cannot exceed 15 digits.`,
            'string.pattern.base': `Mobile number is invalid.`,
            "any.required": `Mobile number is required.`
        }),
        password: joi.string().min(6).max(100).required().messages({
            "string.base": `Password must be a string.`,
            "string.empty": `Password is required.`,
            "string.min": `Password must be at least 6 characters.`,
            "string.max": `Password cannot exceed 100 characters.`,
            "any.required": `Password is required.`
        }),
        guestId: joi.string().trim().allow("").required().messages({
            "string.base": `Guest ID must be a string.`,
            "any.required": `Guest ID is required.`
        })
    }),

    loginSchema: joi.object({
        emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
            "string.base": `Email address must be a string.`,
            "string.empty": `Email address is required.`,
            "string.max": `Email address cannot exceed 320 characters.`,
            "any.required": `Email address is required.`,
            'string.pattern.base': `Email address is invalid.`
        }),
        password: joi.string().trim().max(100).required().messages({
            "string.base": `Password must be a string.`,
            "string.empty": `Password is required.`,
            "string.max": `Password cannot exceed 100 characters.`,
            "any.required": `Password is required.`
        })
    }),

    profileUpdateSchema: joi.object({
        name: joi.string().trim().max(500).allow("").required().messages({
            "string.base": `Name must be a string.`,
            "string.max": `Name cannot exceed 500 characters.`,
            "any.required": `Name is required.`
        }),
        mobileNo: joi.string().trim().max(15).pattern(configuration.mobileNoPattern).allow("").required().messages({
            "string.base": `Mobile number must be a string.`,
            "string.max": `Mobile number cannot exceed 15 digits.`,
            "string.pattern.base": `Mobile number is invalid.`,
            "any.required": `Mobile number is required.`
        }),
        address: joi.string().trim().max(1000).allow("").required().messages({
            "string.base": `Address must be a string.`,
            "string.max": `Address cannot exceed 1000 characters.`,
            "any.required": `Address is required.`
        }),
        profileImage: joi.string().trim().max(300).allow("").required().messages({
            "string.base": `Profile image URL must be a string.`,
            "string.max": `Profile image URL cannot exceed 300 characters.`,
            "any.required": `Profile image is required.`
        })
    }),

    SearchUserSchema: joi.object({
        name: joi.string().trim().max(500).allow("").required().messages({
            "string.base": `Name must be a string.`,
            "string.max": `Name cannot exceed 500 characters.`,
            "any.required": `Name is required.`
        }),
        emailId: joi.string().trim().max(320).allow("").required().messages({
            "string.base": `Email address must be a string.`,
            "string.max": `Email address cannot exceed 320 characters.`,
            "any.required": `Email address is required.`
        }),
        mobileNo: joi.string().trim().max(15).allow("").required().messages({
            "string.base": `Mobile number must be a string.`,
            "string.max": `Mobile number cannot exceed 15 digits.`,
            "any.required": `Mobile number is required.`
        }),
        userType: joi.string().trim().valid("ADMIN", "USER", "").allow("").required().messages({
            "string.base": `User type must be a string.`,
            "any.only": `User type must be ADMIN or USER.`,
            "any.required": `User type is required.`
        }),
        status: joi.string().trim().valid("ACTIVE", "INACTIVE", "").allow("").required().messages({
            "string.base": `Status must be a string.`,
            "any.only": `Status must be ACTIVE or INACTIVE.`,
            "any.required": `Status is required.`
        }),
        search: joi.string().trim().allow("").required().messages({
            "string.base": `Search query must be a string.`,
            "any.required": `Search query is required.`
        }),
        page: joi.number().integer().min(0).required().messages({
            "number.base": `Page must be a number.`,
            "number.min": `Page must be greater than or equal to 0.`,
            "any.required": `Page is required.`
        }),
        noOf: joi.number().integer().min(0).required().messages({
            "number.base": `noOf must be a number.`,
            "number.min": `noOf must be greater than or equal to 0.`,
            "any.required": `noOf is required.`
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

export const guestSanitize = (req: any, res: any, next: any) => {
    if (FieldHelperService.undefinedAndNullCheck(req.body.guestId)) {
        req.body.guestId = decode(req.sanitize(req.body.guestId + ""));
    }
    next();
};

export const socialLoginSanitize = (req: any, res: any, next: any) => {
    if (req.body.name === undefined || req.body.name === null) {req.body.name = "";}
    if (req.body.guestId === undefined || req.body.guestId === null) {req.body.guestId = "";}

    const fields = ["provider", "socialId", "emailId", "name", "guestId"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const signupSanitize = (req: any, res: any, next: any) => {
    if (req.body.mobileNo === undefined || req.body.mobileNo === null) {req.body.mobileNo = "";}
    if (req.body.guestId === undefined || req.body.guestId === null) {req.body.guestId = "";}

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
    if (req.body.name === undefined || req.body.name === null) {req.body.name = "";}
    if (req.body.mobileNo === undefined || req.body.mobileNo === null) {req.body.mobileNo = "";}
    if (req.body.address === undefined || req.body.address === null) {req.body.address = "";}
    if (req.body.profileImage === undefined || req.body.profileImage === null) {req.body.profileImage = "";}

    const fields = ["name", "mobileNo", "address", "profileImage"];
    for (const f of fields) {
        if (FieldHelperService.undefinedAndNullCheck(req.body[f])) {
            req.body[f] = decode(req.sanitize(req.body[f] + ""));
        }
    }
    next();
};

export const userSearchSanitize = (req: any, res: any, next: any) => {
    if (req.body.name === undefined || req.body.name === null) {req.body.name = "";}
    if (req.body.emailId === undefined || req.body.emailId === null) {req.body.emailId = "";}
    if (req.body.mobileNo === undefined || req.body.mobileNo === null) {req.body.mobileNo = "";}
    if (req.body.userType === undefined || req.body.userType === null) {req.body.userType = "";}
    if (req.body.status === undefined || req.body.status === null) {req.body.status = "";}
    if (req.body.search === undefined || req.body.search === null) {req.body.search = "";}
    if (req.body.page === undefined || req.body.page === null) {req.body.page = 1;}
    if (req.body.noOf === undefined || req.body.noOf === null) {req.body.noOf = 10;}
    if (req.body.filter === undefined || req.body.filter === null) {req.body.filter = [];}
    if (req.body.orderBy === undefined || req.body.orderBy === null) {req.body.orderBy = [];}

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
