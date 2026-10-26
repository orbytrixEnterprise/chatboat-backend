import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { CharacterController } from "../controller";
import {
    characterSchema,
    characterAddSanitize,
    characterCreateMyCharacterSanitize,
    characterUpdateSanitize,
    characterSearchSanitize,
    characterGenerateAvatarSanitize,
    characterMyCustomSanitize,
    characterUserCharactersSanitize
} from "../schema";

const characterRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/Character/";

    // Add new character (Admin / Full Configuration)
    router.post(routerPath + "Add", [Global.isAuthorized, checkUserActive, characterAddSanitize, middleware(characterSchema.addSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.add();
    });

    // Create personal character (Simplified user payload, defaults visibility to PRIVATE)
    router.post(routerPath + "CreateMyCharacter", [Global.isAuthorized, checkUserActive, characterCreateMyCharacterSanitize, middleware(characterSchema.createMyCharacterSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.createMyCharacter();
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

    // Search characters (respects visibility: PUBLIC, createdBy: user)
    router.post(routerPath + "Search", [Global.isAuthorized, checkUserActive, characterSearchSanitize, middleware(characterSchema.searchSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.search();
    });

    // Delete character
    router.delete(routerPath + "Delete/:characterId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.delete();
    });

    // Free AI Avatar Image Generator (Pollinations.ai engine)
    router.post(routerPath + "GenerateAvatar", [Global.isAuthorized, checkUserActive, characterGenerateAvatarSanitize, middleware(characterSchema.generateAvatarSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.generateAvatar();
    });

    // My Custom Characters (created by authenticated user)
    router.post(routerPath + "MyCustomCharacters", [Global.isAuthorized, checkUserActive, characterMyCustomSanitize, middleware(characterSchema.myCustomCharactersSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.myCustomCharacters();
    });

    // Admin: Characters created by a specific user
    router.post(routerPath + "UserCharacters", [Global.isAuthorized, checkUserActive, characterUserCharactersSanitize, middleware(characterSchema.userCharactersSchema, "body")], (req: any, res: any) => {
        const task = (new CharacterController()).boot(req, res);
        return task.userCharacters();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { characterRoute };
