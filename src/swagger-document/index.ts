import { basicInfo } from './basic-info';
import { servers } from './servers';
import { common } from './common';
import upload from './upload';
import user from './user';
import purchase from './purchase';
import purchaseDetail from './purchase-detail';
import purchasePayment from './purchase-payment';

/****************************
 SWAGGER MODULES
 ****************************/

const modules = [
    upload,
    user,
    purchase,
    purchaseDetail,
    purchasePayment
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