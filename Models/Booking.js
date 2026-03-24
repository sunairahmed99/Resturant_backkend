import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        enum: ['Birthday', 'Anniversary', 'Corporate', 'Wedding', 'Farewell', 'Nikah', 'Mehndi', 'Movie Night', 'Game Night', 'Other']
    },
    numberOfPeople: {
        type: Number,
        required: [true, 'Number of people is required'],
        min: 1
    },
    eventDate: {
        type: Date,
        required: [true, 'Event date is required']
    },
    timeSlot: {
        type: String,
        required: [true, 'Time slot is required'],
        enum: ['Afternoon (12 PM – 4 PM)', 'Evening (4 PM – 8 PM)', 'Night (8 PM – 12 AM)', 'Full Day']
    },
    additionalRequests: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
