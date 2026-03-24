import Area from '../Models/Area.js';

export const getAreas = async (req, res) => {
    try {
        const areas = await Area.find().sort({ name: 1 });
        res.status(200).json({ status: 'success', data: areas });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const createArea = async (req, res) => {
    try {
        const { name } = req.body;
        const area = await Area.create({ name });
        res.status(201).json({ status: 'success', data: area });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateArea = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const area = await Area.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
        res.status(200).json({ status: 'success', data: area });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const deleteArea = async (req, res) => {
    try {
        const { id } = req.params;
        await Area.findByIdAndDelete(id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
