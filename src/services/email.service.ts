/****************************
 EMAIL HANDLING OPERATIONS
 ****************************/
import nodemailer from "nodemailer";
import { configuration, applicationLogger } from '../configs';
import { forgotPasswordTemplate } from '../templates';
import { TemplateService } from './template.service';

/**
 * Transporter is built from configuration.smtp which is set
 * per environment in environment.config.ts.
 *
 * To switch provider for any environment, update the smtp block there:
 *
 *   smtp: {
 *     host: 'smtp.hostinger.com',  // or 'smtp.gmail.com' etc.
 *     port: 465,
 *     secure: true,                // true = SSL (465), false = TLS (587)
 *     emailName: 'Your App Name',
 *     emailId: 'you@yourdomain.com',
 *     password: 'your_smtp_password'
 *   }
 */
const smtpTransport = nodemailer.createTransport({
    host:   configuration.smtp.host,
    port:   configuration.smtp.port,
    secure: configuration.smtp.secure,
    auth: {
        user: configuration.smtp.emailId,
        pass: configuration.smtp.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

export class EmailService {

    static send(mailOption: any) {
        return new Promise((resolve, reject) => {
            smtpTransport.sendMail(mailOption, (error: any, result: any) => {
                if (error) {
                    reject({ status: 0, message: error });
                }
                resolve(result);
            });
        });
    }

    static async verifyEmail(email: string, token: string) {
        try {
            const mailOptions = {
                from: `${configuration.smtp.emailName} <${configuration.smtp.emailId}>`,
                to: email,
                subject: "Verify Your Email Address",
                html: ""
            };
            // TODO: import verifyEmailTemplate from '../templates' when that template is added
            mailOptions.html = token;
            const result = await EmailService.send(mailOptions);
            return result;
        } catch (error) {
            applicationLogger.error(`EmailService verify email`, { error: error });
            return error;
        }
    }

    static async forgotPassword(email: string, resetUrl: string, userName: string) {
        try {
            const mailOptions = {
                from: `${configuration.smtp.emailName} <${configuration.smtp.emailId}>`,
                to: email,
                subject: "Reset Your Password —  tailor-management",
                html: TemplateService.compile(forgotPasswordTemplate, {
                    'user-name':           userName,
                    'reset-password-link': resetUrl,
                    'logo-path':           configuration.imageLogoPath
                })
            };
            const result = await EmailService.send(mailOptions);
            return result;
        } catch (error) {
            applicationLogger.error(`EmailService forgotPassword`, { error: error });
            return error;
        }
    }
}