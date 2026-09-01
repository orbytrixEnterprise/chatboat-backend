import { Controller } from './controller';
import { applicationLogger, response } from '../../configs';
import { FileService } from '../../services';

export class UploadController extends Controller {

    constructor() {
        super();
    }

    /**
     * uploadFile function is created for upload file
     *
     * @memberof UploadController
     */
    async uploadFile() {
        try {
            const formObject = this.req.body;
            const body = formObject.fields;

            const files = formObject.files?.file;

            if (!files || files.length === 0) {
                return this.res.status(200).send({ status: 0, message: response['113'] });
            }

            const uploadedFiles: string[] = [];

            for (const file of files) {
                const filePath: any = await FileService.uploadFile(file, body.folder);
                uploadedFiles.push(filePath);
            }

            return this.res.status(200).send({ status: 1, message: response['112'], data: uploadedFiles });

        } catch (err: any) {
            applicationLogger.error(`UploadController uploadFile`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response['100'], error: err.toString() });
        }
    }

    /**
     * removeFile function is created for remove file
     *
     * @memberof UploadController
     */
    async removeFile() {
        try {
            const body = this.req.body;
            const files = body.file;

            if (!files || files.length === 0) {
                return this.res.status(200).send({ status: 0, message: "No files provided" });
            }

            for (const element of files) {
                await FileService.removeFile(element.filePath);
            }

            return this.res.status(200).send({ status: 1, message: response['114'] });

        } catch (err: any) {
            applicationLogger.error(`UploadController removeFile`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response['100'], error: err.toString() });
        }
    }

}