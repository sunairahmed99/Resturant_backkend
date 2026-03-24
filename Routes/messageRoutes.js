import express from 'express';
import { getMessageHistory, getActiveRooms } from '../Controllers/messageController.js';

const router = express.Router();

router.get('/rooms/active', getActiveRooms);
router.get('/:roomId', getMessageHistory);

export default router;
