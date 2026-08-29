/****************************
 FORM HANDLING OPERATIONS
 ****************************/
import multiparty from "multiparty";

export class FormService {

    request: any;

    constructor(request : any) {
        this.request = request;
    }

    parse() {
        return new Promise((resolve, reject) => {

            try {
                const form = new multiparty.Form();

                // Parsing the form
                form.parse(this.request, (err : any, fields : any, files : any) => {
                    if (err) {
                        resolve({ message: err.message });
                    }

                    const formParseObject: any = {};
                    formParseObject.fields = fields;
                    formParseObject.files = files;

                    resolve(formParseObject);

                });
            } catch (error : any) {
                reject({ message: error.toString() });
            }

        });
    }

}