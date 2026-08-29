import tags from "../tag-constant";
import components from "./components";

import {
    addPurchasePayment,
    updatePurchasePayment,
    deletePurchasePayment,
    selectByIdPurchasePayment,
    searchPurchasePayment
} from "./api";

const purchasePayment = {

    ...components,

    tags: [{ name: tags.purchasePayment, description: "Purchase Payment Management" }],

    paths: {
        "/PurchasePayment/Add": addPurchasePayment,
        "/PurchasePayment/Update": updatePurchasePayment,
        "/PurchasePayment/Delete/{purchasePaymentId}": deletePurchasePayment,
        "/PurchasePayment/SelectById/{purchasePaymentId}": selectByIdPurchasePayment,
        "/PurchasePayment/Search": searchPurchasePayment
    }

};

export default purchasePayment;
