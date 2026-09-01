import tags from "../tag-constant";
import { SwaggerService } from "../common";

export const addCategory = {
    post: {
        tags: [tags.category],
        summary: "Authorized User Access",
        description: "Add a new AI character category.",
        operationId: "addCategory",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("addCategoryInput"),
        responses: SwaggerService.successResponse("Category created successfully.", "categoryOutput")
    }
};

export const updateCategory = {
    post: {
        tags: [tags.category],
        summary: "Authorized User Access",
        description: "Update an existing Category.",
        operationId: "updateCategory",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("updateCategoryInput"),
        responses: SwaggerService.successResponse("Category updated successfully.", "categoryOutput")
    }
};

export const selectByIdCategory = {
    get: {
        tags: [tags.category],
        summary: "Authorized User Access",
        description: "Get Category details by ID.",
        operationId: "selectByIdCategory",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "categoryId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse("Category details retrieved successfully.", "categoryOutput")
    }
};

export const searchCategory = {
    post: {
        tags: [tags.category],
        summary: "Authorized User Access",
        description: "Search Categories with pagination, filters and sorting.",
        operationId: "searchCategory",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("searchCategoryInput"),
        responses: SwaggerService.successResponse("Categories retrieved successfully.", "categorySearchOutput")
    }
};

export const deleteCategory = {
    delete: {
        tags: [tags.category],
        summary: "Authorized User Access",
        description: "Delete a Category.",
        operationId: "deleteCategory",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "categoryId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse("Category deleted successfully.", "categoryCommonOutput")
    }
};
