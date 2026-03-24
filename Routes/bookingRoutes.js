import express from 'express';
import { createBooking, getBookings, updateBookingStatus, deleteBooking } from '../Controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.put('/:id', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;
