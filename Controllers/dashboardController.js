import Order from '../Models/Order.js';
import Customer from '../Models/Customer.js';
import MenuItem from '../Models/MenuItem.js';

export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. KPI Stats
        const [todayOrders, todayRevenueArr, totalCustomers, totalMenuItems] = await Promise.all([
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.aggregate([
                { $match: { createdAt: { $gte: today }, status: { $ne: 'Cancelled' } } },
                { $group: { _id: null, total: { $sum: '$grandTotal' } } }
            ]),
            Customer.countDocuments(),
            MenuItem.countDocuments()
        ]);

        const todayRevenue = todayRevenueArr.length > 0 ? todayRevenueArr[0].total : 0;

        // 2. Revenue Overview (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const revenueOverview = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$grandTotal' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill missing days with zero
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dayData = revenueOverview.find(r => r._id === dateStr);
            last7Days.push({
                day: dayName,
                revenue: dayData ? dayData.revenue : 0,
                orders: dayData ? dayData.orders : 0,
                date: dateStr
            });
        }

        // 3. Order Status Today
        const statusBreakdownArr = await Order.aggregate([
            { $match: { createdAt: { $gte: today } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const totalToday = statusBreakdownArr.reduce((acc, curr) => acc + curr.count, 0);
        const statusColors = {
            'Delivered': '#10b981',
            'Preparing': '#f59e0b',
            'Pending': '#3b82f6',
            'Cancelled': '#ef4444',
            'Confirmed': '#8b5cf6',
            'Out for Delivery': '#6b7280'
        };

        const orderStatusData = statusBreakdownArr.map(s => ({
            name: s._id,
            value: totalToday > 0 ? Math.round((s.count / totalToday) * 100) : 0,
            color: statusColors[s._id] || '#cbd5e1'
        }));

        // 4. Recent Orders
        const recentOrders = await Order.find()
            .populate('customer')
            .sort({ createdAt: -1 })
            .limit(5);

        // 5. Top Items (Last 7 Days)
        const topItems = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    orders: { $sum: '$items.quantity' }
                }
            },
            { $sort: { orders: -1 } },
            { $limit: 5 }
        ]);

        const maxOrders = topItems.length > 0 ? topItems[0].orders : 1;
        const formattedTopItems = topItems.map(item => ({
            name: item._id,
            orders: item.orders,
            percent: Math.round((item.orders / maxOrders) * 100)
        }));

        res.status(200).json({
            success: true,
            stats: {
                todayOrders,
                todayRevenue,
                totalCustomers,
                totalMenuItems,
                revenueData: last7Days,
                orderStatusData,
                recentOrders,
                topItems: formattedTopItems
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats',
            error: error.message
        });
    }
};
