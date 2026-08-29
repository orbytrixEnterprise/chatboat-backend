import mongoose from 'mongoose';
import { applicationLogger, configuration } from './';

export const connectDb = async (): Promise<void> => {
    try {
        await mongoose.connect(configuration.mongodbUri);
        console.log("🍃 MongoDB connected successfully");
    } catch (err: any) {
        applicationLogger.error("MongoDB connection error", { err: err.toString() });
        console.error("🔥 MongoDB connection error:", err);
        process.exit(1);
    }
};
