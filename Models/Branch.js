import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Branch name is required'],
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    manager: {
        type: String,
        trim: true
    },
    tables: {
        type: Number,
        default: 0
    },
    openTime: {
        type: String,
        default: '12:00 PM'
    },
    closeTime: {
        type: String,
        default: '1:00 AM'
    },
    image: {
        url: String,
        public_id: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Branch = mongoose.model('Branch', branchSchema);

export default Branch;
