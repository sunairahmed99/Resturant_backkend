import Customer from '../Models/Customer.js';
import Order from '../Models/Order.js';

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: '_id',
                    foreignField: 'customer',
                    as: 'orders'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    phone: 1,
                    address: 1,
                    createdAt: 1,
                    totalOrders: { $size: '$orders' },
                    totalSpent: { $sum: '$orders.grandTotal' },
                    lastOrder: { $max: '$orders.createdAt' }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error.message
        });
    }
};
