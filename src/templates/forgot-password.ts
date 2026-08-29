export const forgotPasswordTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Reset Your Password — tailor-management </title>
</head>
<body style="margin:0; padding:0; background-color:#f5f0eb;
             font-family:'Segoe UI',Arial,sans-serif;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background-color:#f5f0eb; padding:40px 16px;">
        <tr>
            <td align="center" valign="top">

                <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                       style="width:100%; max-width:560px; background-color:#ffffff;
                              border-radius:14px; overflow:hidden;
                              box-shadow:0 6px 32px rgba(139,26,26,0.12);">

                    <!-- Top accent bar -->
                    <tr>
                        <td style="height:5px;
                                   background:linear-gradient(90deg,#8b1a1a,#c0392b,#8b1a1a);">
                        </td>
                    </tr>

                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding:36px 40px 20px 40px;">
                            <img src="logo-path"
                                 alt="tailor-management "
                                 width="220"
                                 style="display:block; max-width:220px; width:100%;
                                        height:auto; border:0; outline:none;
                                        text-decoration:none;" />
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td align="center" style="padding:0 40px 32px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0"
                                   border="0" width="100%">
                                <tr>
                                    <td style="height:1px; background-color:#f0e8e8;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding:0 40px 10px 40px;">
                            <p style="margin:0; font-size:21px; font-weight:600;
                                      color:#1a1a1a; line-height:1.3;">
                                Hello, user-name
                            </p>
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td style="padding:10px 40px 28px 40px;">
                            <p style="margin:0 0 14px 0; font-size:14px; color:#555555;
                                      line-height:1.75;">
                                We received a request to reset the password for your
                                <strong style="color:#8b1a1a;">tailor-management </strong> account.
                                Click the button below to set a new password.
                            </p>
                            <p style="margin:0; font-size:14px; color:#555555; line-height:1.75;">
                                This link is valid for
                                <strong style="color:#8b1a1a;">10 minutes</strong>.
                                After that you will need to make a new request.
                            </p>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td align="center" style="padding:0 40px 32px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center"
                                        style="background:linear-gradient(135deg,#8b1a1a,#6b1414);
                                               border-radius:8px;
                                               box-shadow:0 4px 16px rgba(139,26,26,0.30);">
                                        <a href="reset-password-link"
                                           target="_blank"
                                           style="display:inline-block; padding:13px 44px;
                                                  color:#ffffff; font-size:15px; font-weight:600;
                                                  text-decoration:none; letter-spacing:0.4px;
                                                  border-radius:8px;
                                                  font-family:'Segoe UI',Arial,sans-serif;">
                                            Reset My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Fallback link -->
                    <tr>
                        <td align="center" style="padding:0 40px 28px 40px;">
                            <p style="margin:0 0 6px 0; font-size:12px; color:#999999;">
                                If the button does not work, copy and paste this link:
                            </p>
                            <p style="margin:0; font-size:11px; word-break:break-all;">
                                <a href="reset-password-link"
                                   style="color:#8b1a1a; text-decoration:underline;">
                                    reset-password-link
                                </a>
                            </p>
                        </td>
                    </tr>

                    <!-- Security note -->
                    <tr>
                        <td style="padding:0 40px 36px 40px;">
                            <table role="presentation" cellpadding="0" cellspacing="0"
                                   border="0" width="100%"
                                   style="background-color:#fdf5f5;
                                          border-left:3px solid #8b1a1a;
                                          border-radius:4px;">
                                <tr>
                                    <td style="padding:13px 16px;">
                                        <p style="margin:0; font-size:12px; color:#666666;
                                                  line-height:1.65;">
                                            <strong style="color:#8b1a1a;">Security tip:</strong>
                                            If you did not request a password reset, please ignore
                                            this email. Your account is safe and your password
                                            will not be changed.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Bottom accent bar -->
                    <tr>
                        <td style="height:4px;
                                   background:linear-gradient(90deg,#8b1a1a,#c0392b,#8b1a1a);">
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="background-color:#faf6f6; padding:20px 40px;">
                            <p style="margin:0 0 4px 0; font-size:12px; font-weight:600;
                                      color:#8b1a1a; letter-spacing:1.5px;">
                                tailor-management 
                            </p>
                            <p style="margin:0; font-size:11px; color:#bbbbbb; line-height:1.6;">
                                This is an automated email — please do not reply.<br/>
                                &copy; 2026 Tailor Management . All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;
