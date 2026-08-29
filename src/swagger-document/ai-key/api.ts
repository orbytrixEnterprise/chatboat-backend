import tags from "../tag-constant";
import { SwaggerService } from "../common";

export const addAiKey = {
    post: {
        tags: [tags.aikey], // Group with user/admin management
        summary: "Admin Authorized User Access",
        description: "Add a new AI API Key for failover rotation.",
        operationId: "addAiKey",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("addAiKeyInput"),
        responses: SwaggerService.successResponse("AI API Key added successfully.", "aiKeyOutput")
    }
};

export const updateAiKey = {
    post: {
        tags: [tags.aikey],
        summary: "Admin Authorized User Access",
        description: "Update an existing AI API Key properties.",
        operationId: "updateAiKey",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("updateAiKeyInput"),
        responses: SwaggerService.successResponse("AI API Key updated successfully.", "aiKeyOutput")
    }
};

export const changeStatusAiKey = {
    post: {
        tags: [tags.aikey],
        summary: "Admin Authorized User Access",
        description: "Change status of an AI API Key (ACTIVE or INACTIVE).",
        operationId: "changeStatusAiKey",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("statusAiKeyInput"),
        responses: SwaggerService.successResponse("AI API Key status updated successfully.", "aiKeyOutput")
    }
};

export const selectByIdAiKey = {
    get: {
        tags: [tags.aikey],
        summary: "Admin Authorized User Access",
        description: "Get AI API Key details by ID.",
        operationId: "selectByIdAiKey",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "keyId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse("AI API Key details retrieved successfully.", "aiKeyOutput")
    }
};

export const searchAiKey = {
    post: {
        tags: [tags.aikey],
        summary: "Admin Authorized User Access",
        description: "Search AI API Keys with pagination, filters and sorting.",
        operationId: "searchAiKey",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("searchAiKeyInput"),
        responses: SwaggerService.successResponse("AI API Keys retrieved successfully.", "aiKeySearchOutput")
    }
};

export const deleteAiKey = {
    delete: {
        tags: [tags.aikey],
        summary: "Admin Authorized User Access",
        description: "Delete an AI API Key.",
        operationId: "deleteAiKey",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "keyId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse("AI API Key deleted successfully.", "aiKeyCommonOutput")
    }
};
