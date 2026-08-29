import { Controller } from "./controller";
import response from '../../configs/response';
import { applicationLogger, Global } from "../../configs";
import { FieldHelperService, FilterService } from "../../services";
import { PurchasePaymentModel } from "../model";

export class PurchasePaymentController extends Controller {

    constructor() {
        super();
    }

    async add() {
        try {

            const body = this.req.body;

            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");
            body.action = "INSERT";

            const data: any = await new PurchasePaymentModel().purchasePayment(body);

            if (data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["104"] });
            }

            return this.res.status(200).send({ status: 1, message: response["601"], data: data[0] });

        } catch (err: any) {

            applicationLogger.error(`PurchasePaymentController add`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async update() {
        try {

            const body = this.req.body;

            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");
            body.action = "SELECTBYID";

            const data: any = await new PurchasePaymentModel().purchasePayment(body);

            if (data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["605"] });
            }

            body.action = "UPDATE";

            await new PurchasePaymentModel().purchasePayment(body);

            return this.res.status(200).send({ status: 1, message: response["602"] });

        } catch (err: any) {

            applicationLogger.error(`PurchasePaymentController update`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async delete() {
        try {

            const body: any = {
                purchasePaymentId: this.req.params.purchasePaymentId,
                createdUpdatedBy: await Global.getTokenValue(this.req, "id"),
                action: "SELECTBYID"
            };

            const data: any = await new PurchasePaymentModel().purchasePayment(body);

            if (data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["605"] });
            }

            body.action = "DELETE";

            await new PurchasePaymentModel().purchasePayment(body);

            return this.res.status(200).send({ status: 1, message: response["603"] });

        } catch (err: any) {

            applicationLogger.error(`PurchasePaymentController delete`, {
                params: this.req.params,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async selectById() {
        try {

            const body: any = {
                purchasePaymentId: this.req.params.purchasePaymentId,
                action: "SELECTBYID"
            };

            const data: any = await new PurchasePaymentModel().purchasePayment(body);

            if (data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["605"] });
            }

            return this.res.status(200).send({ status: 1, message: response["604"], data: data[0] });

        } catch (err: any) {

            applicationLogger.error(`PurchasePaymentController selectById`, {
                params: this.req.params,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async search() {
        try {

            const body = this.req.body;

            body.adminId = await Global.getTokenValue(this.req, "adminId");

            let fieldSearch = "";

            if (FieldHelperService.undefinedAndNullCheck(body.adminId) && body.adminId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`a`.`admin_id` = ' + body.adminId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.shopId) && body.shopId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`s`.`shop_id` = ' + body.shopId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.vendorId) && body.vendorId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pp`.`vendor_id` = ' + body.vendorId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.paymentModeId) && body.paymentModeId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pp`.`payment_mode_id` = ' + body.paymentModeId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.paymentDate) && body.paymentDate?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pp`.`payment_date` = "' + body.paymentDate.trim() + '")';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.fromDate) && body.fromDate?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(DATE(`pp`.`creating_date`) >= "' + body.fromDate.trim() + '")';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.toDate) && body.toDate?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(DATE(`pp`.`creating_date`) <= "' + body.toDate.trim() + '")';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.status) && body.status?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pp`.`status` = "' + body.status.trim() + '")';
            }

            let filter = "";

            for (const key in (body.filter || [])) {

                const element = body.filter[key];

                filter += (filter.length > 0 ? " AND " : "");

                switch (element.key) {

                    case "vendor_name":
                        filter = FilterService.addFilterValue(filter, "`v`.`vendor_name`", element);
                        break;

                    case "amount":
                        filter = FilterService.addFilterValue(filter, "`pp`.`amount`", element);
                        break;

                    case "payment_mode":
                        filter = FilterService.addFilterValue(filter, "`pp`.`payment_mode`", element);
                        break;

                    case "payment_date":
                        filter = FilterService.addFilterValue(filter, "`pp`.`payment_date`", element);
                        break;

                    case "remark":
                        filter = FilterService.addFilterValue(filter, "`pp`.`remark`", element);
                        break;

                    case "status":
                        filter = FilterService.addFilterValue(filter, "`pp`.`status`", element);
                        break;
                }
            }

            body.filter = filter;

            let orderBy = "";

            for (const key in (body.orderBy || [])) {

                const element = body.orderBy[key];

                orderBy += (orderBy.length > 0 ? ", " : "") + element.key + " " + (element.orderType === "asc" ? "ASC" : "DESC");
            }

            body.orderBy = orderBy;

            body.action = "COUNT";
            body.fieldSearch = fieldSearch;

            const countData: any = await new PurchasePaymentModel().purchasePaymentSearch(body);

            if (countData && countData.length > 0 && countData[0].count > 0) {

                const data: any = {
                    data: [],
                    page: body.page,
                    noOf: body.noOf,
                    total: countData[0].count
                };

                body.action = "SELECT";

                data.data = await new PurchasePaymentModel().purchasePaymentSearch(body);

                return this.res.status(200).send({ status: 1, message: response["607"], data });

            } else {
                return this.res.status(200).send({
                    status: 1,
                    message: response["102"],
                    data: {
                        data: [],
                        page: body.page,
                        noOf: body.noOf,
                        total: 0
                    }
                });
            }

        } catch (err: any) {

            applicationLogger.error(`PurchasePaymentController search`, {
                authorization: this.req.headers.authorization,
                body: this.req.body,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["101"], error: err.toString() });
        }
    }

}
