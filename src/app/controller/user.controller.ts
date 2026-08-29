/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Controller } from './controller';
import { UserModel } from '../model';
import response from '../../configs/response';
import { applicationLogger, configuration, Global } from '../../configs';

export class UserController extends Controller {

    constructor() {
        super();
    }

    private async generateUserTokens(user: any) {
        const tokenPayload = {
            id: user.userId,
            adminId: user.adminId || 0,
            role: user.userType,
            tokenType: "Access",
            ipAddress: this.req.ip
        };

        const access_token = await Global.token(tokenPayload, configuration.tokenExpiry);
        const refresh_token = await Global.token(tokenPayload, configuration.refreshTokenExpiry);

        return {
            userId: user.userId,
            guestId: user.guestId,
            name: user.name,
            emailId: user.emailId,
            mobileNo: user.mobileNo,
            userType: user.userType,
            status: user.status,
            access_token,
            refresh_token
        };
    }

    /**
     * Guest User Registration/Login
     */
    async guest() {
        try {
            const { guestId } = this.req.body;
            const user = await new UserModel().createOrGetGuest(guestId);
            const tokenResult = await this.generateUserTokens(user);

            return this.res.status(200).send({
                status: 1,
                message: "Guest session initialized successfully.",
                data: tokenResult
            });
        } catch (err: any) {
            applicationLogger.error("UserController guest", {
                body: this.req.body,
                error: err.toString()
            });
            return this.res.status(500).send({
                status: 0,
                message: response["100"],
                error: err.toString()
            });
        }
    }

    /**
     * Google/Apple Social Sign-in & Merge Flow
     */
    async socialLogin() {
        try {
            const { provider, socialId, emailId, name, guestId } = this.req.body;
            const user = await new UserModel().registerOrLinkSocial(provider, socialId, emailId, name, guestId);
            const tokenResult = await this.generateUserTokens(user);

            return this.res.status(200).send({
                status: 1,
                message: "Social login completed successfully.",
                data: tokenResult
            });
        } catch (err: any) {
            applicationLogger.error("UserController socialLogin", {
                body: this.req.body,
                error: err.toString()
            });
            return this.res.status(500).send({
                status: 0,
                message: response["100"],
                error: err.toString()
            });
        }
    }

    /**
     * Manual Sign Up
     */
    async signup() {
        try {
            const body = this.req.body;
            body.password = await Global.encrypt(body.password);

            const user = await new UserModel().manualSignup(body);
            const tokenResult = await this.generateUserTokens(user);

            return this.res.status(200).send({
                status: 1,
                message: "Account created successfully.",
                data: tokenResult
            });
        } catch (err: any) {
            applicationLogger.error("UserController signup", {
                body: this.req.body,
                error: err.toString()
            });
            return this.res.status(200).send({
                status: 0,
                message: err.message || "Failed to create account."
            });
        }
    }

    /**
     * Manual Login
     */
    async login() {
        try {
            const { emailId, password } = this.req.body;
            const encryptedPassword = await Global.encrypt(password);

            const user = await new UserModel().manualLogin(emailId, encryptedPassword);
            if (!user) {
                return this.res.status(200).send({
                    status: 0,
                    message: "Invalid email address or password."
                });
            }

            const tokenResult = await this.generateUserTokens(user);
            return this.res.status(200).send({
                status: 1,
                message: "Logged in successfully.",
                data: tokenResult
            });
        } catch (err: any) {
            applicationLogger.error("UserController login", {
                body: this.req.body,
                error: err.toString()
            });
            return this.res.status(500).send({
                status: 0,
                message: response["100"],
                error: err.toString()
            });
        }
    }

    /**
     * Get Current Profile
     */
    async profile() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const user = await new UserModel().findById(userId);

            if (!user) {
                return this.res.status(200).send({
                    status: 0,
                    message: "User profile not found."
                });
            }

            return this.res.status(200).send({
                status: 1,
                message: "Profile retrieved successfully.",
                data: {
                    userId: user.userId,
                    guestId: user.guestId,
                    name: user.name,
                    emailId: user.emailId,
                    mobileNo: user.mobileNo,
                    userType: user.userType,
                    address: user.address,
                    profileImage: user.profileImage,
                    status: user.status
                }
            });
        } catch (err: any) {
            applicationLogger.error("UserController profile", {
                error: err.toString()
            });
            return this.res.status(500).send({
                status: 0,
                message: response["100"],
                error: err.toString()
            });
        }
    }

    /**
     * Update Profile Details
     */
    async updateProfile() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const updatedUser = await new UserModel().updateProfile(userId, this.req.body);

            if (!updatedUser) {
                return this.res.status(200).send({
                    status: 0,
                    message: "Failed to update profile."
                });
            }

            return this.res.status(200).send({
                status: 1,
                message: "Profile updated successfully.",
                data: {
                    userId: updatedUser.userId,
                    guestId: updatedUser.guestId,
                    name: updatedUser.name,
                    emailId: updatedUser.emailId,
                    mobileNo: updatedUser.mobileNo,
                    userType: updatedUser.userType,
                    address: updatedUser.address,
                    profileImage: updatedUser.profileImage,
                    status: updatedUser.status
                }
            });
        } catch (err: any) {
            applicationLogger.error("UserController updateProfile", {
                body: this.req.body,
                error: err.toString()
            });
            return this.res.status(500).send({
                status: 0,
                message: response["100"],
                error: err.toString()
            });
        }
    }

    /**
     * Search Users with pagination, filters and sorting.
     */
    async searchUser() {
        try {
            const body = this.req.body;
            body.action = "COUNT";

            const countData = await new UserModel().userSearch(body);
            const total = countData.length > 0 ? countData[0].count : 0;

            if (total > 0) {
                body.action = "SELECT";
                const data = await new UserModel().userSearch(body);
                return this.res.status(200).send({
                    status: 1,
                    message: "Users retrieved successfully.",
                    data: {
                        data,
                        page: body.page,
                        noOf: body.noOf,
                        total
                    }
                });
            } else {
                return this.res.status(200).send({
                    status: 1,
                    message: "No users found.",
                    data: {
                        data: [],
                        page: body.page,
                        noOf: body.noOf,
                        total: 0
                    }
                });
            }
        } catch (err: any) {
            applicationLogger.error("UserController searchUser", {
                body: this.req.body,
                error: err.toString()
            });
            return this.res.status(500).send({
                status: 0,
                message: response["100"],
                error: err.toString()
            });
        }
    }
}
