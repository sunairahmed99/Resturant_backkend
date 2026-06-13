import Message from '../Models/Message.js';
import { getIO } from '../socket.js';

export const getMessageHistory = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getActiveRooms = async (req, res) => {
    try {
        const rooms = await Message.distinct('roomId');
        res.status(200).json({
            success: true,
            rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const newMessage = await Message.create(req.body);
        
        try {
            const io = getIO();
            io.to(newMessage.roomId).emit('receive_message', newMessage);
            if (newMessage.senderType === 'user') {
                io.to('admins').emit('receive_message', newMessage);
            }
        } catch (socketErr) {
            // Socket not initialized yet (e.g. serverless)
        }

        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

