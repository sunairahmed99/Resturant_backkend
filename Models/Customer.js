import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide your phone number'],
        },
        address: {
            type: String,
            required: [true, 'Please provide your delivery address'],
        },
    },
    { timestamps: true }
);

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
