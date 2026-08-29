import { Controller } from './controller';
import { UserModel } from '../model';
import response from '../../configs/response';
import { applicationLogger, configuration, Global } from '../../configs';
import { EmailService, FieldHelperService, FilterService } from '../../services';

export class UserController extends Controller {


    constructor() {
        super();
    }

    async login() {
        try {
            const body = this.req.body;
            body.password = await Global.encrypt(body.password);

            const loginData: any = await new UserModel().login(body);
            const result = loginData[0];

            if (result.status === 1) {

                const userType = result.user_type;

                const tokenArray = {
                    id: result.user_id,
                    adminId: result.admin_id,
                    role: userType,
                    tokenType: "Access",
                    ipAddress: this.req.ip
                };

                result['access_token'] = await Global.token( tokenArray, configuration.tokenExpiry );

                result['refresh_token'] = await Global.token( tokenArray, configuration.refreshTokenExpiry );

                delete result.status;
                delete result.message;

                return this.res.status(200).send({ status: 1, message: response["202"], data: result });

            } else {
                return this.res.status(200).send({ status: 0, message: result.message });
            }

        } catch (err: any) {
            applicationLogger.error(`UserController login`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({
                status: 0, message: response["100"], error: err.toString()
            });
        }
    }

    /**
     * Select user by ID
     */
    async selectById() {
        try {
            const body = {
                userId: this.req.params.userId,
                action: "SELECTBYID"
            };

            const data: any = await new UserModel().user(body);

            if (data.length > 0) {
                return this.res.status(200).send({ status: 1, message: response["225"], data: data[0] });
            } else {
                return this.res.status(200).send({ status: 0, message: response["224"] });
            }

        } catch (err: any) {
            applicationLogger.error(`UserController selectById`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async searchUser() {
        try {
            const body = this.req.body;

            let fieldSearch = "";

            if (FieldHelperService.undefinedAndNullCheck(body.name) && body.name?.trim().length > 0) {
                fieldSearch += '(`u`.`name` LIKE "%' + body.name.trim() + '%")';
            }
            if (FieldHelperService.undefinedAndNullCheck(body.emailId) && body.emailId?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") +
                    '(`u`.`email_id` LIKE "%' + body.emailId.trim() + '%")';
            }
            if (FieldHelperService.undefinedAndNullCheck(body.mobileNo) && body.mobileNo?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") +
                    '(`u`.`mobile_no` LIKE "%' + body.mobileNo.trim() + '%")';
            }
            if (FieldHelperService.undefinedAndNullCheck(body.userType) && body.userType?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") +
                    '(`u`.`user_type` LIKE "' + body.userType.trim() + '%")';
            }
            if (FieldHelperService.undefinedAndNullCheck(body.status) && body.status?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") +
                    '(`u`.`status` LIKE "%' + body.status.trim() + '%")';
            }
            if (FieldHelperService.undefinedAndNullCheck(body.companyName) && body.companyName?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") +
                    '(`c`.`company_name` LIKE "%' + body.companyName.trim() + '%")';
            }
            body.fieldSearch = fieldSearch;

            let filter = "";

            for (const key in body.filter) {
                const element = body.filter[key];
                filter += (filter.length > 0 ? " AND " : "");

                switch (element.key) {
                    case "name":
                        filter = FilterService.addFilterValue(filter, "`u`.`name`", element);
                        break;
                    case "email_id":
                        filter = FilterService.addFilterValue(filter, "`u`.`email_id`", element);
                        break;
                    case "mobile_no":
                        filter = FilterService.addFilterValue(filter, "`u`.`mobile_no`", element);
                        break;
                    case "user_type":
                        filter = FilterService.addFilterValue(filter, "`u`.`user_type`", element);
                        break;
                    case "status":
                        filter = FilterService.addFilterValue(filter, "`u`.`status`", element);
                        break;
                    case "company_name":
                        filter = FilterService.addFilterValue(filter, "`c`.`company_name`", element);
                        break;
                    case "employee_count": filter = FilterService.addFilterValue(filter, "COUNT(`e`.`employee_id`)", element);
                        break;
                }
            }

            body.filter = filter;

            let orderBy = "";

            for (const key in body.orderBy) {
                const element = body.orderBy[key];
                orderBy += (orderBy.length > 0 ? ", " : "") + element.key + ' ' + (element.orderType === "asc" ? "ASC" : "DESC");
            }

            body.orderBy = orderBy;
            body.action = "COUNT";
            const countData: any = await new UserModel().userSearch(body);
            if (countData && countData.length > 0 && countData[0].count > 0) {

                const data: any = {
                    data: [],
                    page: body.page,
                    noOf: body.noOf,
                    total: countData[0].count
                };

                body.action = "SELECT";
                data.data = await new UserModel().userSearch(body);

                return this.res.status(200).send({ status: 1, message: response["225"], data });

            } else {
                return this.res.status(200).send({ status: 0, message: response["224"] });
            }

        } catch (err: any) {

            applicationLogger.error(`UserController searchUser`, {
                authorization: this.req.headers.authorization,
                body: this.req.body,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["101"], error: err.toString() });
        }
    }
    /**
     * Password update of user
     */
    async passwordUpdate() {
        try {
            const body = this.req.body;
            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");
            body.password = await Global.encrypt(body.oldPassword);

            body.action = "CHECK_PASSWORD";
            const checkPassword: any = await new UserModel().user(body);

            if (checkPassword.length > 0) {
                body.action = "PASSWORD_UPDATE";
                body.password = await Global.encrypt(body.newPassword);

                await new UserModel().user(body);
                return this.res.status(200).send({ status: 1, message: response["203"] });
            } else {
                return this.res.status(200).send({ status: 0, message: response["204"] });
            }

        } catch (err: any) {
            applicationLogger.error(`UserController passwordUpdate`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async adminPasswordUpdate() {
        try {
            const body = this.req.body;

            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");
            body.password = await Global.encrypt(body.password);
            body.action = "ADMIN_PASSWORD_UPDATE";

            await new UserModel().user(body);

            return this.res.status(200).send({ status: 1, message: response["203"] });

        } catch (err: any) {
            applicationLogger.error(`UserController adminPasswordUpdate`, { body: this.req.body, authorization: this.req.headers.authorization, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Forgot Password — send reset link to email
     */
    async forgotPassword() {
        try {

            const body = this.req.body;
            body.action = "FORGOT_PASSWORD";

            const userData: any = await new UserModel().user(body);

            if (!userData || userData.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["225"] });
            }

            const user = userData[0];

            const token = Global.forgotPasswordToken(user.user_id);
            const resetLink = `${configuration.frontendUrl}/reset-password?token=${token}`;

            await EmailService.forgotPassword(user.email_id, resetLink, user.name);

            return this.res.status(200).send({ status: 1, message: response["236"] });

        } catch (err: any) {
            applicationLogger.error(`UserController forgotPassword`, {
                body: this.req.body,
                error: err.toString()
            });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Reset Password — validate token and update password
     */
    async resetPassword() {
        try {

            const body = this.req.body;

            const decoded = Global.verifyForgotPasswordToken(body.token);

            if (!decoded) {
                return this.res.status(200).send({ status: 0, message: response["237"] });
            }

            body.userId = decoded.userId;
            body.password = await Global.encrypt(body.newPassword);
            body.createdUpdatedBy = decoded.userId;
            body.action = "PASSWORD_UPDATE";

            await new UserModel().user(body);

            return this.res.status(200).send({ status: 1, message: response["203"] });

        } catch (err: any) {
            applicationLogger.error(`UserController resetPassword`, {
                body: this.req.body,
                error: err.toString()
            });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

}
