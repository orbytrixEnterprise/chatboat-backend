import { basicInfo } from './basic-info';
import { servers } from './servers';
import { common } from './common';
import user from './user';
import aiKey from './ai-key';
import character from './character';
import upload from './upload';
import category from './category';

/****************************
  SWAGGER MODULES
 ****************************/

const modules = [
    upload,
    user,
    aiKey,
    category,
    character
];

/****************************
  SWAGGER DOCUMENT
 ****************************/

export const swaggerDocument = {

    ...basicInfo,

    servers,

    components: {

        securitySchemes: { ...common.securitySchemes },

        schemas: {

            ...common.schemas,

            ...modules.reduce((schemas, module) => ({ ...schemas, ...module.schemas }), {}),

        }

    },

    tags: modules.flatMap(module => module.tags),

    paths: modules.reduce(
        (paths, module) => ({ ...paths, ...module.paths }), {}
    )

};