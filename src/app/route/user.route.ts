import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { UserController } from "../controller";
import {
    userSchema,
    guestSanitize,
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

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { userRoute };
