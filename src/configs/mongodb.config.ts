import mongoose from 'mongoose';
import { applicationLogger, configuration, Global } from './';
import { User, Character, getNextSequenceValue } from '../app/model';

export const seedDefaultAdmin = async (): Promise<void> => {
    const shouldSeed = true; // Set to true only in secure production environments
    if (!shouldSeed) {
        return;
    }
    try {
        const adminEmail = "admin@gmail.com";
        const encryptedName = await Global.encrypt("Orbytrix Admin");
        const encryptedPassword = await Global.encrypt("orbytrix@2026");

        const existingAdmin = await User.findOne({
            $or: [
                { emailId: adminEmail, userType: "ADMIN" },
                { emailId: await Global.encrypt(adminEmail), userType: "ADMIN" }
            ]
        });

        if (!existingAdmin) {
            const userId = await getNextSequenceValue("userId");
            await User.create({
                userId,
                name: encryptedName,
                emailId: adminEmail, // Plain real form
                password: encryptedPassword,
                userType: "ADMIN",
                status: "ACTIVE"
            });
            console.log("👤 Default admin user seeded successfully.");
        } else {
            existingAdmin.name = encryptedName;
            existingAdmin.emailId = adminEmail; // Plain real form
            existingAdmin.password = encryptedPassword;
            await existingAdmin.save();
            console.log("👤 Default admin credentials stored in real email form.");
        }
    } catch (err: any) {
        applicationLogger.error("Error seeding default admin", { err: err.toString() });
        console.error("🔥 Error seeding default admin:", err);
    }
};

/**
 * Migration & Data Backfill:
 * Safely backfill legacy character records that were created before the
 * visibility/creator sharing updates, setting default visibility="PUBLIC",
 * createdBy=0 (Admin/System), status="ACTIVE", and fallback parameters.
 */
export const migrateExistingCharacters = async (): Promise<void> => {
    try {
        const visibilityResult = await Character.updateMany(
            {
                $or: [
                    { visibility: { $exists: false } },
                    { visibility: null },
                    { visibility: "" as any }
                ]
            } as any,
            {
                $set: { visibility: "PUBLIC" }
            }
        );

        const createdByResult = await Character.updateMany(
            {
                $or: [
                    { createdBy: { $exists: false } },
                    { createdBy: null }
                ]
            } as any,
            {
                $set: { createdBy: 0 }
            }
        );

        const statusResult = await Character.updateMany(
            {
                $or: [
                    { status: { $exists: false } },
                    { status: null },
                    { status: "" as any }
                ]
            } as any,
            {
                $set: { status: "ACTIVE" }
            }
        );

        await Character.updateMany(
            {
                $or: [
                    { temperature: { $exists: false } },
                    { temperature: null }
                ]
            },
            { $set: { temperature: 0.7 } }
        );

        await Character.updateMany(
            {
                $or: [
                    { maxTokens: { $exists: false } },
                    { maxTokens: null }
                ]
            },
            { $set: { maxTokens: 250 } }
        );

        await Character.updateMany(
            {
                $or: [
                    { priority: { $exists: false } },
                    { priority: null }
                ]
            },
            { $set: { priority: 0 } }
        );

        await Character.updateMany(
            {
                $or: [
                    { greetingMessage: { $exists: false } },
                    { greetingMessage: null },
                    { greetingMessage: "" }
                ]
            },
            { $set: { greetingMessage: "Hello! How can I help you today?" } }
        );

        await Character.updateMany(
            {
                $or: [
                    { avatarImage: { $exists: false } },
                    { avatarImage: null }
                ]
            },
            { $set: { avatarImage: "" } }
        );

        await Character.updateMany(
            {
                $or: [
                    { title: { $exists: false } },
                    { title: null }
                ]
            },
            { $set: { title: "" } }
        );

        await Character.updateMany(
            {
                $or: [
                    { tagline: { $exists: false } },
                    { tagline: null }
                ]
            },
            { $set: { tagline: "" } }
        );

        await Character.updateMany(
            {
                $or: [
                    { description: { $exists: false } },
                    { description: null }
                ]
            },
            { $set: { description: "" } }
        );

        await Character.updateMany(
            {
                $or: [
                    { exampleConversations: { $exists: false } },
                    { exampleConversations: null }
                ]
            },
            { $set: { exampleConversations: "" } }
        );

        const totalUpdated = (visibilityResult.modifiedCount || 0) + (createdByResult.modifiedCount || 0) + (statusResult.modifiedCount || 0);
        if (totalUpdated > 0) {
            console.log(`✨ Migrated existing characters: ${visibilityResult.modifiedCount} set to PUBLIC, ${createdByResult.modifiedCount} set to createdBy=0.`);
        }
    } catch (err: any) {
        applicationLogger.error("Error migrating existing characters", { err: err.toString() });
        console.error("🔥 Error migrating existing characters:", err);
    }
};

/**
 * Migration & Data Backfill:
 * Safely decrypt and convert legacy encrypted emails back to their plain, real email format.
 */
export const migrateExistingUsers = async (): Promise<void> => {
    try {
        const users = await User.find({ emailId: { $exists: true, $ne: "" } });
        let updatedCount = 0;
        for (const user of users) {
            if (user.emailId && !user.emailId.includes("@")) {
                try {
                    const decrypted = await Global.decrypt(user.emailId);
                    if (decrypted && decrypted.includes("@")) {
                        user.emailId = decrypted.toLowerCase().trim();
                        await user.save();
                        updatedCount++;
                    }
                } catch (err: any) {
                    applicationLogger.error("Failed to decrypt user email", { userId: user.userId, error: err.toString() });
                }
            }
        }
        if (updatedCount > 0) {
            console.log(`👤 Migrated ${updatedCount} existing user(s) to plain-text real email format.`);
        }
    } catch (err: any) {
        applicationLogger.error("Error migrating existing users", { err: err.toString() });
        console.error("🔥 Error migrating existing users:", err);
    }
};

export const connectDb = async (): Promise<void> => {
    try {
        await mongoose.connect(configuration.mongodbUri);
        console.log("🍃 MongoDB connected successfully");
        await seedDefaultAdmin();
        await migrateExistingCharacters();
        await migrateExistingUsers();
    } catch (err: any) {
        applicationLogger.error("MongoDB connection error", { err: err.toString() });
        console.error("🔥 MongoDB connection error:", err);
        process.exit(1);
    }
};
