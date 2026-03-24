import Banner from '../Models/Banner.js';
import { cloudinary } from '../Middleware/multer.js';

// GET all banners
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: banners });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// CREATE banner
export const createBanner = async (req, res) => {
    try {
        const bannerData = { ...req.body };

        if (req.file) {
            bannerData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        } else {
            return res.status(400).json({ status: 'error', message: 'Banner image is required' });
        }

        const banner = await Banner.create(bannerData);
        res.status(201).json({ status: 'success', data: banner });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// UPDATE banner
export const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) return res.status(404).json({ status: 'error', message: 'Banner not found' });

        const updateData = { ...req.body };

        if (req.file) {
            // Delete old image if exists
            if (banner.image?.public_id) {
                await cloudinary.uploader.destroy(banner.image.public_id);
            }
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const updatedBanner = await Banner.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        res.status(200).json({ status: 'success', data: updatedBanner });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE banner
export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) return res.status(404).json({ status: 'error', message: 'Banner not found' });

        if (banner.image?.public_id) {
            await cloudinary.uploader.destroy(banner.image.public_id);
        }

        await Banner.findByIdAndDelete(id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
