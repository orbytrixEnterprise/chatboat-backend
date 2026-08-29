/* eslint-disable camelcase */
import { PurchasePayment } from "./mongodb/purchase.schema";
import { getNextSequenceValue } from "./mongodb/counter.schema";

function mapPurchasePaymentToSql(pp: any) {
    if (!pp) {
        return null;
    }
    return {
        purchase_payment_id: pp.purchasePaymentId,
        purchase_id: pp.purchaseId,
        payment_mode_id: pp.paymentModeId,
        amount: pp.amount,
        remark: pp.remark,
        payment_date: pp.paymentDate,
        status: pp.status,
        created_by: pp.createdUpdatedBy,
        updated_by: pp.createdUpdatedBy,
        creating_date: pp.creatingDate,
        updating_date: pp.updatingDate
    };
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

export class PurchasePaymentModel {

    async purchasePayment(body: any) {
        switch (body.action) {
            case "SELECTBYID": {
                const pp = await PurchasePayment.findOne({ purchasePaymentId: body.purchasePaymentId }).lean();
                return pp ? [mapPurchasePaymentToSql(pp)] : [];
            }

            case "INSERT": {
                const purchasePaymentId = await getNextSequenceValue("purchasePaymentId");
                await PurchasePayment.create({
                    purchasePaymentId,
                    purchaseId: body.purchaseId,
                    paymentModeId: body.paymentModeId,
                    amount: body.amount || 0.00,
                    remark: body.remark || "",
                    paymentDate: body.paymentDate,
                    status: "ACTIVE",
                    createdUpdatedBy: body.createdUpdatedBy || 0
                });
                return [{ purchase_payment_id: purchasePaymentId }];
            }

            case "DELETE": {
                await PurchasePayment.updateOne(
                    { purchasePaymentId: body.purchasePaymentId },
                    { status: "DEACTIVE", createdUpdatedBy: body.createdUpdatedBy, updatingDate: new Date() }
                );
                return 1;
            }

            default:
                return 0;
        }
    }

    async purchasePaymentSearch(body: any) {
        const query: any = { status: "ACTIVE" };

        if (body.purchaseId) {
            query.purchaseId = Number(body.purchaseId);
        }

        const remarkFilter = extractRegexFromSql(body.fieldSearch, "pp`.`remark") || extractRegexFromSql(body.filter, "pp`.`remark");
        if (remarkFilter) {
            query.remark = remarkFilter;
        }

        if (body.action === "COUNT") {
            const count = await PurchasePayment.countDocuments(query);
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
                            amount: "amount",
                            remark: "remark",
                            payment_date: "paymentDate"
                        };
                        const mongoCol = colMap[col] || col;
                        sort[mongoCol] = dir?.toUpperCase() === "DESC" ? -1 : 1;
                    }
                }
            } else {
                sort.creatingDate = -1;
            }

            const payments = await PurchasePayment.find(query)
                .sort(sort)
                .skip((page - 1) * noOf)
                .limit(noOf)
                .lean();

            return payments.map(mapPurchasePaymentToSql);
        }
    }

}
