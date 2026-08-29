import { User } from "./mongodb/user.schema";
import { getNextSequenceValue } from "./mongodb/counter.schema";

export class UserModel {

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
        return user;
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

        // 1. Check if user already exists with this social ID
        let user = await User.findOne(query);
        if (user) {
            return user.toObject();
        }

        // 2. Check if user already exists with this email address
        user = await User.findOne({ emailId: emailId.toLowerCase() });
        if (user) {
            // Link social provider to existing email account
            if (provider === "google") {
                user.googleId = socialId;
            } else {
                user.appleId = socialId;
            }
            if (name && !user.name) {
                user.name = name;
            }
            await user.save();
            return user.toObject();
        }

        // 3. Link to guest session if guestId is provided and exists
        if (guestId) {
            const guestUser = await User.findOne({ guestId });
            // Only merge if the guest user has no registered email or social accounts
            if (guestUser && !guestUser.emailId && !guestUser.googleId && !guestUser.appleId) {
                guestUser.emailId = emailId.toLowerCase();
                guestUser.name = name || guestUser.name;
                if (provider === "google") {
                    guestUser.googleId = socialId;
                } else {
                    guestUser.appleId = socialId;
                }
                await guestUser.save();
                return guestUser.toObject();
            }
        }

        // 4. Create new user if not linked
        const userId = await getNextSequenceValue("userId");
        const newUser = await User.create({
            userId,
            emailId: emailId.toLowerCase(),
            name,
            googleId: provider === "google" ? socialId : undefined,
            appleId: provider === "apple" ? socialId : undefined,
            userType: "USER",
            status: "ACTIVE"
        });
        return newUser.toObject();
    }

    /**
     * Registers a new user manually with email, name, mobile, and password.
     */
    async manualSignup(data: any) {
        const emailLower = data.emailId.toLowerCase();

        // 1. Check if email already registered
        const existingEmail = await User.findOne({ emailId: emailLower });
        if (existingEmail && (existingEmail.password || existingEmail.googleId || existingEmail.appleId)) {
            throw new Error("Email address already registered.");
        }

        // 2. Check if guestId is provided and link to it
        if (data.guestId) {
            const guestUser = await User.findOne({ guestId: data.guestId });
            if (guestUser && !guestUser.emailId && !guestUser.googleId && !guestUser.appleId) {
                guestUser.name = data.name;
                guestUser.emailId = emailLower;
                guestUser.mobileNo = data.mobileNo || "";
                guestUser.password = data.password;
                guestUser.updatingDate = new Date();
                await guestUser.save();
                return guestUser.toObject();
            }
        }

        // 3. Create fresh user
        const userId = await getNextSequenceValue("userId");
        const newUser = await User.create({
            userId,
            name: data.name,
            emailId: emailLower,
            mobileNo: data.mobileNo || "",
            password: data.password,
            userType: "USER",
            status: "ACTIVE"
        });
        return newUser.toObject();
    }

    /**
     * Logs in a user manually using email and hashed/encrypted password.
     */
    async manualLogin(emailId: string, passwordHash: string) {
        const user = await User.findOne({
            emailId: emailId.toLowerCase(),
            password: passwordHash
        });
        if (user && user.status !== "ACTIVE") {
            throw new Error("Your account is currently inactive.");
        }
        return user ? user.toObject() : null;
    }

    /**
     * Finds a user by their userId.
     */
    async findById(userId: number) {
        return User.findOne({ userId }).lean();
    }

    /**
     * Updates profile details of the user.
     */
    async updateProfile(userId: number, updateData: any) {
        const updated = await User.findOneAndUpdate(
            { userId },
            { $set: { ...updateData, updatingDate: new Date() } },
            { returnDocument: 'after' }
        ).lean();
        return updated;
    }
}
