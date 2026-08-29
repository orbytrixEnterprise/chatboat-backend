import { configuration, Global, middleware } from "../../configs";
import { PurchasePaymentController } from "../controller";
import {
    addPurchasePaymentSanitize,
    deletePurchasePaymentSanitize,
    purchasePaymentSchema,
    searchPurchasePaymentSanitize,
    selectByPurchasePaymentIdSanitize,
    updatePurchasePaymentSanitize
} from "../schema";

const purchasePaymentRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/PurchasePayment/";

    router.post(routerPath + "Add", [Global.isAuthorized, addPurchasePaymentSanitize, middleware(purchasePaymentSchema.AddSchema, "body")], (req: any, res: any) => {
        const task = (new PurchasePaymentController()).boot(req, res);
        return task.add();
    });

    router.put(routerPath + "Update", [Global.isAuthorized, updatePurchasePaymentSanitize, middleware(purchasePaymentSchema.UpdateSchema, "body")], (req: any, res: any) => {
        const task = (new PurchasePaymentController()).boot(req, res);
        return task.update();
    });

    router.delete(routerPath + "Delete/:purchasePaymentId", [Global.isAuthorized, deletePurchasePaymentSanitize, middleware(purchasePaymentSchema.DeleteSchema, "params")], (req: any, res: any) => {
        const task = (new PurchasePaymentController()).boot(req, res);
        return task.delete();
    });

    router.get(routerPath + "SelectById/:purchasePaymentId", [Global.isAuthorized, selectByPurchasePaymentIdSanitize, middleware(purchasePaymentSchema.SelectByIdSchema, "params")], (req: any, res: any) => {
        const task = (new PurchasePaymentController()).boot(req, res);
        return task.selectById();
    });

    router.put(routerPath + "Search", [Global.isAuthorized, searchPurchasePaymentSanitize, middleware(purchasePaymentSchema.SearchSchema, "body")], (req: any, res: any) => {
        const task = (new PurchasePaymentController()).boot(req, res);
        return task.search();
    });

    app.use(configuration.baseApiUrl, router);

    return app;

};

export { purchasePaymentRoute };
