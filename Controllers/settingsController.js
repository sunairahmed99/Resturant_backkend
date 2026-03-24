import Settings from '../Models/Settings.js';

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({}); // Creates with defaults
        }
        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { restaurantInfo, notifications } = req.body;
        let settings = await Settings.findOne();

        if (settings) {
            settings.restaurantInfo = { ...settings.restaurantInfo, ...restaurantInfo };
            settings.notifications = { ...settings.notifications, ...notifications };
            await settings.save();
        } else {
            settings = await Settings.create({ restaurantInfo, notifications });
        }

        res.status(200).json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
    }
};
