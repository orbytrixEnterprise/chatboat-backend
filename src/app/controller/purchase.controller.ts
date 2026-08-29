import { Controller } from "./controller";
import response from '../../configs/response';
import { applicationLogger, Global } from "../../configs";
import { FieldHelperService, FilterService } from "../../services";
import { PurchaseModel } from "../model";

export class PurchaseController extends Controller {

    constructor() {
        super();
    }

    async add() {
        try {

            const body = this.req.body;

            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");
            body.action = "BULK_INSERT";

            const data: any = await new PurchaseModel().purchase(body);

            if (!data || data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["104"] });
            }

            return this.res.status(200).send({ status: 1, message: response["481"], data: data[0] });

        } catch (err: any) {

            applicationLogger.error(`PurchaseController add`, {
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

            const data: any = await new PurchaseModel().purchase(body);

            if (!data || data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["485"] });
            }

            body.action = "UPDATE";

            await new PurchaseModel().purchase(body);

            return this.res.status(200).send({ status: 1, message: response["482"] });

        } catch (err: any) {

            applicationLogger.error(`PurchaseController update`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async delete() {
        try {

            const body = this.req.params;

            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");
            body.action = "SELECTBYID";

            const data: any = await new PurchaseModel().purchase(body);

            if (data && data.length > 0) {

                body.action = "DELETE";

                const result: any = await new PurchaseModel().purchase(body);

                if (result && result.length > 0 && result[0].status === 0) {
                    return this.res.status(200).send({ status: 0, message: result[0].message });
                }

                return this.res.status(200).send({ status: 1, message: response["483"] });

            } else {
                return this.res.status(200).send({ status: 0, message: response["485"] });
            }

        } catch (err: any) {

            applicationLogger.error(`PurchaseController delete`, {
                body: this.req.params,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async selectById() {
        try {

            const body = this.req.params;

            body.action = "SELECTBYID";

            const data: any = await new PurchaseModel().purchase(body);

            if (data && data.length > 0) {
                return this.res.status(200).send({ status: 1, message: response["484"], data: data[0] });
            } else {
                return this.res.status(200).send({ status: 0, message: response["485"] });
            }

        } catch (err: any) {

            applicationLogger.error(`PurchaseController selectById`, {
                body: this.req.params,
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
            let defaultFieldSearch = "";

            if (FieldHelperService.undefinedAndNullCheck(body.adminId) && body.adminId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`a`.`admin_id` = ' + body.adminId + ')';
                defaultFieldSearch += (defaultFieldSearch.length > 0 ? " AND " : "") + '(`a`.`admin_id` = ' + body.adminId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.shopId) && body.shopId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`p`.`shop_id` = ' + body.shopId + ')';
                defaultFieldSearch += (defaultFieldSearch.length > 0 ? " AND " : "") + '(`p`.`shop_id` = ' + body.shopId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.vendorId) && body.vendorId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`p`.`vendor_id` = ' + body.vendorId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.purchaseNo) && body.purchaseNo?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`p`.`purchase_no` LIKE "%' + body.purchaseNo.trim() + '%")';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.purchaseDate) && body.purchaseDate?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`p`.`purchase_date` = "' + body.purchaseDate.trim() + '")';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.fromDate) && body.fromDate?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(DATE(`p`.`creating_date`) >= "' + body.fromDate.trim() + '")';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.toDate) && body.toDate?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(DATE(`p`.`creating_date`) <= "' + body.toDate.trim() + '")';
            }

            let filter = "";

            for (const key in (body.filter || [])) {

                const element = body.filter[key];

                filter += (filter.length > 0 ? " AND " : "");

                switch (element.key) {

                    case "purchase_no":
                        filter = FilterService.addFilterValue(filter, "`p`.`purchase_no`", element);
                        break;
                    case "shop_name":
                        filter = FilterService.addFilterValue(filter, "`su`.`name`", element);
                        break;
                    case "vendor_name":
                        filter = FilterService.addFilterValue(filter, "`v`.`vendor_name`", element);
                        break;
                    case "purchase_date":
                        filter = FilterService.addFilterValue(filter, "`p`.`purchase_date`", element);
                        break;
                    case "remark":
                        filter = FilterService.addFilterValue(filter, "`p`.`remark`", element);
                        break;
                    case "total":
                        filter = FilterService.addFilterValue(filter, "`p`.`total`", element);
                        break;
                    case "total_gst":
                        filter = FilterService.addFilterValue(filter, "`p`.`total_gst`", element);
                        break;
                    case "total_amount":
                        filter = FilterService.addFilterValue(filter, "`p`.`total_amount`", element);
                        break;
                    case "round_off_amount":
                        filter = FilterService.addFilterValue(filter, "`p`.`round_off_amount`", element);
                        break;
                    case "gtotal":
                        filter = FilterService.addFilterValue(filter, "`p`.`gtotal`", element);
                        break;
                    case "status":
                        filter = FilterService.addFilterValue(filter, "`p`.`status`", element);
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

            body.fieldSearch = defaultFieldSearch;
            body.action = "DEFAULT_SEARCH_COUNT";
            const defaultData: any = await new PurchaseModel().purchaseSearch(body);
            const defaultCountData = defaultData && defaultData.length > 0 ? defaultData[0] : {};

            body.action = "COUNT";
            body.fieldSearch = fieldSearch;

            const countData: any = await new PurchaseModel().purchaseSearch(body);

            if (countData && countData.length > 0 && countData[0].count > 0) {

                const data: any = {
                    data: [],
                    page: body.page,
                    noOf: body.noOf,
                    total: countData[0].count,
                    ...defaultCountData
                };

                body.action = "SELECT";

                data.data = await new PurchaseModel().purchaseSearch(body);

                return this.res.status(200).send({ status: 1, message: response["487"], data });

            } else {
                return this.res.status(200).send({
                    status: 1,
                    message: response["102"],
                    data: {
                        data: [],
                        page: body.page,
                        noOf: body.noOf,
                        total: 0,
                        ...defaultCountData
                    }
                });
            }

        } catch (err: any) {

            applicationLogger.error(`PurchaseController search`, {
                authorization: this.req.headers.authorization,
                body: this.req.body,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["101"], error: err.toString() });
        }
    }
}
