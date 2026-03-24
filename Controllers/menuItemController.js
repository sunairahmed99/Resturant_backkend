import MenuItem from '../Models/MenuItem.js';
import { cloudinary } from '../Middleware/multer.js';

export const getMenuItems = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        const items = await MenuItem.find(query).populate('category').sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: items });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, badge, serves, time, discountPercentage } = req.body;
        let imageData = {};

        if (req.file) {
            imageData = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        let discountPrice = 0;
        if (discountPercentage && Number(discountPercentage) > 0) {
            discountPrice = price - (price * (Number(discountPercentage) / 100));
        }

        const item = await MenuItem.create({
            name,
            description,
            price,
            category,
            badge,
            serves,
            time,
            discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
            discountPrice,
            image: imageData
        });
        res.status(201).json({ status: 'success', data: item });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, badge, serves, time, discountPercentage } = req.body;
        let updateData = { name, description, price, category, badge, serves, time };

        let discountPrice = 0;
        if (discountPercentage && Number(discountPercentage) > 0) {
            discountPrice = price - (price * (Number(discountPercentage) / 100));
        }
        updateData.discountPercentage = discountPercentage ? Number(discountPercentage) : 0;
        updateData.discountPrice = discountPrice;

        if (req.file) {
            const item = await MenuItem.findById(id);
            if (item?.image?.public_id) {
                await cloudinary.uploader.destroy(item.image.public_id);
            }
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const item = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ status: 'success', data: item });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MenuItem.findById(id);

        if (item?.image?.public_id) {
            await cloudinary.uploader.destroy(item.image.public_id);
        }

        await MenuItem.findByIdAndDelete(id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
