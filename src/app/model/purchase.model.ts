/* eslint-disable camelcase */
import { Purchase, PurchaseDetail } from "./mongodb/purchase.schema";
import { getNextSequenceValue } from "./mongodb/counter.schema";

function mapPurchaseToSql(p: any) {
    if (!p) {
        return null;
    }
    return {
        purchase_id: p.purchaseId,
        shop_id: p.shopId,
        vendor_id: p.vendorId,
        purchase_no: p.purchaseNo,
        purchase_date: p.purchaseDate,
        remark: p.remark,
        total: p.total,
        total_gst: p.totalGst,
        total_amount: p.totalAmount,
        round_off_amount: p.roundOffAmount,
        gtotal: p.gtotal,
        status: p.status,
        created_by: p.createdUpdatedBy,
        updated_by: p.createdUpdatedBy,
        creating_date: p.creatingDate,
        updating_date: p.updatingDate
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

export class PurchaseModel {

    async purchase(body: any) {
        switch (body.action) {
            case "CHECK": {
                const p = await Purchase.findOne({ purchaseId: body.purchaseId }).lean();
                return p ? [mapPurchaseToSql(p)] : [];
            }

            case "SELECTBYID": {
                const p = await Purchase.findOne({ purchaseId: body.purchaseId }).lean();
                return p ? [mapPurchaseToSql(p)] : [];
            }

            case "BULK_INSERT": {
                const purchaseId = await getNextSequenceValue("purchaseId");
                
                // Format SB/PUR/26-27/0001
                const yearText = `${new Date().getFullYear().toString().slice(-2)}-${(new Date().getFullYear() + 1).toString().slice(-2)}`;
                const purchaseNo = `SB/PUR/${yearText}/${String(purchaseId).padStart(4, '0')}`;

                let detailJson: any[] = [];
                if (typeof body.detailJson === 'string') {
                    try {
                        detailJson = JSON.parse(body.detailJson);
                    } catch {
                        detailJson = [];
                    }
                } else if (Array.isArray(body.detailJson)) {
                    detailJson = body.detailJson;
                }

                let total = 0;
                let totalGst = 0;
                let totalAmount = 0;

                for (const item of detailJson) {
                    const itemTotal = Number(item.rate || 0) * Number(item.meter || 0);
                    const cgst = (itemTotal * getCgstRate(Number(item.cgstId || 0))) / 100;
                    const sgst = (itemTotal * getSgstRate(Number(item.sgstId || 0))) / 100;
                    const igst = (itemTotal * getIgstRate(Number(item.igstId || 0))) / 100;
                    const itemGst = cgst + sgst + igst;
                    const itemTotalAmount = itemTotal + itemGst;

                    total += itemTotal;
                    totalGst += itemGst;
                    totalAmount += itemTotalAmount;

                    const purchaseDetailId = await getNextSequenceValue("purchaseDetailId");
                    await PurchaseDetail.create({
                        purchaseDetailId,
                        purchaseId,
                        categoryId: item.categoryId || 0,
                        brandId: item.brandId || 0,
                        colorId: item.colorId || 0,
                        rate: item.rate || 0,
                        sellingPrice: item.sellingPrice || 0,
                        minimumStockQty: item.minimumStockQty || 0,
                        meter: item.meter || 0,
                        cgstId: item.cgstId || 0,
                        sgstId: item.sgstId || 0,
                        igstId: item.igstId || 0,
                        remark: item.remark || "",
                        status: "ACTIVE",
                        createdUpdatedBy: body.createdUpdatedBy || 0
                    });
                }

                const roundOffAmount = Number(body.roundOffAmount || 0);
                const gtotal = totalAmount + roundOffAmount;

                await Purchase.create({
                    purchaseId,
                    shopId: body.shopId || 0,
                    vendorId: body.vendorId || 0,
                    purchaseNo,
                    purchaseDate: body.purchaseDate,
                    remark: body.remark || "",
                    total: Math.round(total * 100) / 100,
                    totalGst: Math.round(totalGst * 100) / 100,
                    totalAmount: Math.round(totalAmount * 100) / 100,
                    roundOffAmount,
                    gtotal: Math.round(gtotal * 100) / 100,
                    status: "ACTIVE",
                    createdUpdatedBy: body.createdUpdatedBy || 0
                });

                return [{ purchase_id: purchaseId, purchase_no: purchaseNo }];
            }

            case "UPDATE": {
                const roundOffAmount = Number(body.roundOffAmount || 0);
                
                // Fetch details to recalculate amounts
                const details = await PurchaseDetail.find({ purchaseId: body.purchaseId, status: "ACTIVE" }).lean();
                let total = 0;
                let totalGst = 0;
                let totalAmount = 0;

                for (const item of details) {
                    const itemTotal = Number(item.rate || 0) * Number(item.meter || 0);
                    const cgst = (itemTotal * getCgstRate(Number(item.cgstId || 0))) / 100;
                    const sgst = (itemTotal * getSgstRate(Number(item.sgstId || 0))) / 100;
                    const igst = (itemTotal * getIgstRate(Number(item.igstId || 0))) / 100;
                    const itemGst = cgst + sgst + igst;
                    const itemTotalAmount = itemTotal + itemGst;

                    total += itemTotal;
                    totalGst += itemGst;
                    totalAmount += itemTotalAmount;
                }

                await Purchase.updateOne(
                    { purchaseId: body.purchaseId },
                    {
                        vendorId: body.vendorId,
                        purchaseDate: body.purchaseDate,
                        remark: body.remark,
                        total: Math.round(total * 100) / 100,
                        totalGst: Math.round(totalGst * 100) / 100,
                        totalAmount: Math.round(totalAmount * 100) / 100,
                        roundOffAmount,
                        gtotal: Math.round((totalAmount + roundOffAmount) * 100) / 100,
                        createdUpdatedBy: body.createdUpdatedBy,
                        updatingDate: new Date()
                    }
                );
                return 1;
            }

            case "DELETE": {
                await Purchase.updateOne(
                    { purchaseId: body.purchaseId },
                    { status: "DEACTIVE", createdUpdatedBy: body.createdUpdatedBy, updatingDate: new Date() }
                );
                await PurchaseDetail.updateMany(
                    { purchaseId: body.purchaseId },
                    { status: "DEACTIVE", createdUpdatedBy: body.createdUpdatedBy, updatingDate: new Date() }
                );
                return 1;
            }

            default:
                return 0;
        }
    }

    async purchaseSearch(body: any) {
        const query: any = { status: "ACTIVE" };

        const purchaseNoFilter = extractRegexFromSql(body.fieldSearch, "p`.`purchase_no") || extractRegexFromSql(body.filter, "p`.`purchase_no");
        if (purchaseNoFilter) {
            query.purchaseNo = purchaseNoFilter;
        }

        const remarkFilter = extractRegexFromSql(body.fieldSearch, "p`.`remark") || extractRegexFromSql(body.filter, "p`.`remark");
        if (remarkFilter) {
            query.remark = remarkFilter;
        }

        const shopIdFilter = extractRegexFromSql(body.fieldSearch, "p`.`shop_id") || extractRegexFromSql(body.filter, "p`.`shop_id");
        if (shopIdFilter) {
            query.shopId = Number(body.shopId);
        }

        const vendorIdFilter = extractRegexFromSql(body.fieldSearch, "p`.`vendor_id") || extractRegexFromSql(body.filter, "p`.`vendor_id");
        if (vendorIdFilter) {
            query.vendorId = Number(body.vendorId);
        }

        if (body.action === "COUNT" || body.action === "DEFAULT_SEARCH_COUNT") {
            const count = await Purchase.countDocuments(query);
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
                            purchase_no: "purchaseNo",
                            purchase_date: "purchaseDate",
                            remark: "remark",
                            total: "total",
                            total_gst: "totalGst",
                            total_amount: "totalAmount",
                            round_off_amount: "roundOffAmount",
                            gtotal: "gtotal"
                        };
                        const mongoCol = colMap[col] || col;
                        sort[mongoCol] = dir?.toUpperCase() === "DESC" ? -1 : 1;
                    }
                }
            } else {
                sort.creatingDate = -1;
            }

            const purchases = await Purchase.find(query)
                .sort(sort)
                .skip((page - 1) * noOf)
                .limit(noOf)
                .lean();

            return purchases.map(mapPurchaseToSql);
        }
    }
}
