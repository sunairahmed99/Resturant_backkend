import Message from '../Models/Message.js';

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
