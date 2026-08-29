import tags from "../tag-constant";
import response from '../../configs/response';
import { SwaggerService } from "../common";

export const addPurchasePayment = {
    post: {
        tags: [tags.purchasePayment],
        summary: "Shop Authorized User Access",
        description: "Add new purchase payment.",
        operationId: "purchasePaymentAdd",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchasePaymentAddInput"),
        responses: SwaggerService.successResponse(response["601"], "purchasePaymentAddOutput")
    }
};

export const updatePurchasePayment = {
    put: {
        tags: [tags.purchasePayment],
        summary: "Shop Authorized User Access",
        description: "Update purchase payment details.",
        operationId: "purchasePaymentUpdate",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchasePaymentUpdateInput"),
        responses: SwaggerService.successResponse(response["602"], "purchasePaymentUpdateOutput")
    }
};

export const deletePurchasePayment = {
    delete: {
        tags: [tags.purchasePayment],
        summary: "Shop Authorized User Access",
        description: "Delete purchase payment.",
        operationId: "purchasePaymentDelete",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "purchasePaymentId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse(response["603"], "purchasePaymentDeleteOutput")
    }
};

export const selectByIdPurchasePayment = {
    get: {
        tags: [tags.purchasePayment],
        summary: "Shop Authorized User Access",
        description: "Get purchase payment details by ID.",
        operationId: "purchasePaymentSelectById",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "purchasePaymentId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse(response["604"], "purchasePaymentSelectByIdOutput")
    }
};

export const searchPurchasePayment = {
    put: {
        tags: [tags.purchasePayment],
        summary: "Shop Authorized User Access",
        description: "Search purchase payments with pagination and filters.",
        operationId: "purchasePaymentSearch",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("purchasePaymentSearchInput"),
        responses: SwaggerService.successResponse(response["607"], "purchasePaymentSearchOutput")
    }
};
