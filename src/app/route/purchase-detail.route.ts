import { checkUserActive, configuration, Global, middleware } from "../../configs";
import { PurchaseDetailController } from "../controller";
import {
    purchaseDetailSchema,
    addPurchaseDetailSanitize,
    updatePurchaseDetailSanitize,
    deletePurchaseDetailSanitize,
    selectByPurchaseDetailIdSanitize,
    getOldDetailValueSanitize,
    addUpdateItemImageSanitize,
    searchPurchaseDetailSanitize
} from "../schema";

const purchaseDetailRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/PurchaseDetail/";

    router.post(routerPath + "Add", [Global.isShopAuthorized, checkUserActive, addPurchaseDetailSanitize, middleware(purchaseDetailSchema.AddSchema, "body")], (req: any, res: any) => {
        const task = (new PurchaseDetailController()).boot(req, res);
        return task.add();
    });

    router.put(routerPath + "Update", [Global.isShopAuthorized, checkUserActive, updatePurchaseDetailSanitize, middleware(purchaseDetailSchema.UpdateSchema, "body")], (req: any, res: any) => {
        const task = (new PurchaseDetailController()).boot(req, res);
        return task.update();
    });

    router.delete(routerPath + "Delete/:purchaseDetailId", [Global.isShopAuthorized, checkUserActive, deletePurchaseDetailSanitize, middleware(purchaseDetailSchema.DeleteSchema, "params")], (req: any, res: any) => {
        const task = (new PurchaseDetailController()).boot(req, res);
        return task.delete();
    });

    router.get(routerPath + "SelectById/:purchaseDetailId", [Global.isAuthorized, selectByPurchaseDetailIdSanitize, middleware(purchaseDetailSchema.SelectByIdSchema, "params")], (req: any, res: any) => {
        const task = (new PurchaseDetailController()).boot(req, res);
        return task.selectById();
    });

    router.post(routerPath + "getOlddetailValue", [Global.isAuthorized, getOldDetailValueSanitize, middleware(purchaseDetailSchema.GetOldDetailValueSchema, "body")], (req: any, res: any) => {
        const task = (new PurchaseDetailController()).boot(req, res);
        return task.getOldDetailValue();
    });

    router.put(routerPath + "AddUpdateItemImage", [Global.isShopAuthorized, checkUserActive, addUpdateItemImageSanitize, middleware(purchaseDetailSchema.AddUpdateItemImageSchema, "body")], (req: any, res: any) => {
        const task = (new PurchaseDetailController()).boot(req, res);
        return task.addUpdateItemImage();
    });

    router.post(routerPath + "Search", [Global.isAuthorized, searchPurchaseDetailSanitize, middleware(purchaseDetailSchema.SearchSchema, "body")], (req: any, res: any) => {
        const task = (new PurchaseDetailController()).boot(req, res);
        return task.search();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { purchaseDetailRoute };
