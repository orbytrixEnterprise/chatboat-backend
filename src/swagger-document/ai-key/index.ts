import tags from "../tag-constant";
import components from "./components";

import {
    addAiKey,
    updateAiKey,
    changeStatusAiKey,
    selectByIdAiKey,
    searchAiKey,
    deleteAiKey
} from "./api";

const aiKey = {

    ...components,

    tags: [
        {
            name: tags.aikey,
            description: "User, Role & AI API Key Management APIs"
        }
    ],

    paths: {
        "/AiKey/Add": addAiKey,
        "/AiKey/Update": updateAiKey,
        "/AiKey/Status": changeStatusAiKey,
        "/AiKey/SelectById/{keyId}": selectByIdAiKey,
        "/AiKey/Search": searchAiKey,
        "/AiKey/Delete/{keyId}": deleteAiKey
    }

};

export default aiKey;
