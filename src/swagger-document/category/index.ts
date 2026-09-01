import tags from "../tag-constant";
import components from "./components";

import {
    addCategory,
    updateCategory,
    selectByIdCategory,
    searchCategory,
    deleteCategory
} from "./api";

const category = {

    ...components,

    tags: [
        {
            name: tags.category,
            description: "AI Character Category Master Management APIs"
        }
    ],

    paths: {
        "/Category/Add": addCategory,
        "/Category/Update": updateCategory,
        "/Category/SelectById/{categoryId}": selectByIdCategory,
        "/Category/Search": searchCategory,
        "/Category/Delete/{categoryId}": deleteCategory
    }

};

export default category;
