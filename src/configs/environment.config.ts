import path from "path";
import dotenv from "dotenv";

const serverType = (process.env.NODE_ENV || 'staging').trim();

// Load environment variables from the specific .env files
if (serverType === "production") {
    dotenv.config({ path: path.join(process.cwd(), '.env.production') });
} else if (serverType === "staging") {
    dotenv.config({ path: path.join(process.cwd(), '.env.staging') });
} else {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
}

let environment: any = {};

if (serverType === "production") {
    environment = {
        mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chatboat",
        serverPort: process.env.SERVER_PORT || "5022",
        baseUrl: process.env.BASE_URL || "api/v1",
        rootUrl: process.env.ROOT_URL || "http://localhost:",
        swaggerUrl: process.env.SWAGGER_URL || "https://chatboat.orbytrix.com/api/v1",
        imageLogoPath: process.env.IMAGE_LOGO_PATH || "https://chatboat.orbytrix.com/images/main-logo.png",
        frontendUrl: process.env.FRONTEND_URL || "https://chatboat.orbytrix.com",
        publicDirectory: path.join(__dirname, '..', '..'),
        eInvoice: process.env.E_INVOICE ? process.env.E_INVOICE === "true" : true,

        smtp: {
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
            secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true,
            emailName: process.env.SMTP_EMAIL_NAME || 'chatboat Connect',
            emailId: process.env.SMTP_EMAIL_ID || 'chatboat@orbytrix.com',
            password: process.env.SMTP_PASSWORD || ''
        }
    };
}
else if (serverType === "staging") {
    environment = {
        mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chatboat_staging",
        serverPort: process.env.SERVER_PORT || "6031",
        baseUrl: process.env.BASE_URL || "api/v1",
        rootUrl: process.env.ROOT_URL || "http://localhost:",
        swaggerUrl: process.env.SWAGGER_URL || "https://chatboatstagingapi.orbytrix.com/api/v1",
        imageLogoPath: process.env.IMAGE_LOGO_PATH || "https://chatboatstagingapi.orbytrix.com/images/main-logo.png",
        frontendUrl: process.env.FRONTEND_URL || "https://chatboatstaging.orbytrix.com",
        publicDirectory: path.join(__dirname, '..', '..'),
        eInvoice: process.env.E_INVOICE ? process.env.E_INVOICE === "true" : false,

        smtp: {
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
            secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true,
            emailName: process.env.SMTP_EMAIL_NAME || 'chatboat Connect',
            emailId: process.env.SMTP_EMAIL_ID || 'chatboat@orbytrix.com',
            password: process.env.SMTP_PASSWORD || ''
        }
    };
}
else if (serverType === "development") {
    environment = {
        mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chatboat_dev",
        serverPort: process.env.SERVER_PORT || "5025",
        baseUrl: process.env.BASE_URL || "api/v1",
        rootUrl: process.env.ROOT_URL || "http://localhost:",
        swaggerUrl: process.env.SWAGGER_URL || "http://localhost:5025/api/v1",
        imageLogoPath: process.env.IMAGE_LOGO_PATH || "https://chatboatstagingapi.orbytrix.com/images/main-logo.png",
        frontendUrl: process.env.FRONTEND_URL || "http://localhost:5179",
        publicDirectory: path.join(__dirname, '..', '..', '..'),
        eInvoice: process.env.E_INVOICE ? process.env.E_INVOICE === "true" : false,

        smtp: {
            host: process.env.SMTP_HOST || 'smtp.hostinger.com',
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
            secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : true,
            emailName: process.env.SMTP_EMAIL_NAME || 'chatboat Connect',
            emailId: process.env.SMTP_EMAIL_ID || 'chatboat@orbytrix.com',
            password: process.env.SMTP_PASSWORD || ''
        }
    };
}

export default { ...environment };