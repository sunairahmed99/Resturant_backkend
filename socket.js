import { createServer } from 'http';
import { Server } from 'socket.io';
import Message from './Models/Message.js';

let io;
let httpServer;

export const initSocket = (app) => {
    httpServer = createServer(app);

    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {


        socket.on('join_room', (roomId) => socket.join(roomId));

        socket.on('send_message', async (data) => {
            try {
                const newMessage = await Message.create(data);
                io.to(data.roomId).emit('receive_message', newMessage);
                if (data.senderType === 'user') io.to('admins').emit('receive_message', newMessage);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {});
    });

    return httpServer;
};

export const getIO = () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
};
