/****************************
 REQUEST PARAM SET CONTROLLER
 ****************************/
export class Controller {
    req: any;
    res: any;
    boot(req: any, res: any) {
        this.req = req;
        this.res = res;
        return this;
    }
}