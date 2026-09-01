import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { CharacterController } from "../controller";
import {
    characterSchema,
    characterAddSanitize,
    characterUpdateSanitize,
    characterSearchSanitize
} from "../schema";

const characterRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/Character/";

    // Add new character
    router.post(routerPath + "Add", [Global.isAuthorized, checkUserActive, characterAddSanitize, middleware(characterSchema.addSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.add();
    });

    // Update existing character
    router.post(routerPath + "Update", [Global.isAuthorized, checkUserActive, characterUpdateSanitize, middleware(characterSchema.updateSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.update();
    });

    // Select character details by ID
    router.get(routerPath + "SelectById/:characterId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.selectById();
    });

    // Search characters
    router.post(routerPath + "Search", [Global.isAuthorized, checkUserActive, characterSearchSanitize, middleware(characterSchema.searchSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.search();
    });

    // Delete character
    router.delete(routerPath + "Delete/:characterId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.delete();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { characterRoute };
