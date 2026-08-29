import { applicationLogger, Global } from './';
import response from './response';
import { UserModel } from '../app/model';

export const middleware = (schema: any, property: any) => {
    return async (req: any, res: any, next: any) => {
        try {
            const requestBody = req[property];
            const body = await schema.validateAsync(requestBody);
            req[property] = body;


            next();
        } catch (error : any) {
            const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            applicationLogger.error(`Middleware`, { fullUrl: fullUrl, error: error });
            if (error.details) {
                res.status(422).send({ status: 0, message: response['103'], error: error.details[0].message });
            }
            else {
                res.status(422).send({ status: 0, message: response['103'], error: error.toString() });
            }
        }
    };
};



export const checkUserActive = async (req : any, res : any, next : any) => {
  try {
    const userId = await Global.getTokenValue(req, "id");

    if (!userId) {
      return res.status(200).send({ status: 0, message: "Unauthorized user" });
    }

    const user: any = await new UserModel().findById(userId);

    if (!user || user.status !== "ACTIVE") {
      return res.status(200).send({ status: 0, message: "Your account is inactive. Please contact admin." });
    }

    return next();

  } catch (error : any) {
    applicationLogger.error("checkUserActive middleware", {
      authorization: req.headers.authorization,
      error: error.toString()
    });

    return res.status(500).send({ status: 0, message: "Failed to verify user status" , error: error.toString() });
  }
};