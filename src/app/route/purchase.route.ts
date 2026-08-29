import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { PurchaseController } from "../controller";
import {
    purchaseSchema,
    addPurchaseSanitize,
    updatePurchaseSanitize,
    deletePurchaseSanitize,
    selectByPurchaseIdSanitize,
    searchPurchaseSanitize
} from "../schema";

const purchaseRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/Purchase/";

    router.post(routerPath + "Add", [Global.isShopAuthorized, checkUserActive, addPurchaseSanitize, middleware(purchaseSchema.AddSchema, "body")], (req: any, res: any) => {
        const task = (new PurchaseController()).boot(req, res);
        return task.add();
    });

    router.put(routerPath + "Update", [Global.isShopAuthorized, checkUserActive, updatePurchaseSanitize, middleware(purchaseSchema.UpdateSchema, "body")], (req: any, res: any) => {
        const task = (new PurchaseController()).boot(req, res);
        return task.update();
    });

    router.delete(routerPath + "Delete/:purchaseId", [Global.isShopAuthorized, checkUserActive, deletePurchaseSanitize, middleware(purchaseSchema.DeleteSchema, "params")], (req: any, res: any) => {
        const task = (new PurchaseController()).boot(req, res);
        return task.delete();
    });

    router.get(routerPath + "SelectById/:purchaseId", [Global.isAuthorized, selectByPurchaseIdSanitize, middleware(purchaseSchema.SelectByIdSchema, "params")], (req: any, res: any) => {
        const task = (new PurchaseController()).boot(req, res);
        return task.selectById();
    });

    router.post(routerPath + "Search", [Global.isAuthorized, searchPurchaseSanitize, middleware(purchaseSchema.SearchSchema, "body")], (req: any, res: any) => {
        const task = (new PurchaseController()).boot(req, res);
        return task.search();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { purchaseRoute };
