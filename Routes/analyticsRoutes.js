import express from 'express';
import { getAnalyticsStats } from '../Controllers/analyticsController.js';

const router = express.Router();

router.get('/stats', getAnalyticsStats);

export default router;
