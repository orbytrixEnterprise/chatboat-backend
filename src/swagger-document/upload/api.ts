import tags from "../tag-constant";
import { SwaggerService } from "../common";

export const uploadFile = {
    post: {
        tags: [tags.upload],
        summary: "Authorized User Access",
        description: "Upload one or more files in multipart form-data.",
        operationId: "uploadFile",
        security: SwaggerService.bearerAuth(),
        requestBody: {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        $ref: "#/components/schemas/addFileInput"
                    }
                }
            }
        },
        responses: SwaggerService.successResponse("File uploaded successfully.", "uploadSuccessOutput")
    }
};

export const removeFile = {
    put: {
        tags: [tags.upload],
        summary: "Authorized User Access",
        description: "Delete one or more uploaded files from storage.",
        operationId: "removeFile",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("removeFileInput"),
        responses: SwaggerService.successResponse("File removed successfully.", "uploadCommonOutput")
    }
};
