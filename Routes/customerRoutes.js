import express from 'express';
import { getAllCustomers } from '../Controllers/customerController.js';

const router = express.Router();

router.get('/', getAllCustomers);

export default router;
