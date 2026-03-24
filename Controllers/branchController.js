import Branch from '../Models/Branch.js';
import cloudinary from 'cloudinary';

// GET all branches
export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find().sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: branches });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// CREATE branch
export const createBranch = async (req, res) => {
    try {
        const branchData = { ...req.body };

        if (req.file) {
            branchData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const branch = await Branch.create(branchData);
        res.status(201).json({ status: 'success', data: branch });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// UPDATE branch
export const updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findById(id);
        if (!branch) return res.status(404).json({ status: 'error', message: 'Branch not found' });

        const updateData = { ...req.body };

        if (req.file) {
            // Delete old image if exists
            if (branch.image?.public_id) {
                await cloudinary.v2.uploader.destroy(branch.image.public_id);
            }
            updateData.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        res.status(200).json({ status: 'success', data: updatedBranch });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// DELETE branch
export const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const branch = await Branch.findById(id);
        if (!branch) return res.status(404).json({ status: 'error', message: 'Branch not found' });

        if (branch.image?.public_id) {
            await cloudinary.v2.uploader.destroy(branch.image.public_id);
        }

        await Branch.findByIdAndDelete(id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
