import tags from "../tag-constant";
import components from "./components";

import {
    addPurchase,
    updatePurchase,
    deletePurchase,
    selectByIdPurchase,
    searchPurchase
} from "./api";

const purchase = {

    ...components,

    tags: [{ name: tags.purchase, description: "Purchase Management" }],

    paths: {
        "/Purchase/Add": addPurchase,
        "/Purchase/Update": updatePurchase,
        "/Purchase/Delete/{purchaseId}": deletePurchase,
        "/Purchase/SelectById/{purchaseId}": selectByIdPurchase,
        "/Purchase/Search": searchPurchase
    }

};

export default purchase;
