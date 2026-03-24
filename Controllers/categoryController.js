import Category from '../Models/Category.js';
import { cloudinary } from '../Middleware/multer.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ status: 'success', data: categories });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description, order } = req.body;
        let imageData = {};

        if (req.file) {
            imageData = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const category = await Category.create({ name, description, image: imageData, order: order || 0 });
        res.status(201).json({ status: 'success', data: category });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, order } = req.body;
        let updateData = { name, description };
        if (order !== undefined) updateData.order = Number(order);

        if (req.file) {
            // New image uploaded — delete old one from cloudinary if exists
            const existingCat = await Category.findById(id);
            if (existingCat?.image?.public_id) {
                await cloudinary.uploader.destroy(existingCat.image.public_id);
            }
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }
        // If no new file uploaded, we do NOT touch the image field — it stays as-is in the DB

        const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ status: 'success', data: category });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (category?.image?.public_id) {
            await cloudinary.uploader.destroy(category.image.public_id);
        }

        await Category.findByIdAndDelete(id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
