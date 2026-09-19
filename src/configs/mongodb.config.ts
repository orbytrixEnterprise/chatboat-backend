import mongoose from 'mongoose';
import { applicationLogger, configuration, Global } from './';
import { User, getNextSequenceValue } from '../app/model';

export const seedDefaultAdmin = async (): Promise<void> => {
    const shouldSeed = true; // Set to true only in secure production environments
    if (!shouldSeed) {
        return;
    }
    try {
        const adminEmail = "admin@gmail.com";
        const encryptedEmail = await Global.encrypt(adminEmail);
        const encryptedName = await Global.encrypt("Orbytrix Admin");
        const encryptedPassword = await Global.encrypt("orbytrix@2026");

        const existingAdmin = await User.findOne({
            $or: [
                { emailId: encryptedEmail, userType: "ADMIN" },
                { emailId: adminEmail, userType: "ADMIN" }
            ]
        });

        if (!existingAdmin) {
            const userId = await getNextSequenceValue("userId");
            await User.create({
                userId,
                name: encryptedName,
                emailId: encryptedEmail,
                password: encryptedPassword,
                userType: "ADMIN",
                status: "ACTIVE"
            });
            console.log("👤 Default admin user seeded successfully.");
        } else if (existingAdmin.emailId === adminEmail || existingAdmin.name === "Orbytrix Admin") {
            // Update to encrypted values if previously unencrypted
            existingAdmin.name = encryptedName;
            existingAdmin.emailId = encryptedEmail;
            existingAdmin.password = encryptedPassword;
            await existingAdmin.save();
            console.log("👤 Default admin credentials updated to encrypted storage.");
        }
    } catch (err: any) {
        applicationLogger.error("Error seeding default admin", { err: err.toString() });
        console.error("🔥 Error seeding default admin:", err);
    }
};

export const connectDb = async (): Promise<void> => {
    try {
        await mongoose.connect(configuration.mongodbUri);
        console.log("🍃 MongoDB connected successfully");
        await seedDefaultAdmin();
    } catch (err: any) {
        applicationLogger.error("MongoDB connection error", { err: err.toString() });
        console.error("🔥 MongoDB connection error:", err);
        process.exit(1);
    }
};
