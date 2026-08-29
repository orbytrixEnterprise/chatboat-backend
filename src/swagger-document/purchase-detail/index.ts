import tags from "../tag-constant";
import components from "./components";

import {
    addPurchaseDetail,
    updatePurchaseDetail,
    deletePurchaseDetail,
    selectByIdPurchaseDetail,
    getOldDetailValuePurchaseDetail,
    addUpdateItemImagePurchaseDetail,
    searchPurchaseDetail
} from "./api";

const purchaseDetail = {

    ...components,

    tags: [{ name: tags.purchaseDetail, description: "Purchase Detail Management" }],

    paths: {
        "/PurchaseDetail/Add": addPurchaseDetail,
        "/PurchaseDetail/Update": updatePurchaseDetail,
        "/PurchaseDetail/Delete/{purchaseDetailId}": deletePurchaseDetail,
        "/PurchaseDetail/SelectById/{purchaseDetailId}": selectByIdPurchaseDetail,
        "/PurchaseDetail/getOlddetailValue": getOldDetailValuePurchaseDetail,
        "/PurchaseDetail/AddUpdateItemImage": addUpdateItemImagePurchaseDetail,
        "/PurchaseDetail/Search": searchPurchaseDetail
    }

};

export default purchaseDetail;
