import tags from "../tag-constant";
import components from "./components";

import {
    uploadFile,
    removeFile
} from "./api";

const upload = {

    ...components,

    tags: [
        {
            name: tags.upload,
            description: "Asset & File Upload APIs"
        }
    ],

    paths: {
        "/Upload/AddFile": uploadFile,
        "/Upload/RemoveFile": removeFile
    }

};

export default upload;
