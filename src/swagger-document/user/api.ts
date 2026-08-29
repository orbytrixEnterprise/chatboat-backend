import tags from "../tag-constant";
import response from '../../configs/response';
import { SwaggerService } from "../common";

export const loginUser = {
    post: {
        tags: [tags.user],
        summary: "Public Access",
        description: "User login.",
        operationId: "userLogin",
        requestBody: SwaggerService.requestBody("loginInput"),
        responses: SwaggerService.successResponse(response["202"], "loginOutput")
    }
};

export const selectByIdUser = {
    get: {
        tags: [tags.user],
        summary: "Authorized User Access",
        description: "Get user details by id.",
        operationId: "userSelectById",
        security: SwaggerService.bearerAuth(),
        parameters: SwaggerService.parameters([
            {
                name: "userId",
                in: "path",
                type: "integer",
                required: true,
                example: 1
            }
        ]),
        responses: SwaggerService.successResponse(response["225"], "userSelectByIdOutput")
    }
};

export const searchUser = {
    post: {
        tags: [tags.user],
        summary: "Authorized User Access",
        description: "Search users with pagination, filters and sorting.",
        operationId: "userSearch",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("userSearchInput"),
        responses: SwaggerService.successResponse(response["225"], "userSearchOutput")
    }
};

export const passwordUpdateUser = {
    put: {
        tags: [tags.user],
        summary: "Authorized User Access",
        description: "Update password of the logged-in user.",
        operationId: "userPasswordUpdate",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("userPasswordUpdateInput"),
        responses: SwaggerService.successResponse(response["203"], "userPasswordUpdateOutput")
    }
};

export const adminPasswordUpdateUser = {
    put: {
        tags: [tags.user],
        summary: "Admin Authorized User Access",
        description: "Admin updates password of any user.",
        operationId: "adminPasswordUpdate",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("adminPasswordUpdateInput"),
        responses: SwaggerService.successResponse(response["203"], "adminPasswordUpdateOutput")
    }
};

export const forgotPasswordUser = {
    post: {
        tags: [tags.user],
        summary: "Public Access",
        description: "Request a forgot password email link.",
        operationId: "userForgotPassword",
        requestBody: SwaggerService.requestBody("userForgotPasswordInput"),
        responses: SwaggerService.successResponse(response["236"], "userForgotPasswordOutput")
    }
};

export const resetPasswordUser = {
    post: {
        tags: [tags.user],
        summary: "Public Access",
        description: "Reset password using token received via email.",
        operationId: "userResetPassword",
        requestBody: SwaggerService.requestBody("userResetPasswordInput"),
        responses: SwaggerService.successResponse(response["203"], "userResetPasswordOutput")
    }
};