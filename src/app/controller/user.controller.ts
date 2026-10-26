/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Controller } from './controller';
import { UserService } from '../services';
import { applicationLogger, configuration, Global, response } from '../../configs';

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
            const user = await new UserService().createOrGetGuest(guestId);
            const tokenResult = await this.generateUserTokens(user);

            return this.res.status(200).send({ status: 1, message: "Guest session initialized successfully.", data: tokenResult });
        } catch (err: any) {
            applicationLogger.error("UserController guest", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Pre-login check for Social Sign-In (Apple/Google).
     * Returns account existence, guest link status, and whether merge is permissible.
     */
    async checkSocial() {
        try {
            const { provider, socialId, emailId, guestId } = this.req.body;
            const result = await new UserService().checkSocialAccount(provider, socialId, emailId, guestId);

            return this.res.status(200).send({
                status: 1,
                message: "Social account verification completed.",
                data: result
            });
        } catch (err: any) {
            applicationLogger.error("UserController checkSocial", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Google/Apple Social Sign-in & Merge Flow
     */
    async socialLogin() {
        try {
            const { provider, socialId, emailId, name, guestId, mergeGuestChats } = this.req.body;
            const user = await new UserService().registerOrLinkSocial(provider, socialId, emailId, name, guestId, mergeGuestChats);
            const tokenResult = await this.generateUserTokens(user);

            return this.res.status(200).send({ status: 1, message: "Social login completed successfully.", data: tokenResult });
        } catch (err: any) {
            applicationLogger.error("UserController socialLogin", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Manual Sign Up
     */
    async signup() {
        try {
            const user = await new UserService().manualSignup(this.req.body);
            const tokenResult = await this.generateUserTokens(user);

            return this.res.status(200).send({ status: 1, message: "Account created successfully.", data: tokenResult });
        } catch (err: any) {
            applicationLogger.error("UserController signup", { body: this.req.body, error: err.toString() });
            return this.res.status(200).send({ status: 0, message: err.message || "Failed to create account." });
        }
    }

    /**
     * Manual Login
     */
    async login() {
        try {
            const { emailId, password } = this.req.body;
            const user = await new UserService().manualLogin(emailId, password);
            if (!user) {
                return this.res.status(200).send({ status: 0, message: "Invalid email address or password." });
            }

            const tokenResult = await this.generateUserTokens(user);
            return this.res.status(200).send({ status: 1, message: "Logged in successfully.", data: tokenResult });
        } catch (err: any) {
            applicationLogger.error("UserController login", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Get Current Profile
     */
    async profile() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const user = await new UserService().findById(userId);

            if (!user) {
                return this.res.status(200).send({ status: 0, message: "User profile not found." });
            }

            return this.res.status(200).send({ status: 1, message: "Profile retrieved successfully.", data: { userId: user.userId, guestId: user.guestId, name: user.name, emailId: user.emailId, mobileNo: user.mobileNo, userType: user.userType, address: user.address, profileImage: user.profileImage, status: user.status } });
        } catch (err: any) {
            applicationLogger.error("UserController profile", { error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Update Profile Details
     */
    async updateProfile() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            const updatedUser = await new UserService().updateProfile(userId, this.req.body);

            if (!updatedUser) {
                return this.res.status(200).send({ status: 0, message: "Failed to update profile." });
            }

            return this.res.status(200).send({ status: 1, message: "Profile updated successfully.", data: { userId: updatedUser.userId, guestId: updatedUser.guestId, name: updatedUser.name, emailId: updatedUser.emailId, mobileNo: updatedUser.mobileNo, userType: updatedUser.userType, address: updatedUser.address, profileImage: updatedUser.profileImage, status: updatedUser.status } });
        } catch (err: any) {
            applicationLogger.error("UserController updateProfile", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Search Users with pagination, filters and sorting.
     */
    async searchUser() {
        try {
            const body = this.req.body;
            body.action = "COUNT";

            const countData = await new UserService().userSearch(body);
            const total = countData.length > 0 ? countData[0].count : 0;

            if (total > 0) {
                body.action = "SELECT";
                const data = await new UserService().userSearch(body);
                return this.res.status(200).send({ status: 1, message: "Users retrieved successfully.", data: { data, page: body.page, noOf: body.noOf, total } });
            } else {
                return this.res.status(200).send({ status: 1, message: "No users found.", data: { data: [], page: body.page, noOf: body.noOf, total: 0 } });
            }
        } catch (err: any) {
            applicationLogger.error("UserController searchUser", { body: this.req.body, error: err.toString() });
            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });
        }
    }

    /**
     * Delete user account (Soft delete conforming to App Store guidelines).
     * Automatically invalidates active session, unlinks Apple/Google/Guest IDs to prevent index collisions,
     * and archives chat conversations so the user can re-register freshly in the future.
     */
    async deleteAccount() {
        try {
            const userId = await Global.getTokenValue(this.req, "id");
            if (!userId) {
                return this.res.status(401).send({ status: 0, message: "Unauthorized user." });
            }

            await new UserService().deleteAccount(userId);

            return this.res.status(200).send({
                status: 1,
                message: "Your account and associated data have been deleted successfully."
            });
        } catch (err: any) {
            applicationLogger.error("UserController deleteAccount", { error: err.toString() });
            return this.res.status(500).send({ status: 0, message: err.message || response["100"] });
        }
    }
}

