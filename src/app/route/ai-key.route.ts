import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { AiKeyController } from "../controller";
import {
    aiKeySchema,
    aiKeyAddSanitize,
    aiKeyUpdateSanitize,
    aiKeyStatusSanitize,
    aiKeySearchSanitize
} from "../schema";

const aiKeyRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/AiKey/";

    // Add new key
    router.post(routerPath + "Add", [Global.isAuthorized, checkUserActive, aiKeyAddSanitize, middleware(aiKeySchema.addSchema, "body")], (req: any, res: any) => {
        const task = (new AiKeyController()).boot(req, res);
        return task.add();
    });

    // Update existing key
    router.post(routerPath + "Update", [Global.isAuthorized, checkUserActive, aiKeyUpdateSanitize, middleware(aiKeySchema.updateSchema, "body")], (req: any, res: any) => {
        const task = (new AiKeyController()).boot(req, res);
        return task.update();
    });

    // Change key status
    router.post(routerPath + "Status", [Global.isAuthorized, checkUserActive, aiKeyStatusSanitize, middleware(aiKeySchema.statusSchema, "body")], (req: any, res: any) => {
        const task = (new AiKeyController()).boot(req, res);
        return task.changeStatus();
    });

    // Select key details by ID
    router.get(routerPath + "SelectById/:keyId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new AiKeyController()).boot(req, res);
        return task.selectById();
    });

    // Search keys
    router.post(routerPath + "Search", [Global.isAuthorized, checkUserActive, aiKeySearchSanitize, middleware(aiKeySchema.searchSchema, "body")], (req: any, res: any) => {
        const task = (new AiKeyController()).boot(req, res);
        return task.search();
    });

    // Delete key
    router.delete(routerPath + "Delete/:keyId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new AiKeyController()).boot(req, res);
        return task.delete();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { aiKeyRoute };
