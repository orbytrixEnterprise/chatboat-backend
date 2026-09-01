import { configuration, Global, middleware } from "../../configs";
import { UploadController } from "../controller";
import { addFileSanitize, removeFileSanitize, uploadSchemas } from "../schema";

const uploadRoute = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/Upload/";

    router.post( routerPath + "AddFile", [ Global.isAuthorized, addFileSanitize, middleware(uploadSchemas.AddFileSchema, "body") ], (req: any, res: any) => {
        const task = (new UploadController()).boot(req, res);
        return task.uploadFile();
    });

    router.put( routerPath + "RemoveFile", [ Global.isAuthorized, removeFileSanitize, middleware(uploadSchemas.RemoveFileSchema, "body") ], (req: any, res: any) => {
        const task = (new UploadController()).boot(req, res);
        return task.removeFile();
    });

    app.use(configuration.baseApiUrl, router);

    return app;
};

export { uploadRoute };