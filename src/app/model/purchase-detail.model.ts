/* eslint-disable camelcase */
import { PurchaseDetail, Purchase } from "./mongodb/purchase.schema";
import { getNextSequenceValue } from "./mongodb/counter.schema";

function mapPurchaseDetailToSql(pd: any) {
    if (!pd) {
        return null;
    }
    return {
        purchase_detail_id: pd.purchaseDetailId,
        purchase_id: pd.purchaseId,
        category_id: pd.categoryId,
        brand_id: pd.brandId,
        color_id: pd.colorId,
        rate: pd.rate,
        selling_price: pd.sellingPrice,
        minimum_stock_qty: pd.minimumStockQty,
        meter: pd.meter,
        cgst_id: pd.cgstId,
        sgst_id: pd.sgstId,
        igst_id: pd.igstId,
        remark: pd.remark,
        item_image: pd.itemImage,
        status: pd.status,
        created_by: pd.createdUpdatedBy,
        updated_by: pd.createdUpdatedBy,
        creating_date: pd.creatingDate,
        updating_date: pd.updatingDate
    };
}

function getCgstRate(cgstId: number): number {
    return cgstId === 2 ? 2.5 : 0.0;
}
function getSgstRate(sgstId: number): number {
    return sgstId === 2 ? 2.5 : 0.0;
}
function getIgstRate(igstId: number): number {
    return igstId === 2 ? 5.0 : 0.0;
}

function extractRegexFromSql(sql: string, field: string): RegExp | null {
    if (!sql) {
        return null;
    }
    const likeRegex = new RegExp(`\`${field}\`\\s+LIKE\\s+["']%([^%']+)%["']`, 'i');
    let match = sql.match(likeRegex);
    if (match) {
        return new RegExp(match[1].trim(), 'i');
    }
    const eqRegex = new RegExp(`\`${field}\`\\s*=\\s*["']([^'"]+)["']`, 'i');
    match = sql.match(eqRegex);
    if (match) {
        return new RegExp('^' + match[1].trim() + '$', 'i');
    }
    return null;
}

export class PurchaseDetailModel {

    async purchaseDetail(body: any) {
        switch (body.action) {
            case "SELECTBYID":
            case "GET_OLD_DETAIL_VALUE": {
                const pd = await PurchaseDetail.findOne({ purchaseDetailId: body.purchaseDetailId }).lean();
                return pd ? [mapPurchaseDetailToSql(pd)] : [];
            }

            case "INSERT": {
                const purchaseDetailId = await getNextSequenceValue("purchaseDetailId");
                await PurchaseDetail.create({
                    purchaseDetailId,
                    purchaseId: body.purchaseId,
                    categoryId: body.categoryId,
                    brandId: body.brandId || 0,
                    colorId: body.colorId || 0,
                    rate: body.rate || 0,
                    sellingPrice: body.sellingPrice || 0,
                    minimumStockQty: body.minimumStockQty || 0,
                    meter: body.meter || 0,
                    cgstId: body.cgstId || 0,
                    sgstId: body.sgstId || 0,
                    igstId: body.igstId || 0,
                    remark: body.remark || "",
                    itemImage: body.itemImage || "",
                    status: "ACTIVE",
                    createdUpdatedBy: body.createdUpdatedBy || 0
                });
                return [{ purchase_detail_id: purchaseDetailId }];
            }

            case "UPDATE": {
                await PurchaseDetail.updateOne(
                    { purchaseDetailId: body.purchaseDetailId },
                    {
                        categoryId: body.categoryId,
                        brandId: body.brandId,
                        colorId: body.colorId,
                        rate: body.rate,
                        sellingPrice: body.sellingPrice,
                        minimumStockQty: body.minimumStockQty,
                        meter: body.meter,
                        cgstId: body.cgstId,
                        sgstId: body.sgstId,
                        igstId: body.igstId,
                        remark: body.remark,
                        itemImage: body.itemImage,
                        createdUpdatedBy: body.createdUpdatedBy,
                        updatingDate: new Date()
                    }
                );
                return 1;
            }

            case "DELETE": {
                await PurchaseDetail.updateOne(
                    { purchaseDetailId: body.purchaseDetailId },
                    { status: "DEACTIVE", createdUpdatedBy: body.createdUpdatedBy, updatingDate: new Date() }
                );
                return 1;
            }

            case "RECALCULATE_AMOUNT": {
                const details = await PurchaseDetail.find({ purchaseId: body.purchaseId, status: "ACTIVE" }).lean();
                let total = 0;
                let totalGst = 0;
                let totalAmount = 0;

                for (const d of details) {
                    const itemTotal = Number(d.rate || 0) * Number(d.meter || 0);
                    const cgst = (itemTotal * getCgstRate(Number(d.cgstId || 0))) / 100;
                    const sgst = (itemTotal * getSgstRate(Number(d.sgstId || 0))) / 100;
                    const igst = (itemTotal * getIgstRate(Number(d.igstId || 0))) / 100;
                    const itemGst = cgst + sgst + igst;
                    const itemTotalAmount = itemTotal + itemGst;

                    total += itemTotal;
                    totalGst += itemGst;
                    totalAmount += itemTotalAmount;
                }

                const purchase = await Purchase.findOne({ purchaseId: body.purchaseId });
                if (purchase) {
                    purchase.total = Math.round(total * 100) / 100;
                    purchase.totalGst = Math.round(totalGst * 100) / 100;
                    purchase.totalAmount = Math.round(totalAmount * 100) / 100;
                    purchase.gtotal = Math.round((totalAmount + purchase.roundOffAmount) * 100) / 100;
                    await purchase.save();
                }
                return 1;
            }

            default:
                return 0;
        }
    }

    async purchaseDetailSearch(body: any) {
        const query: any = { status: "ACTIVE" };

        if (body.purchaseId) {
            query.purchaseId = Number(body.purchaseId);
        }

        const remarkFilter = extractRegexFromSql(body.fieldSearch, "pd`.`remark") || extractRegexFromSql(body.filter, "pd`.`remark");
        if (remarkFilter) {
            query.remark = remarkFilter;
        }

        if (body.action === "COUNT") {
            const count = await PurchaseDetail.countDocuments(query);
            return [{ count }];
        } else {
            const page = Number(body.page) || 1;
            const noOf = Number(body.noOf) || 10;

            const sort: any = {};
            if (body.orderBy && body.orderBy.trim().length > 0) {
                const parts = body.orderBy.split(",");
                for (const part of parts) {
                    const [col, dir] = part.trim().split(/\s+/);
                    if (col) {
                        const colMap: Record<string, string> = {
                            rate: "rate",
                            selling_price: "sellingPrice",
                            minimum_stock_qty: "minimumStockQty",
                            meter: "meter",
                            remark: "remark"
                        };
                        const mongoCol = colMap[col] || col;
                        sort[mongoCol] = dir?.toUpperCase() === "DESC" ? -1 : 1;
                    }
                }
            } else {
                sort.creatingDate = -1;
            }

            const details = await PurchaseDetail.find(query)
                .sort(sort)
                .skip((page - 1) * noOf)
                .limit(noOf)
                .lean();

            return details.map(mapPurchaseDetailToSql);
        }
    }
}
