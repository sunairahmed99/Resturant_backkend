import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Area name is required'],
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

const Area = mongoose.model('Area', areaSchema);

export default Area;
