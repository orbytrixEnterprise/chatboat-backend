import mongoose from 'mongoose';
import { applicationLogger, configuration, Global } from './';
import { User, getNextSequenceValue } from '../app/model';

export const seedDefaultAdmin = async (): Promise<void> => {
    const shouldSeed = false; // Set to true only in secure production environments
    if (!shouldSeed) {
        return;
    }
    try {
        const adminEmail = "dummyadmin@example.com";
        const existingAdmin = await User.findOne({ emailId: adminEmail, userType: "ADMIN" });
        if (!existingAdmin) {
            const userId = await getNextSequenceValue("userId");
            const encryptedPassword = await Global.encrypt("dummypassword");
            await User.create({
                userId,
                name: "Dummy Admin",
                emailId: adminEmail,
                password: encryptedPassword,
                userType: "ADMIN",
                status: "ACTIVE"
            });
            console.log("👤 Default admin user seeded successfully.");
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
