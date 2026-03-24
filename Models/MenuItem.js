import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    image: {
        url: String,
        public_id: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    badge: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    serves: {
        type: String,
        trim: true
    },
    time: {
        type: String,
        trim: true
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    discountPrice: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
