import Order from '../Models/Order.js';
import Customer from '../Models/Customer.js';

export const getAnalyticsStats = async (req, res) => {
    try {
        const now = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // 1. Weekly Data (Daily breakdown for last 7 days)
        const weeklyAggregation = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$grandTotal' },
                    orders: { $sum: 1 },
                    customers: { $addToSet: '$customer' }
                }
            },
            { $project: { _id: 1, revenue: 1, orders: 1, customersCount: { $size: '$customers' } } },
            { $sort: { _id: 1 } }
        ]);

        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dayData = weeklyAggregation.find(w => w._id === dateStr);
            weeklyData.push({
                day: dayName,
                revenue: dayData ? dayData.revenue : 0,
                orders: dayData ? dayData.orders : 0,
                customers: dayData ? dayData.customersCount : 0,
                date: dateStr
            });
        }

        // 2. Monthly Data (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyAggregation = await Order.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$grandTotal' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const monthlyData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthStr = d.toISOString().split('-').slice(0, 2).join('-');
            const monthName = d.toLocaleDateString('en-US', { month: 'short' });
            const monthDataMatch = monthlyAggregation.find(m => m._id === monthStr);
            monthlyData.push({
                month: monthName,
                revenue: monthDataMatch ? monthDataMatch.revenue : 0
            });
        }

        // 3. KPI Summary (All time)
        const allTimeStats = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: '$grandTotal' },
                    orders: { $sum: 1 },
                    uniqueCustomers: { $addToSet: '$customer' }
                }
            }
        ]);

        const currentRevenue = allTimeStats[0]?.revenue || 0;
        const currentOrders = allTimeStats[0]?.orders || 0;

        // Total Customers
        const totalCustomersCount = await Customer.countDocuments({});

        res.status(200).json({
            success: true,
            stats: {
                weeklyData,
                monthlyData,
                kpis: [
                    { label: 'Total Revenue', value: `Rs ${currentRevenue.toLocaleString()}`, sub: 'All time', trendUp: true, color: '#E6B15B', icon: '💰' },
                    { label: 'Total Orders', value: currentOrders.toString(), sub: 'All time', trendUp: true, color: '#C02221', icon: '📋' },
                    { label: 'Avg. Order Value', value: `Rs ${currentOrders > 0 ? Math.round(currentRevenue / currentOrders).toLocaleString() : 0}`, sub: 'All time', trendUp: true, color: '#10b981', icon: '📊' },
                    { label: 'Total Customers', value: totalCustomersCount.toString(), sub: 'All time', trendUp: true, color: '#3b82f6', icon: '👥' },
                ]
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics stats',
            error: error.message
        });
    }
};
