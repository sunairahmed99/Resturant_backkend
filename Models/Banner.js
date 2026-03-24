import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    image: {
        url: {
            type: String,
            required: [true, 'Banner image URL is required']
        },
        public_id: {
            type: String,
            required: [true, 'Banner image public ID is required']
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
