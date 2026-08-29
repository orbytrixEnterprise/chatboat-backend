import joi from "joi";
import { decode } from "html-entities";
import { configuration } from "../../configs";
import { FieldHelperService } from "../../services";

export const purchasePaymentSchema = {

    AddSchema: joi.object({

        vendorId: joi.number().integer().positive().required().messages({
            "any.required": `Vendor id is required.`,
            "number.base": `Vendor id must be a number.`,
            "number.positive": `Vendor id must be a positive number.`
        }),

        amount: joi.number().positive().required().messages({
            "any.required": `Amount is required.`,
            "number.base": `Amount must be a number.`,
            "number.positive": `Amount must be a positive number.`
        }),

        paymentModeId: joi.number().integer().positive().required().messages({
            "any.required": `Payment mode id is required.`,
            "number.base": `Payment mode id must be a number.`,
            "number.positive": `Payment mode id must be a positive number.`
        }),

        paymentDate: joi.string().trim().regex(configuration.datePattern).required().messages({
            "string.empty": `Payment date is required.`,
            "any.required": `Payment date is required.`,
            "string.pattern.base": `Payment date format must be YYYY-MM-DD.`
        }),

        remark: joi.string().trim().max(500).allow("").required().messages({
            "any.required": `Remark is required.`,
            "string.max": `Remark must be less than or equal to 500 characters long.`
        })

    }),


    UpdateSchema: joi.object({

        purchasePaymentId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase payment id is required.`,
            "number.base": `Purchase payment id must be a number.`,
            "number.positive": `Purchase payment id must be a positive number.`
        }),

        vendorId: joi.number().integer().positive().required().messages({
            "any.required": `Vendor id is required.`,
            "number.base": `Vendor id must be a number.`,
            "number.positive": `Vendor id must be a positive number.`
        }),

        amount: joi.number().positive().required().messages({
            "any.required": `Amount is required.`,
            "number.base": `Amount must be a number.`,
            "number.positive": `Amount must be a positive number.`
        }),

        paymentModeId: joi.number().integer().positive().required().messages({
            "any.required": `Payment mode id is required.`,
            "number.base": `Payment mode id must be a number.`,
            "number.positive": `Payment mode id must be a positive number.`
        }),

        paymentDate: joi.string().trim().regex(configuration.datePattern).required().messages({
            "string.empty": `Payment date is required.`,
            "any.required": `Payment date is required.`,
            "string.pattern.base": `Payment date format must be YYYY-MM-DD.`
        }),

        remark: joi.string().trim().max(500).allow("").required().messages({
            "any.required": `Remark is required.`,
            "string.max": `Remark must be less than or equal to 500 characters long.`
        })

    }),


    DeleteSchema: joi.object({

        purchasePaymentId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase payment id is required.`,
            "number.base": `Purchase payment id must be a number.`,
            "number.positive": `Purchase payment id must be a positive number.`
        })

    }),


    SelectByIdSchema: joi.object({

        purchasePaymentId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase payment id is required.`,
            "number.base": `Purchase payment id must be a number.`,
            "number.positive": `Purchase payment id must be a positive number.`
        })

    }),


    SearchSchema: joi.object({

        vendorId: joi.number().integer().positive().allow(0).required().messages({
            "any.required": `Vendor id is required.`,
            "number.base": `Vendor id must be a number.`
        }),

        search: joi.string().trim().allow("").required().messages({
            "any.required": `Search term is required.`
        }),

        page: joi.number().integer().positive().required().messages({
            "any.required": `Page number is required.`,
            "number.base": `Page number must be a number.`,
            "number.positive": `Page number must be a positive integer.`
        }),

        noOf: joi.number().integer().positive().required().messages({
            "any.required": `Number of records is required.`,
            "number.base": `Number of records must be a number.`,
            "number.positive": `Number of records must be a positive integer.`
        }),

        filter: joi.array().items(

            joi.object({

                key: joi.string().trim().required().messages({
                    "string.empty": `Filter key is required.`,
                    "any.required": `Filter key is required.`
                }),

                value: joi.string().trim().required().messages({
                    "string.empty": `Filter value is required.`,
                    "any.required": `Filter value is required.`
                })

            })

        ).required().messages({
            "any.required": `Filter is required.`,
            "array.base": `Filter must be an array.`
        }),

        orderBy: joi.array().items(

            joi.object({

                key: joi.string().trim().required().messages({
                    "string.empty": `Order by key is required.`,
                    "any.required": `Order by key is required.`
                }),

                orderType: joi.string().trim().valid("asc", "desc").required().messages({
                    "string.empty": `Order type is required.`,
                    "any.required": `Order type is required.`,
                    "any.only": `Order type must be one of Ascending or Descending.`
                })

            })

        ).required().messages({
            "any.required": `Order by is required.`,
            "array.base": `Order by must be an array.`
        })

    })

};


export const addPurchasePaymentSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "vendorId", "amount", "paymentModeId", "paymentDate", "remark"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }

    next();

};


export const updatePurchasePaymentSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "purchasePaymentId", "vendorId", "amount", "paymentModeId", "paymentDate", "remark"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }

    next();

};


export const deletePurchasePaymentSanitize = (req: any, res: any, next: any) => {

    if (FieldHelperService.undefinedAndNullCheck(req.params.purchasePaymentId)) {
        req.params.purchasePaymentId = decode(req.sanitize(req.params.purchasePaymentId));
    }

    next();

};


export const selectByPurchasePaymentIdSanitize = (req: any, res: any, next: any) => {

    if (FieldHelperService.undefinedAndNullCheck(req.params.purchasePaymentId)) {
        req.params.purchasePaymentId = decode(req.sanitize(req.params.purchasePaymentId));
    }

    next();

};


export const searchPurchasePaymentSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "vendorId", "search", "page", "noOf"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }


    if (req.body.filter && Array.isArray(req.body.filter)) {

        for (const element of req.body.filter) {

            if (FieldHelperService.undefinedAndNullCheck(element.key)) {
                element.key = decode(req.sanitize(element.key));
            }

            if (FieldHelperService.undefinedAndNullCheck(element.value)) {
                element.value = decode(req.sanitize(element.value));
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
