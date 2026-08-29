import joi from "joi";
import { decode } from "html-entities";
import { FieldHelperService } from "../../services/field-helper.service";

export const purchaseDetailSchema = {

    AddSchema: joi.object({

        purchaseId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase id is required.`,
            "number.base": `Purchase id must be a number.`,
            "number.positive": `Purchase id must be a positive number.`
        }),

        categoryId: joi.number().integer().positive().required().messages({
            "any.required": `Category id is required.`,
            "number.base": `Category id must be a number.`,
            "number.positive": `Category id must be a positive number.`
        }),

        brandId: joi.number().integer().positive().required().messages({
            "any.required": `Brand id is required.`,
            "number.base": `Brand id must be a number.`,
            "number.positive": `Brand id must be a positive number.`
        }),

        colorId: joi.number().integer().positive().required().messages({
            "any.required": `Color id is required.`,
            "number.base": `Color id must be a number.`,
            "number.positive": `Color id must be a positive number.`
        }),

        rate: joi.number().min(0).required().messages({
            "any.required": `Rate is required.`,
            "number.base": `Rate must be a number.`,
            "number.min": `Rate must be greater than or equal to 0.`
        }),

        sellingPrice: joi.number().min(0).required().messages({
            "any.required": `Selling price is required.`,
            "number.base": `Selling price must be a number.`,
            "number.min": `Selling price must be greater than or equal to 0.`
        }),

        minimumStockQty: joi.number().min(0).required().messages({
            "any.required": `Minimum stock qty is required.`,
            "number.base": `Minimum stock qty must be a number.`,
            "number.min": `Minimum stock qty must be greater than or equal to 0.`
        }),

        meter: joi.number().positive().required().messages({
            "any.required": `Meter is required.`,
            "number.base": `Meter must be a number.`,
            "number.positive": `Meter must be a positive number.`
        }),

        cgstId: joi.number().integer().positive().required().messages({
            "any.required": `CGST id is required.`,
            "number.base": `CGST id must be a number.`,
            "number.positive": `CGST id must be a positive number.`
        }),

        sgstId: joi.number().integer().positive().required().messages({
            "any.required": `SGST id is required.`,
            "number.base": `SGST id must be a number.`,
            "number.positive": `SGST id must be a positive number.`
        }),

        igstId: joi.number().integer().positive().required().messages({
            "any.required": `IGST id is required.`,
            "number.base": `IGST id must be a number.`,
            "number.positive": `IGST id must be a positive number.`
        }),

        remark: joi.string().trim().max(1000).allow("").required().messages({
            "any.required": `Remark is required.`
        })

    }),


    UpdateSchema: joi.object({

        purchaseDetailId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase detail id is required.`,
            "number.base": `Purchase detail id must be a number.`,
            "number.positive": `Purchase detail id must be a positive number.`
        }),

        purchaseId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase id is required.`,
            "number.base": `Purchase id must be a number.`,
            "number.positive": `Purchase id must be a positive number.`
        }),

        categoryId: joi.number().integer().positive().required().messages({
            "any.required": `Category id is required.`,
            "number.base": `Category id must be a number.`,
            "number.positive": `Category id must be a positive number.`
        }),

        brandId: joi.number().integer().positive().required().messages({
            "any.required": `Brand id is required.`,
            "number.base": `Brand id must be a number.`,
            "number.positive": `Brand id must be a positive number.`
        }),

        colorId: joi.number().integer().positive().required().messages({
            "any.required": `Color id is required.`,
            "number.base": `Color id must be a number.`,
            "number.positive": `Color id must be a positive number.`
        }),

        rate: joi.number().min(0).required().messages({
            "any.required": `Rate is required.`,
            "number.base": `Rate must be a number.`,
            "number.min": `Rate must be greater than or equal to 0.`
        }),

        sellingPrice: joi.number().min(0).required().messages({
            "any.required": `Selling price is required.`,
            "number.base": `Selling price must be a number.`,
            "number.min": `Selling price must be greater than or equal to 0.`
        }),

        minimumStockQty: joi.number().min(0).required().messages({
            "any.required": `Minimum stock qty is required.`,
            "number.base": `Minimum stock qty must be a number.`,
            "number.min": `Minimum stock qty must be greater than or equal to 0.`
        }),

        meter: joi.number().positive().required().messages({
            "any.required": `Meter is required.`,
            "number.base": `Meter must be a number.`,
            "number.positive": `Meter must be a positive number.`
        }),

        cgstId: joi.number().integer().positive().required().messages({
            "any.required": `CGST id is required.`,
            "number.base": `CGST id must be a number.`,
            "number.positive": `CGST id must be a positive number.`
        }),

        sgstId: joi.number().integer().positive().required().messages({
            "any.required": `SGST id is required.`,
            "number.base": `SGST id must be a number.`,
            "number.positive": `SGST id must be a positive number.`
        }),

        igstId: joi.number().integer().positive().required().messages({
            "any.required": `IGST id is required.`,
            "number.base": `IGST id must be a number.`,
            "number.positive": `IGST id must be a positive number.`
        }),

        remark: joi.string().trim().max(1000).allow("").required().messages({
            "any.required": `Remark is required.`
        })

    }),


    DeleteSchema: joi.object({

        purchaseDetailId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase detail id is required.`,
            "number.base": `Purchase detail id must be a number.`,
            "number.positive": `Purchase detail id must be a positive number.`
        })

    }),


    SelectByIdSchema: joi.object({

        purchaseDetailId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase detail id is required.`,
            "number.base": `Purchase detail id must be a number.`,
            "number.positive": `Purchase detail id must be a positive number.`
        })

    }),


    GetOldDetailValueSchema: joi.object({

        shopId: joi.number().integer().positive().required().messages({
            "any.required": `Shop id is required.`,
            "number.base": `Shop id must be a number.`,
            "number.positive": `Shop id must be a positive number.`
        }),

        categoryId: joi.number().integer().positive().required().messages({
            "any.required": `Category id is required.`,
            "number.base": `Category id must be a number.`,
            "number.positive": `Category id must be a positive number.`
        }),

        brandId: joi.number().integer().positive().required().messages({
            "any.required": `Brand id is required.`,
            "number.base": `Brand id must be a number.`,
            "number.positive": `Brand id must be a positive number.`
        }),

        colorId: joi.number().integer().positive().required().messages({
            "any.required": `Color id is required.`,
            "number.base": `Color id must be a number.`,
            "number.positive": `Color id must be a positive number.`
        })

    }),


    AddUpdateItemImageSchema: joi.object({

        purchaseDetailId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase detail id is required.`,
            "number.base": `Purchase detail id must be a number.`,
            "number.positive": `Purchase detail id must be a positive number.`
        }),

        itemImage: joi.string().trim().allow("").required().messages({
            "any.required": `Item image is required.`
        })

    }),


    SearchSchema: joi.object({

        shopId: joi.number().integer().positive().allow(0).required().messages({
            "any.required": `Shop id is required.`,
            "number.base": `Shop id must be a number.`
        }),

        purchaseId: joi.number().integer().positive().allow(0).required().messages({
            "any.required": `Purchase id is required.`,
            "number.base": `Purchase id must be a number.`
        }),

        categoryId: joi.number().integer().positive().allow(0).required().messages({
            "any.required": `Category id is required.`,
            "number.base": `Category id must be a number.`
        }),

        brandId: joi.number().integer().positive().allow(0).required().messages({
            "any.required": `Brand id is required.`,
            "number.base": `Brand id must be a number.`
        }),

        colorId: joi.number().integer().positive().allow(0).required().messages({
            "any.required": `Color id is required.`,
            "number.base": `Color id must be a number.`
        }),

        detailNo: joi.string().trim().allow("").required().messages({
            "string.empty": `Detail no is required.`,
            "any.required": `Detail no is required.`
        }),

        search: joi.string().trim().allow("").required().messages({
            "string.empty": `Search is required.`,
            "any.required": `Search is required.`
        }),

        page: joi.number().integer().positive().required().messages({
            "any.required": `Page is required.`,
            "number.base": `Page must be a number.`,
            "number.integer": `Page must be an integer.`,
            "number.positive": `Page must be greater than 0.`
        }),

        noOf: joi.number().integer().positive().required().messages({
            "any.required": `No of is required.`,
            "number.base": `No of must be a number.`,
            "number.integer": `No of must be an integer.`,
            "number.positive": `No of must be greater than 0.`
        }),

        filter: joi.array().items(
            joi.object({

                key: joi.string().trim().required().messages({
                    "string.empty": `Filter key is required.`,
                    "any.required": `Filter key is required.`
                }),

                type: joi.string().trim().valid("contains", "equals", "start with", "end with").required().messages({
                    "string.empty": `Filter type is required.`,
                    "any.required": `Filter type is required.`,
                    "any.only": `Filter type must be one of 'contains', 'equals', 'start with' or 'end with'.`
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


export const addPurchaseDetailSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "purchaseId", "categoryId", "brandId", "colorId", "rate", "sellingPrice", "minimumStockQty", "meter", "cgstId", "sgstId", "igstId", "remark"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }

    next();

};


export const updatePurchaseDetailSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "purchaseDetailId", "purchaseId", "categoryId", "brandId", "colorId", "rate", "sellingPrice", "minimumStockQty", "meter", "cgstId", "sgstId", "igstId", "remark"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }

    next();

};


export const deletePurchaseDetailSanitize = (req: any, res: any, next: any) => {

    if (FieldHelperService.undefinedAndNullCheck(req.params.purchaseDetailId)) {
        req.params.purchaseDetailId = decode(req.sanitize(req.params.purchaseDetailId));
    }

    next();

};


export const selectByPurchaseDetailIdSanitize = (req: any, res: any, next: any) => {

    if (FieldHelperService.undefinedAndNullCheck(req.params.purchaseDetailId)) {
        req.params.purchaseDetailId = decode(req.sanitize(req.params.purchaseDetailId));
    }

    next();

};


export const getOldDetailValueSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "shopId", "categoryId", "brandId", "colorId"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }

    next();

};


export const addUpdateItemImageSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "purchaseDetailId", "itemImage"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }

    next();

};


export const searchPurchaseDetailSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "shopId", "purchaseId", "categoryId", "brandId", "colorId", "detailNo", "search", "page", "noOf"
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
