import express from 'express';
import { getMessageHistory, getActiveRooms, sendMessage } from '../Controllers/messageController.js';

const router = express.Router();

router.get('/rooms/active', getActiveRooms);
router.get('/:roomId', getMessageHistory);
router.post('/', sendMessage);

export default router;

