import tags from "../tag-constant";
import response from '../../configs/response';
import { SwaggerService } from "../common";

export const addPurchase = {
    post: {
        tags: [tags.purchase],
        summary: "Shop Authorized User Access",
        description: "Create a new purchase with items.",
        operationId: "purchaseAdd",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchaseAddInput"),
        responses: SwaggerService.successResponse(response["481"], "purchaseAddOutput")
    }
};

export const updatePurchase = {
    put: {
        tags: [tags.purchase],
        summary: "Shop Authorized User Access",
        description: "Update purchase details.",
        operationId: "purchaseUpdate",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchaseUpdateInput"),
        responses: SwaggerService.successResponse(response["482"], "purchaseUpdateOutput")
    }
};

export const deletePurchase = {
    delete: {
        tags: [tags.purchase],
        summary: "Shop Authorized User Access",
        description: "Delete purchase.",
        operationId: "purchaseDelete",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "purchaseId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse(response["483"], "purchaseDeleteOutput")
    }
};

export const selectByIdPurchase = {
    get: {
        tags: [tags.purchase],
        summary: "Authorized User Access",
        description: "Get purchase details by id.",
        operationId: "purchaseSelectById",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "purchaseId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse(response["484"], "purchaseSelectByIdOutput")
    }
};

export const searchPurchase = {
    post: {
        tags: [tags.purchase],
        summary: "Authorized User Access",
        description: "Search purchases with pagination, filters and sorting.",
        operationId: "purchaseSearch",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchaseSearchInput"),
        responses: SwaggerService.successResponse(response["487"], "purchaseSearchOutput")
    }
};
