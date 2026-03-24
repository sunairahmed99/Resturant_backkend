import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    restaurantInfo: {
        name: { type: String, default: 'RestAdmin Restaurant' },
        tagline: { type: String, default: 'Taste the Tradition' },
        phone: { type: String, default: '042-35711234' },
        email: { type: String, default: 'admin@restaurant.com' },
        address: { type: String, default: 'DHA Phase 5, Lahore, Pakistan' },
        currency: { type: String, default: 'PKR' },
        taxRate: { type: Number, default: 5 },
        timingBanner: { type: String, default: 'Gulshan Branch Open Timing From 4:00 PM to 12:30 AM - SMCHS Branch Open Timing From 4:00 PM to 01:00 AM.' },
        openingTime: { type: String, default: '4:00 PM' },
        closingTime: { type: String, default: '12:00 AM' },
        deliveryFee: { type: Number, default: 300 }
    },
    notifications: {
        newOrder: { type: Boolean, default: true },
        lowStock: { type: Boolean, default: true },
        dailyReport: { type: Boolean, default: false },
        smsAlerts: { type: Boolean, default: true }
    }
}, { timestamps: true });

export default mongoose.model('Settings', settingsSchema);
