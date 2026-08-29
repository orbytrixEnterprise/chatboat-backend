import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { UserController } from "../controller";
import {
    userSchema,
    selectByUserIdSanitize,
    logInSanitize,
    userSearchSanitize,
    passwordUpdateSanitize,
    adminPasswordUpdateSanitize,
    forgotPasswordSanitize,
    resetPasswordSanitize
} from "../schema";

const userRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/User/";

    router.post( routerPath + "Login", [ logInSanitize, middleware(userSchema.loginSchema, "body") ], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.login();
    });

    router.get( routerPath + "SelectById/:userId", [ Global.isAuthorized, selectByUserIdSanitize, middleware(userSchema.SelectByIdSchema, "params") ], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.selectById();
    });

    router.post( routerPath + "Search", [ Global.isAuthorized, userSearchSanitize, middleware(userSchema.SearchUserSchema, "body") ], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.searchUser();
    });

    router.put( routerPath + "PasswordUpdate", [ Global.isAuthorized, checkUserActive, passwordUpdateSanitize, middleware(userSchema.passwordUpdateSchema, "body") ], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.passwordUpdate();
    });

    router.put( routerPath + "AdminPasswordUpdate", [ Global.isAdminAuthorized, checkUserActive, adminPasswordUpdateSanitize, middleware(userSchema.adminPasswordUpdateSchema, "body") ], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.adminPasswordUpdate();
    });

    router.post( routerPath + "ForgotPassword", [ forgotPasswordSanitize, middleware(userSchema.forgotPasswordSchema, "body") ], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.forgotPassword();
    });

    router.post( routerPath + "ResetPassword", [ resetPasswordSanitize, middleware(userSchema.resetPasswordSchema, "body") ], (req: any, res: any) => {
        const task = (new UserController()).boot(req, res);
        return task.resetPassword();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { userRoute };
