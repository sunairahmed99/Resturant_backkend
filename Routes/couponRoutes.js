import express from 'express';
const router = express.Router();
import * as couponController from '../Controllers/couponController.js';

// Admin Routes
router.post('/create', couponController.createCoupon);
router.get('/', couponController.getAllCoupons);
router.delete('/:id', couponController.deleteCoupon);

// Public Routes
router.post('/validate', couponController.validateCoupon);

export default router;
