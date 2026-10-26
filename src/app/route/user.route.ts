import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { UserController } from "../controller";
import {
    userSchema,
    guestSanitize,
    checkSocialAccountSanitize,
    socialLoginSanitize,
    signupSanitize,
    loginSanitize,
    profileUpdateSanitize,
    userSearchSanitize
} from "../schema";

const userRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/User/";

    // Guest Authentication
    router.post(routerPath + "Guest", [guestSanitize, middleware(userSchema.guestSchema, "body")], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.guest();
    });

    // Pre-login verification for Google/Apple OAuth & merge feasibility
    router.post(routerPath + "CheckSocial", [checkSocialAccountSanitize, middleware(userSchema.checkSocialAccountSchema, "body")], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.checkSocial();
    });

    // Google/Apple OAuth login
    router.post(routerPath + "SocialLogin", [socialLoginSanitize, middleware(userSchema.socialLoginSchema, "body")], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.socialLogin();
    });

    // Manual Signup
    router.post(routerPath + "Signup", [signupSanitize, middleware(userSchema.signupSchema, "body")], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.signup();
    });

    // Manual Login
    router.post(routerPath + "Login", [loginSanitize, middleware(userSchema.loginSchema, "body")], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.login();
    });

    // Get current profile
    router.get(routerPath + "Profile", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.profile();
    });

    // Update profile
    router.post(routerPath + "UpdateProfile", [Global.isAuthorized, checkUserActive, profileUpdateSanitize, middleware(userSchema.profileUpdateSchema, "body")], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.updateProfile();
    });

    // Search Users
    router.post(routerPath + "Search", [Global.isAuthorized, checkUserActive, userSearchSanitize, middleware(userSchema.SearchUserSchema, "body")], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.searchUser();
    });

    // Delete Account (iOS App Store Guideline 5.1.1(v) compliance)
    router.delete(routerPath + "DeleteAccount", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.deleteAccount();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { userRoute };
