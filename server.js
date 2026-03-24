import app from "./app.js";
import { initSocket } from "./socket.js";
import mongoose from 'mongoose';

const port = process.env.PORT || 9000;

const httpServer = initSocket(app);

const server = httpServer.listen(port, () => {
});

// Graceful Shutdown
const gracefulShutdown = () => {
    server.close(async () => {
        try {
            await mongoose.connection.close(false);
            process.exit(0);
        } catch (err) {
            process.exit(1);
        }
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);