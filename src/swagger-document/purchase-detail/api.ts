import tags from "../tag-constant";
import response from '../../configs/response';
import { SwaggerService } from "../common";

export const addPurchaseDetail = {
    post: {
        tags: [tags.purchaseDetail],
        summary: "Shop Authorized User Access",
        description: "Add a purchase detail item.",
        operationId: "purchaseDetailAdd",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchaseDetailAddInput"),
        responses: SwaggerService.successResponse(response["501"], "purchaseDetailAddOutput")
    }
};

export const updatePurchaseDetail = {
    put: {
        tags: [tags.purchaseDetail],
        summary: "Shop Authorized User Access",
        description: "Update purchase detail item.",
        operationId: "purchaseDetailUpdate",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchaseDetailUpdateInput"),
        responses: SwaggerService.successResponse(response["502"], "purchaseDetailUpdateOutput")
    }
};

export const deletePurchaseDetail = {
    delete: {
        tags: [tags.purchaseDetail],
        summary: "Shop Authorized User Access",
        description: "Delete purchase detail item.",
        operationId: "purchaseDetailDelete",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "purchaseDetailId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse(response["503"], "purchaseDetailDeleteOutput")
    }
};

export const selectByIdPurchaseDetail = {
    get: {
        tags: [tags.purchaseDetail],
        summary: "Authorized User Access",
        description: "Get purchase detail item by id.",
        operationId: "purchaseDetailSelectById",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "purchaseDetailId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse(response["504"], "purchaseDetailSelectByIdOutput")
    }
};

export const getOldDetailValuePurchaseDetail = {
    post: {
        tags: [tags.purchaseDetail],
        summary: "Authorized User Access",
        description: "Get last purchase detail record by shopId, categoryId, brandId, colorId.",
        operationId: "purchaseDetailGetOldDetailValue",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchaseDetailGetOldDetailValueInput"),
        responses: SwaggerService.successResponse(response["508"], "purchaseDetailGetOldDetailValueOutput")
    }
};

export const addUpdateItemImagePurchaseDetail = {
    put: {
        tags: [tags.purchaseDetail],
        summary: "Shop Authorized User Access",
        description: "Add or update purchase detail item image.",
        operationId: "purchaseDetailAddUpdateItemImage",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchaseDetailAddUpdateItemImageInput"),
        responses: SwaggerService.successResponse(response["509"], "purchaseDetailAddUpdateItemImageOutput")
    }
};

export const searchPurchaseDetail = {
    post: {
        tags: [tags.purchaseDetail],
        summary: "Authorized User Access",
        description: "Search purchase detail items with pagination, filters and sorting.",
        operationId: "purchaseDetailSearch",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchaseDetailSearchInput"),
        responses: SwaggerService.successResponse(response["507"], "purchaseDetailSearchOutput")
    }
};
