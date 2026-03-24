import express from 'express';
import { createOrder, getAllOrders, updateOrderStatus, updateOrderBranch, getOrdersByPhone } from '../Controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/by-phone/:phone', getOrdersByPhone);
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/branch', updateOrderBranch);

export default router;
