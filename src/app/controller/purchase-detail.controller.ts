import { Controller } from "./controller";
import response from '../../configs/response';
import { applicationLogger, Global } from "../../configs";
import { FieldHelperService, FilterService } from "../../services";
import { PurchaseDetailModel } from "../model";

export class PurchaseDetailController extends Controller {

    constructor() {
        super();
    }

    async add() {
        try {

            const body = this.req.body;

            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");
            body.action = "INSERT";

            const data: any = await new PurchaseDetailModel().purchaseDetail(body);

            if (!data || data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["104"] });
            }

            const purchaseDetailId = data[0].purchase_detail_id;

            body.purchaseDetailId = purchaseDetailId;
            body.action = "RECALCULATE_AMOUNT";
            await new PurchaseDetailModel().purchaseDetail(body);

            return this.res.status(200).send({ status: 1, message: response["501"], data: data[0] });

        } catch (err: any) {

            applicationLogger.error(`PurchaseDetailController add`, {
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

            const data: any = await new PurchaseDetailModel().purchaseDetail(body);

            if (!data || data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["505"] });
            }

            body.action = "UPDATE";
            const updateData: any = await new PurchaseDetailModel().purchaseDetail(body);

            if (updateData && updateData.length > 0 && updateData[0].status === 0) {
                return this.res.status(200).send({ status: 0, message: updateData[0].message });
            }

            body.action = "RECALCULATE_AMOUNT";
            await new PurchaseDetailModel().purchaseDetail(body);

            return this.res.status(200).send({ status: 1, message: response["502"] });

        } catch (err: any) {

            applicationLogger.error(`PurchaseDetailController update`, {
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

            const data: any = await new PurchaseDetailModel().purchaseDetail(body);

            if (data && data.length > 0) {

                body.action = "DELETE";
                const deleteData: any = await new PurchaseDetailModel().purchaseDetail(body);

                if (deleteData && deleteData.length > 0 && deleteData[0].status === 0) {
                    return this.res.status(200).send({ status: 0, message: deleteData[0].message });
                }

                body.action = "RECALCULATE_AMOUNT";
                await new PurchaseDetailModel().purchaseDetail(body);

                return this.res.status(200).send({ status: 1, message: response["503"] });

            } else {
                return this.res.status(200).send({ status: 0, message: response["505"] });
            }

        } catch (err: any) {

            applicationLogger.error(`PurchaseDetailController delete`, {
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

            const data: any = await new PurchaseDetailModel().purchaseDetail(body);

            if (data && data.length > 0) {
                return this.res.status(200).send({ status: 1, message: response["504"], data: data[0] });
            } else {
                return this.res.status(200).send({ status: 0, message: response["505"] });
            }

        } catch (err: any) {

            applicationLogger.error(`PurchaseDetailController selectById`, {
                body: this.req.params,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async getOldDetailValue() {
        try {

            const body = this.req.body;

            body.action = "GET_OLD_DETAIL_VALUE";

            const data: any = await new PurchaseDetailModel().purchaseDetail(body);

            if (data && data.length > 0) {
                return this.res.status(200).send({ status: 1, message: response["508"], data: data[0] });
            } else {
                return this.res.status(200).send({ status: 0, message: response["505"] });
            }

        } catch (err: any) {

            applicationLogger.error(`PurchaseDetailController getOldDetailValue`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    async addUpdateItemImage() {
        try {

            const body = this.req.body;

            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");
            body.action = "SELECTBYID";

            const data: any = await new PurchaseDetailModel().purchaseDetail(body);

            if (!data || data.length === 0) {
                return this.res.status(200).send({ status: 0, message: response["505"] });
            }

            body.action = "UPDATE_ITEM_IMAGE";
            await new PurchaseDetailModel().purchaseDetail(body);

            return this.res.status(200).send({ status: 1, message: response["509"] });

        } catch (err: any) {

            applicationLogger.error(`PurchaseDetailController addUpdateItemImage`, {
                body: this.req.body,
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
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`s`.`shop_id` = ' + body.shopId + ')';
                defaultFieldSearch += (defaultFieldSearch.length > 0 ? " AND " : "") + '(`s`.`shop_id` = ' + body.shopId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.purchaseId) && body.purchaseId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pd`.`purchase_id` = ' + body.purchaseId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.categoryId) && body.categoryId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pd`.`category_id` = ' + body.categoryId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.brandId) && body.brandId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pd`.`brand_id` = ' + body.brandId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.colorId) && body.colorId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pd`.`color_id` = ' + body.colorId + ')';
            }

            if (FieldHelperService.undefinedAndNullCheck(body.detailNo) && body.detailNo?.trim().length > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(`pd`.`purchase_detail_no` LIKE "%' + body.detailNo.trim() + '%")';
            }

            let filter = "";

            for (const key in (body.filter || [])) {

                const element = body.filter[key];

                filter += (filter.length > 0 ? " AND " : "");

                switch (element.key) {

                    case "purchase_no":
                        filter = FilterService.addFilterValue(filter, "`p`.`purchase_no`", element);
                        break;
                    case "purchase_detail_no":
                    case "detail_no":
                        filter = FilterService.addFilterValue(filter, "`pd`.`purchase_detail_no`", element);
                        break;
                    case "category_name":
                        filter = FilterService.addFilterValue(filter, "`c`.`category_name`", element);
                        break;
                    case "brand_name":
                        filter = FilterService.addFilterValue(filter, "`b`.`brand_name`", element);
                        break;
                    case "color_name":
                        filter = FilterService.addFilterValue(filter, "`cl`.`color_name`", element);
                        break;
                    case "rate":
                        filter = FilterService.addFilterValue(filter, "`pd`.`rate`", element);
                        break;
                    case "selling_price":
                        filter = FilterService.addFilterValue(filter, "`pd`.`selling_price`", element);
                        break;
                    case "minimum_stock_qty":
                        filter = FilterService.addFilterValue(filter, "`pd`.`minimum_stock_qty`", element);
                        break;
                    case "meter":
                        filter = FilterService.addFilterValue(filter, "`pd`.`meter`", element);
                        break;
                    case "total":
                        filter = FilterService.addFilterValue(filter, "`pd`.`total`", element);
                        break;
                    case "gst":
                        filter = FilterService.addFilterValue(filter, "`g`.`gst`", element);
                        break;
                    case "gst_amount":
                        filter = FilterService.addFilterValue(filter, "`pd`.`gst_amount`", element);
                        break;
                    case "total_amount":
                        filter = FilterService.addFilterValue(filter, "`pd`.`total_amount`", element);
                        break;
                    case "remark":
                        filter = FilterService.addFilterValue(filter, "`pd`.`remark`", element);
                        break;
                    case "status":
                        filter = FilterService.addFilterValue(filter, "`pd`.`status`", element);
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
            const defaultData: any = await new PurchaseDetailModel().purchaseDetailSearch(body);
            const defaultCountData = defaultData && defaultData.length > 0 ? defaultData[0] : {};

            body.action = "COUNT";
            body.fieldSearch = fieldSearch;

            const countData: any = await new PurchaseDetailModel().purchaseDetailSearch(body);

            if (countData && countData.length > 0 && countData[0].count > 0) {

                const data: any = {
                    data: [],
                    page: body.page,
                    noOf: body.noOf,
                    total: countData[0].count,
                    ...defaultCountData
                };

                body.action = "SELECT";

                data.data = await new PurchaseDetailModel().purchaseDetailSearch(body);

                return this.res.status(200).send({ status: 1, message: response["507"], data });

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

            applicationLogger.error(`PurchaseDetailController search`, {
                authorization: this.req.headers.authorization,
                body: this.req.body,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["101"], error: err.toString() });
        }
    }
}
