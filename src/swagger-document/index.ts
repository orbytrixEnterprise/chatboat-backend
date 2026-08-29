import { basicInfo } from './basic-info';
import { servers } from './servers';
import { common } from './common';
import user from './user';

/****************************
  SWAGGER MODULES
 ****************************/

const modules = [
    user
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