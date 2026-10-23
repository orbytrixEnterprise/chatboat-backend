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
            // If already in real form (contains '@'), keep as is; otherwise decrypt legacy
            if (u.emailId.includes('@')) {
                // Already in real format
            } else {
                try {
                    u.emailId = await Global.decrypt(u.emailId);
                } catch {
                    // fallback if not encrypted
                }
            }
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

        const emailLower = emailId.toLowerCase().trim();
        const encryptedName = name ? await Global.encrypt(name) : "";

        // 1. Check if user already exists with this social ID
        let user = await User.findOne(query);
        if (user) {
            return await this.decryptUserData(user);
        }

        // 2. Check if user already exists with this email address
        const legacyEncryptedEmail = await Global.encrypt(emailLower);
        user = await User.findOne({
            $or: [{ emailId: emailLower }, { emailId: legacyEncryptedEmail }]
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
            user.emailId = emailLower; // Store in real form
            await user.save();
            return await this.decryptUserData(user);
        }

        // 3. Link to guest session if guestId is provided and exists
        if (guestId) {
            const guestUser = await User.findOne({ guestId });
            if (guestUser && !guestUser.emailId && !guestUser.googleId && !guestUser.appleId) {
                guestUser.emailId = emailLower; // Store in real form
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
            emailId: emailLower, // Store in real form
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
        const emailLower = data.emailId.toLowerCase().trim();
        const encryptedName = await Global.encrypt(data.name);
        const encryptedMobile = data.mobileNo ? await Global.encrypt(data.mobileNo) : "";
        const encryptedPassword = await Global.encrypt(data.password);
        const encryptedAddress = data.address ? await Global.encrypt(data.address) : "";

        // 1. Check if email already registered
        const legacyEncryptedEmail = await Global.encrypt(emailLower);
        const existingEmail = await User.findOne({
            $or: [{ emailId: emailLower }, { emailId: legacyEncryptedEmail }]
        });
        if (existingEmail && (existingEmail.password || existingEmail.googleId || existingEmail.appleId)) {
            throw new Error("Email address already registered.");
        }

        // 2. Check if guestId is provided and link to it
        if (data.guestId) {
            const guestUser = await User.findOne({ guestId: data.guestId });
            if (guestUser && !guestUser.emailId && !guestUser.googleId && !guestUser.appleId) {
                guestUser.name = encryptedName;
                guestUser.emailId = emailLower; // Store in real form
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
            emailId: emailLower, // Store in real form
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
        const emailLower = emailId.toLowerCase().trim();
        const legacyEncryptedEmail = await Global.encrypt(emailLower);
        const encryptedPassword = await Global.encrypt(password);

        const user = await User.findOne({
            $or: [
                { emailId: emailLower, password: encryptedPassword },
                { emailId: legacyEncryptedEmail, password: encryptedPassword }
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
        const payload: any = { updatingDate: new Date() };
        if (updateData.name && updateData.name.trim().length > 0) {
            payload.name = await Global.encrypt(updateData.name.trim());
        }
        if (updateData.emailId && updateData.emailId.trim().length > 0) {
            payload.emailId = updateData.emailId.toLowerCase().trim(); // Store in real form
        }
        if (updateData.mobileNo && updateData.mobileNo.trim().length > 0) {
            payload.mobileNo = await Global.encrypt(updateData.mobileNo.trim());
        }
        if (updateData.address && updateData.address.trim().length > 0) {
            payload.address = await Global.encrypt(updateData.address.trim());
        }
        if (updateData.password && updateData.password.trim().length > 0) {
            payload.password = await Global.encrypt(updateData.password);
        }
        if (updateData.profileImage && updateData.profileImage.trim().length > 0) {
            payload.profileImage = updateData.profileImage;
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
                if (["name", "mobileNo", "address"].includes(f.key) && f.value) {
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
                email_id: u.emailId ? (u.emailId.includes('@') ? u.emailId : await Global.decrypt(u.emailId)) : "",
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
