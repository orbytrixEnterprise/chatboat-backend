import tags from "../tag-constant";
import { SwaggerService } from "../common";

export const addCharacter = {
    post: {
        tags: [tags.character],
        summary: "Authorized User Access",
        description: "Add a new AI character persona.",
        operationId: "addCharacter",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("addCharacterInput"),
        responses: SwaggerService.successResponse("Character created successfully.", "characterOutput")
    }
};

export const updateCharacter = {
    post: {
        tags: [tags.character],
        summary: "Authorized User Access",
        description: "Update an existing AI character attributes.",
        operationId: "updateCharacter",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("updateCharacterInput"),
        responses: SwaggerService.successResponse("Character updated successfully.", "characterOutput")
    }
};

export const selectByIdCharacter = {
    get: {
        tags: [tags.character],
        summary: "Authorized User Access",
        description: "Get AI character details by ID.",
        operationId: "selectByIdCharacter",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "characterId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse("Character details retrieved successfully.", "characterOutput")
    }
};

export const searchCharacter = {
    post: {
        tags: [tags.character],
        summary: "Authorized User Access",
        description: "Search AI characters with pagination, filters and sorting.",
        operationId: "searchCharacter",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("searchCharacterInput"),
        responses: SwaggerService.successResponse("Characters retrieved successfully.", "characterSearchOutput")
    }
};

export const deleteCharacter = {
    delete: {
        tags: [tags.character],
        summary: "Authorized User Access",
        description: "Delete an AI character.",
        operationId: "deleteCharacter",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "characterId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse("Character deleted successfully.", "characterCommonOutput")
    }
};
