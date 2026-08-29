import path from "path";

/****************************
 Configuration
 ****************************/
const serverType = (process.env.NODE_ENV || 'staging').trim();
let environment: any = {};

if (serverType === "production") {
    environment = {
        mongodbUri: "mongodb://127.0.0.1:27017/chatboat",
        serverPort: "5022",
        baseUrl: "api/v1",
        rootUrl: "http://localhost:",
        swaggerUrl: "https://tailorManagement.solvifytech.in/api/v1",
        imageLogoPath: "https://tailorManagementstaging.solvifytech.in/images/main-logo.png",
        frontendUrl: "https://tailorManagement.solvifytech.in",
        publicDirectory: path.join(__dirname, '..', '..'),
        eInvoice: true,

        smtp: {
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            emailName: 'tailor-management Connect',
            emailId: 'tailorManagement@solvifytech.in',
            password: 's3m&|1fCmY0>~#O9;+^|B/2meh5zXf9G>'
        }
    };
}
else if (serverType === "staging") {
    environment = {
        mongodbUri: "mongodb://127.0.0.1:27017/chatboat_staging",
        serverPort: "6031",
        baseUrl: "api/v1",
        rootUrl: "http://localhost:",
        swaggerUrl: "https://tailorstagingapi.solvifytech.in/api/v1",
        imageLogoPath: "https://tailorstagingapi.solvifytech.in/images/main-logo.png",
        frontendUrl: "https://tailorstaging.solvifytech.in",
        publicDirectory: path.join(__dirname, '..', '..'),
        eInvoice: false,

        smtp: {
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            emailName: 'tailor-management Connect',
            emailId: 'tailorManagement@solvifytech.in',
            password: 's3m&|1fCmY0>~#O9;+^|B/2meh5zXf9G>'
        }
    };
}
else if (serverType === "development") {
    environment = {
        mongodbUri: "mongodb://127.0.0.1:27017/chatboat_dev",
        serverPort: "5025",
        baseUrl: "api/v1",
        rootUrl: "http://localhost:",
        swaggerUrl: "http://localhost:5025/api/v1",
        imageLogoPath: "https://tailorstagingapi.solvifytech.in/images/main-logo.png",
        frontendUrl: "http://localhost:5179",
        publicDirectory: path.join(__dirname, '..', '..', '..'),
        eInvoice: false,

        smtp: {
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true,
            emailName: 'tailor-management Connect',
            emailId: 'tailorManagement@solvifytech.in',
            password: 's3m&|1fCmY0>~#O9;+^|B/2meh5zXf9G>'
        }
    };
}

export default { ...environment };