/* eslint-disable camelcase */
import { User, getNextSequenceValue } from "../model";
import { MongoHelperService } from "../../services";
import { Global } from "../../configs";

export class UserService {

    /**
     * Decrypts user document fields before returning to application / controller.
     */
    async decryptUserData(user: any) {
        if (!user) {
            return user;
        }
        const u = user.toObject ? user.toObject() : { ...user };
        if (u.name) {
            u.name = await Global.decrypt(u.name);
        }
        if (u.emailId) {
            u.emailId = await Global.decrypt(u.emailId);
        }
        if (u.mobileNo) {
            u.mobileNo = await Global.decrypt(u.mobileNo);
        }
        if (u.address) {
            u.address = await Global.decrypt(u.address);
        }
        return u;
    }

    /**
     * Creates or gets a temporary guest user.
     */
    async createOrGetGuest(guestId: string) {
        let user = await User.findOne({ guestId }).lean();
        if (!user) {
            const userId = await getNextSequenceValue("userId");
            user = (await User.create({
                userId,
                guestId,
                userType: "USER",
                status: "ACTIVE"
            })).toObject();
        }
        return await this.decryptUserData(user);
    }

    /**
     * Logs in or signs up a social OAuth user (Google/Apple) and links guest session if provided.
     */
    async registerOrLinkSocial(provider: string, socialId: string, emailId: string, name: string, guestId?: string) {
        const query: any = {};
        if (provider === "google") {
            query.googleId = socialId;
        } else {
            query.appleId = socialId;
        }

        const emailLower = emailId.toLowerCase();
        const encryptedEmail = await Global.encrypt(emailLower);
        const encryptedName = name ? await Global.encrypt(name) : "";

        // 1. Check if user already exists with this social ID
        let user = await User.findOne(query);
        if (user) {
            return await this.decryptUserData(user);
        }

        // 2. Check if user already exists with this email address
        user = await User.findOne({
            $or: [{ emailId: encryptedEmail }, { emailId: emailLower }]
        });
        if (user) {
            // Link social provider to existing email account
            if (provider === "google") {
                user.googleId = socialId;
            } else {
                user.appleId = socialId;
            }
            if (encryptedName && (!user.name || user.name === "")) {
                user.name = encryptedName;
            }
            user.emailId = encryptedEmail;
            await user.save();
            return await this.decryptUserData(user);
        }

        // 3. Link to guest session if guestId is provided and exists
        if (guestId) {
            const guestUser = await User.findOne({ guestId });
            if (guestUser && !guestUser.emailId && !guestUser.googleId && !guestUser.appleId) {
                guestUser.emailId = encryptedEmail;
                guestUser.name = encryptedName || guestUser.name;
                if (provider === "google") {
                    guestUser.googleId = socialId;
                } else {
                    guestUser.appleId = socialId;
                }
                await guestUser.save();
                return await this.decryptUserData(guestUser);
            }
        }

        // 4. Create new user if not linked
        const userId = await getNextSequenceValue("userId");
        const newUser = await User.create({
            userId,
            emailId: encryptedEmail,
            name: encryptedName,
            googleId: provider === "google" ? socialId : undefined,
            appleId: provider === "apple" ? socialId : undefined,
            userType: "USER",
            status: "ACTIVE"
        });
        return await this.decryptUserData(newUser);
    }

