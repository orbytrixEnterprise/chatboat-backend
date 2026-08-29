import tags from "../tag-constant";
import { SwaggerService } from "../common";

export const guestUser = {
    post: {
        tags: [tags.user],
        summary: "Guest Access",
        description: "Register or initialize a guest user session using a guestId.",
        operationId: "userGuest",
        requestBody: SwaggerService.requestBody("guestInput"),
        responses: SwaggerService.successResponse("Guest session initialized successfully.", "authOutput")
    }
};

export const socialLoginUser = {
    post: {
        tags: [tags.user],
        summary: "Social Access",
        description: "Login or signup via Google/Apple, optionally linking with a legacy guest session.",
        operationId: "userSocialLogin",
        requestBody: SwaggerService.requestBody("socialLoginInput"),
        responses: SwaggerService.successResponse("Social login completed successfully.", "authOutput")
    }
};

export const signupUser = {
    post: {
        tags: [tags.user],
        summary: "Manual Access",
        description: "Sign up manually with name, email, password, and optionally a guestId to link.",
        operationId: "userSignup",
        requestBody: SwaggerService.requestBody("signupInput"),
        responses: SwaggerService.successResponse("Account created successfully.", "authOutput")
    }
};

export const loginUser = {
    post: {
        tags: [tags.user],
        summary: "Manual Access",
        description: "Login manually with email address and password.",
        operationId: "userLogin",
        requestBody: SwaggerService.requestBody("loginInput"),
        responses: SwaggerService.successResponse("Logged in successfully.", "authOutput")
    }
};

export const profileUser = {
    get: {
        tags: [tags.user],
        summary: "Authorized User Access",
        description: "Get logged-in user profile details.",
        operationId: "userProfile",
        security: SwaggerService.bearerAuth(),
        responses: SwaggerService.successResponse("Profile retrieved successfully.", "profileOutput")
    }
};

export const updateProfileUser = {
    post: {
        tags: [tags.user],
        summary: "Authorized User Access",
        description: "Update logged-in user profile details.",
        operationId: "userUpdateProfile",
        security: SwaggerService.bearerAuth(),
        requestBody: SwaggerService.requestBody("profileUpdateInput"),
        responses: SwaggerService.successResponse("Profile updated successfully.", "profileOutput")
    }
};