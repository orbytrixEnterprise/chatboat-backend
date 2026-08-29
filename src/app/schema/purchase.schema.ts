import joi from "joi";
import { decode } from "html-entities";
import { FieldHelperService } from "../../services/field-helper.service";

export const purchaseSchema = {

    AddSchema: joi.object({

        shopId: joi.number().integer().positive().required().messages({
            "any.required": `Shop id is required.`,
            "number.base": `Shop id must be a number.`,
            "number.positive": `Shop id must be a positive number.`
        }),

        vendorId: joi.number().integer().positive().required().messages({
            "any.required": `Vendor id is required.`,
            "number.base": `Vendor id must be a number.`,
            "number.positive": `Vendor id must be a positive number.`
        }),

        purchaseDate: joi.string().trim().required().messages({
            "any.required": `Purchase date is required.`,
            "string.empty": `Purchase date is required.`
        }),

        remark: joi.string().trim().max(1000).allow("").required().messages({
            "any.required": `Remark is required.`,
            "string.max": `Remark must be less than or equal to 1000 characters long.`
        }),

        roundOffAmount: joi.number().allow(0).required().messages({
            "any.required": `Round off amount is required.`,
            "number.base": `Round off amount must be a number.`
        }),

        detailJson: joi.array().items(
            joi.object({
                purchaseDetailId: joi.number().integer().min(0).allow(0).required().messages({
                    "any.required": `Purchase detail id is required.`,
                    "number.base": `Purchase detail id must be a number.`,
                    "number.min": `Purchase detail id must be greater than or equal to 0.`
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
                remark: joi.string().trim().allow("").required().messages({
                    "any.required": `Remark is required.`
                })
            })
        ).min(1).required().messages({
            "any.required": `Purchase details are required.`,
            "array.base": `Purchase details must be an array.`,
            "array.min": `At least one purchase detail item is required.`
        })

    }),


    UpdateSchema: joi.object({

        purchaseId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase id is required.`,
            "number.base": `Purchase id must be a number.`,
            "number.positive": `Purchase id must be a positive number.`
        }),

        shopId: joi.number().integer().positive().required().messages({
            "any.required": `Shop id is required.`,
            "number.base": `Shop id must be a number.`,
            "number.positive": `Shop id must be a positive number.`
        }),

        vendorId: joi.number().integer().positive().required().messages({
            "any.required": `Vendor id is required.`,
            "number.base": `Vendor id must be a number.`,
            "number.positive": `Vendor id must be a positive number.`
        }),

        purchaseDate: joi.string().trim().required().messages({
            "any.required": `Purchase date is required.`,
            "string.empty": `Purchase date is required.`
        }),

        remark: joi.string().trim().max(1000).allow("").required().messages({
            "any.required": `Remark is required.`,
            "string.max": `Remark must be less than or equal to 1000 characters long.`
        }),

        roundOffAmount: joi.number().allow(0).required().messages({
            "any.required": `Round off amount is required.`,
            "number.base": `Round off amount must be a number.`
        }),

        detailJson: joi.array().items(
            joi.object({
                purchaseDetailId: joi.number().integer().min(0).allow(0).required().messages({
                    "any.required": `Purchase detail id is required.`,
                    "number.base": `Purchase detail id must be a number.`,
                    "number.min": `Purchase detail id must be greater than or equal to 0.`
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
                remark: joi.string().trim().allow("").required().messages({
                    "any.required": `Remark is required.`
                })
            })
        ).optional()

    }),


    DeleteSchema: joi.object({

        purchaseId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase id is required.`,
            "number.base": `Purchase id must be a number.`,
            "number.positive": `Purchase id must be a positive number.`
        })

    }),


    SelectByIdSchema: joi.object({

        purchaseId: joi.number().integer().positive().required().messages({
            "any.required": `Purchase id is required.`,
            "number.base": `Purchase id must be a number.`,
            "number.positive": `Purchase id must be a positive number.`
        })

    }),


    SearchSchema: joi.object({

        shopId: joi.number().integer().positive().allow(0).required().messages({
            "any.required": `Shop id is required.`,
            "number.base": `Shop id must be a number.`
        }),

        vendorId: joi.number().integer().positive().allow(0).required().messages({
            "any.required": `Vendor id is required.`,
            "number.base": `Vendor id must be a number.`
        }),

        purchaseNo: joi.string().trim().allow("").required().messages({
            "string.empty": `Purchase no is required.`,
            "any.required": `Purchase no is required.`
        }),

        purchaseDate: joi.string().trim().allow("").required().messages({
            "string.empty": `Purchase date is required.`,
            "any.required": `Purchase date is required.`
        }),

        fromDate: joi.string().trim().allow("").required().messages({
            "string.empty": `From date is required.`,
            "any.required": `From date is required.`
        }),

        toDate: joi.string().trim().allow("").required().messages({
            "string.empty": `To date is required.`,
            "any.required": `To date is required.`
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


export const addPurchaseSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "shopId", "vendorId", "purchaseDate", "remark", "roundOffAmount"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }

    if (req.body.detailJson && Array.isArray(req.body.detailJson)) {
        for (const item of req.body.detailJson) {
            const itemFields = ["purchaseDetailId", "categoryId", "brandId", "colorId", "rate", "sellingPrice", "minimumStockQty", "meter", "cgstId", "sgstId", "igstId", "remark"];
            for (const f of itemFields) {
                if (FieldHelperService.undefinedAndNullCheck(item[f])) {
                    item[f] = decode(req.sanitize(item[f] + ""));
                }
            }
        }
    }

    next();

};


export const updatePurchaseSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "purchaseId", "shopId", "vendorId", "purchaseDate", "remark", "roundOffAmount"
    ];

    for (const field of fieldsToSanitize) {

        if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
            req.body[field] = decode(req.sanitize(req.body[field] + ""));
        }
    }

    if (req.body.detailJson && Array.isArray(req.body.detailJson)) {
        for (const item of req.body.detailJson) {
            const itemFields = ["purchaseDetailId", "categoryId", "brandId", "colorId", "rate", "sellingPrice", "minimumStockQty", "meter", "cgstId", "sgstId", "igstId", "remark"];
            for (const f of itemFields) {
                if (FieldHelperService.undefinedAndNullCheck(item[f])) {
                    item[f] = decode(req.sanitize(item[f] + ""));
                }
            }
        }
    }

    next();

};


export const deletePurchaseSanitize = (req: any, res: any, next: any) => {

    if (FieldHelperService.undefinedAndNullCheck(req.params.purchaseId)) {
        req.params.purchaseId = decode(req.sanitize(req.params.purchaseId));
    }

    next();

};


export const selectByPurchaseIdSanitize = (req: any, res: any, next: any) => {

    if (FieldHelperService.undefinedAndNullCheck(req.params.purchaseId)) {
        req.params.purchaseId = decode(req.sanitize(req.params.purchaseId));
    }

    next();

};


export const searchPurchaseSanitize = async (req: any, res: any, next: any) => {

    const fieldsToSanitize = [
        "shopId", "vendorId", "purchaseNo", "purchaseDate", "fromDate", "toDate", "search", "page", "noOf"
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