    /**
     * Registers a new user manually with email, name, mobile, and password.
     */
    async manualSignup(data: any) {
        const emailLower = data.emailId.toLowerCase();
        const encryptedEmail = await Global.encrypt(emailLower);
        const encryptedName = await Global.encrypt(data.name);
        const encryptedMobile = data.mobileNo ? await Global.encrypt(data.mobileNo) : "";
        const encryptedPassword = await Global.encrypt(data.password);
        const encryptedAddress = data.address ? await Global.encrypt(data.address) : "";

        // 1. Check if email already registered
        const existingEmail = await User.findOne({
            $or: [{ emailId: encryptedEmail }, { emailId: emailLower }]
        });
        if (existingEmail && (existingEmail.password || existingEmail.googleId || existingEmail.appleId)) {
            throw new Error("Email address already registered.");
        }

        // 2. Check if guestId is provided and link to it
        if (data.guestId) {
            const guestUser = await User.findOne({ guestId: data.guestId });
            if (guestUser && !guestUser.emailId && !guestUser.googleId && !guestUser.appleId) {
                guestUser.name = encryptedName;
                guestUser.emailId = encryptedEmail;
                guestUser.mobileNo = encryptedMobile;
                guestUser.password = encryptedPassword;
                guestUser.address = encryptedAddress;
                guestUser.updatingDate = new Date();
                await guestUser.save();
                return await this.decryptUserData(guestUser);
            }
        }

        // 3. Create fresh user
        const userId = await getNextSequenceValue("userId");
        const newUser = await User.create({
            userId,
            name: encryptedName,
            emailId: encryptedEmail,
            mobileNo: encryptedMobile,
            password: encryptedPassword,
            address: encryptedAddress,
            userType: "USER",
            status: "ACTIVE"
        });
        return await this.decryptUserData(newUser);
    }

    /**
     * Logs in a user manually using email and password.
     */
    async manualLogin(emailId: string, password: string) {
        const emailLower = emailId.toLowerCase();
        const encryptedEmail = await Global.encrypt(emailLower);
        const encryptedPassword = await Global.encrypt(password);

        const user = await User.findOne({
            $or: [
                { emailId: encryptedEmail, password: encryptedPassword },
                { emailId: emailLower, password: encryptedPassword }
            ]
        });
        if (user && user.status !== "ACTIVE") {
            throw new Error("Your account is currently inactive.");
        }
        return user ? await this.decryptUserData(user) : null;
    }

    /**
     * Finds a user by their userId.
     */
    async findById(userId: number) {
        const user = await User.findOne({ userId }).lean();
        return user ? await this.decryptUserData(user) : null;
    }

    /**
     * Updates profile details of the user.
     */
    async updateProfile(userId: number, updateData: any) {
        const payload: any = { ...updateData, updatingDate: new Date() };
        if (payload.name) {
            payload.name = await Global.encrypt(payload.name);
        }
        if (payload.emailId) {
            payload.emailId = await Global.encrypt(payload.emailId.toLowerCase());
        }
        if (payload.mobileNo) {
            payload.mobileNo = await Global.encrypt(payload.mobileNo);
        }
        if (payload.address) {
            payload.address = await Global.encrypt(payload.address);
        }
        if (payload.password) {
            payload.password = await Global.encrypt(payload.password);
        }

        const updated = await User.findOneAndUpdate(
            { userId },
            { $set: payload },
            { returnDocument: 'after' }
        ).lean();
        return updated ? await this.decryptUserData(updated) : null;
    }

    /**
     * Search users with pagination, filters and sorting.
     */
    async userSearch(body: any) {
        const searchBody = { ...body };

        if (searchBody.filter && Array.isArray(searchBody.filter)) {
            searchBody.filter = await Promise.all(searchBody.filter.map(async (f: any) => {
                if (["name", "emailId", "mobileNo", "address"].includes(f.key) && f.value) {
                    return { ...f, value: await Global.encrypt(f.value) };
                }
                return f;
            }));
        }

        return MongoHelperService.search(
            User,
            searchBody,
            async (u: any) => ({
                user_id: u.userId,
                guest_id: u.guestId,
                name: u.name ? await Global.decrypt(u.name) : "",
                email_id: u.emailId ? await Global.decrypt(u.emailId) : "",
                mobile_no: u.mobileNo ? await Global.decrypt(u.mobileNo) : "",
                address: u.address ? await Global.decrypt(u.address) : "",
                user_type: u.userType,
                status: u.status,
                creating_date: u.creatingDate
            }),
            {
                filterFields: {
                    name: "name",
                    emailId: "emailId",
                    mobileNo: "mobileNo",
                    userType: "userType",
                    status: "status",
                    adminId: "adminId"
                },
                sortFields: {
                    name: "name",
                    emailId: "emailId",
                    mobileNo: "mobileNo",
                    userType: "userType",
                    status: "status"
                }
            }
        );
    }
}
