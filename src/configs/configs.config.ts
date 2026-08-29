/****************************
 Configuration
 ****************************/

import environmentVariable from './environment.config';
export const configuration: any = {
    mongodbUri: environmentVariable.mongodbUri,
    securityToken: process.env.SECURITY_TOKEN || 'skjfsoakgnasdlkgnsdalgnsdalda ',
    serverPort: environmentVariable.serverPort,
    forgotPasswordTokenExpiry: 600, // Note: in seconds! (10 minutes) ,
    tokenExpiry: 1800, // Note: in seconds! (30 minutes)    
    refreshTokenExpiry: 3600, // Note: in seconds! (30 minutes) 
    publicDirectory: environmentVariable.publicDirectory,
    frontendUrl: environmentVariable.frontendUrl,
    baseApiUrl: '/' + environmentVariable.baseUrl,
    rootUrl: environmentVariable.rootUrl + environmentVariable.serverPort + '/' + environmentVariable.baseUrl + '/',
    apiUrl: environmentVariable.rootUrl + environmentVariable.serverPort + '/',
    swaggerUrl: environmentVariable.swaggerUrl,
    eInvoice: environmentVariable.eInvoice,
    imageLogoPath: environmentVariable.imageLogoPath,
    smtp: environmentVariable.smtp,
    defaultEmailName: environmentVariable.smtp?.emailName  || '',
    defaultEmailId:   environmentVariable.smtp?.emailId    || '',
    password:         environmentVariable.smtp?.password   || '',
    emailAddressPattern: /^[A-Za-z0-9!'#$%&*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!'#$%&*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z]{2,64}$/,
    mobileNoPattern: /^[6-9]\d{9}$/,
    timePattern: /^[0-9]{2}[:]{1}[0-9]{2}$/,
    imageType: /\.(jpg|JPG|jpeg|JPEG|png|PNG)$/,
    yearPattern: /^[0-9]{4}$/,
    datePattern: /^[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/,
    timeLongPattern: /^[0-9]{2}[:]{1}[0-9]{2}[:]{1}[0-9]{2}$/,
    dateTimePattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/,
    bankIfscCodePattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    panCardPattern: /^[A-Z]{3}[ABCFGHLJPTK][A-Z]\d{4}[A-Z]$/,
    gstNoPattern: /^([0-2][0-9]|[3][0-7])[A-Z]{3}[ABCFGHLJPTK][A-Z]\d{4}[A-Z][A-Z0-9][Z][A-Z0-9]$/,
};