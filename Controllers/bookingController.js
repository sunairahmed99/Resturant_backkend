import Booking from '../Models/Booking.js';

export const createBooking = async (req, res) => {
    try {
        const { name, email, phone, eventType, numberOfPeople, eventDate, timeSlot, additionalRequests } = req.body;
        const booking = await Booking.create({ name, email, phone, eventType, numberOfPeople, eventDate, timeSlot, additionalRequests });
        res.status(201).json({ status: 'success', data: booking });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: bookings });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
        if (!booking) return res.status(404).json({ status: 'error', message: 'Booking not found' });
        res.status(200).json({ status: 'success', data: booking });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await Booking.findByIdAndDelete(id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
