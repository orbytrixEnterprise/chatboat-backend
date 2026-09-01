import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { CategoryController } from "../controller";
import {
    categorySchema,
    categoryAddSanitize,
    categoryUpdateSanitize,
    categorySearchSanitize
} from "../schema";

const categoryRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/Category/";

    // Add new Category
    router.post(routerPath + "Add", [Global.isAuthorized, checkUserActive, categoryAddSanitize, middleware(categorySchema.addSchema, "body")], (req: any, res: any) => {
        const task = (new CategoryController()).boot(req, res);
        return task.add();
    });

    // Update existing Category
    router.post(routerPath + "Update", [Global.isAuthorized, checkUserActive, categoryUpdateSanitize, middleware(categorySchema.updateSchema, "body")], (req: any, res: any) => {
        const task = (new CategoryController()).boot(req, res);
        return task.update();
    });

    // Select Category details by ID
    router.get(routerPath + "SelectById/:categoryId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new CategoryController()).boot(req, res);
        return task.selectById();
    });

    // Search Categories
    router.post(routerPath + "Search", [Global.isAuthorized, checkUserActive, categorySearchSanitize, middleware(categorySchema.searchSchema, "body")], (req: any, res: any) => {
        const task = (new CategoryController()).boot(req, res);
        return task.search();
    });

    // Delete Category
    router.delete(routerPath + "Delete/:categoryId", [Global.isAuthorized, checkUserActive], (req: any, res: any) => {
        const task = (new CategoryController()).boot(req, res);
        return task.delete();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { categoryRoute };
