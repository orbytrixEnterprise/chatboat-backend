import tags from '../tag-constant';
import components from './components';

import addUpload from './add';
import removeUpload from './remove';

export default {

    ...components,

    tags: [
        {
            name: tags.upload,
            description: 'Upload Managing API'
        }
    ],

    paths: {

        '/Upload/AddFile': {
            ...addUpload
        },

        '/Upload/RemoveFile': {
            ...removeUpload
        }

    }

};