import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const DB = process.env.DATABASE;

const connectDB = async () => {
    try {
        if (!DB) {
            throw new Error("DATABASE environment variable is not defined");
        }

        // Simplified options for better compatibility with SRV records
        const options = {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000, // Increase timeout for DNS resolution
            socketTimeoutMS: 45000,
            // Removed family: 4 to allow SRV resolution to decide
        };

        const conn = await mongoose.connect(DB, options);



        // Handle connection events
        mongoose.connection.on('error', err => {
            console.error(`\x1b[31m✘ MongoDB connection error: ${err}\x1b[0m`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('\x1b[33m! MongoDB disconnected. Hub will attempt to reconnect...\x1b[0m');
        });

    } catch (error) {
        console.error(`\x1b[31m✘ Error connecting to database: ${error.message}\x1b[0m`);
        // Don't exit immediately, let nodemon retry if it's a transient DNS issue
        // But for critical production startup, exit(1) is standard.
        // Let's keep it for now but increase timeout.
        process.exit(1);
    }
};

export default connectDB;