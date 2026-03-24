import Order from '../Models/Order.js';
import Customer from '../Models/Customer.js';
import { sendOrderStatusEmail } from '../utils/sendEmail.js';

export const updateOrderBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { branch } = req.body;
        const order = await Order.findByIdAndUpdate(id, { branch }, { new: true }).populate('customer');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.status(200).json({ success: true, message: 'Branch assigned', order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to assign branch', error: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { name, email, phone, address, items, totalAmount, deliveryFee, grandTotal, instructions, branch } = req.body;

        // 1. Find or Create Customer
        let customer = await Customer.findOne({ phone });
        if (!customer) {
            customer = await Customer.create({ name, email, phone, address });
        } else {
            // Update address if it's different
            customer.address = address;
            customer.name = name;
            customer.email = email;
            await customer.save();
        }

        // 2. Generate Unique Order Number (ORD-YYYYMMDD-XXXX)
        const date = new Date();
        const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
        const count = await Order.countDocuments();
        const orderNumber = `ORD-${dateString}-${(count + 1).toString().padStart(4, '0')}`;

        // 3. Create Order
        const orderItems = items.map(item => ({
            menuItem: item.id || item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
            instructions: item.instructions || ''
        }));

        const order = await Order.create({
            orderNumber,
            customer: customer._id,
            items: orderItems,
            totalAmount,
            deliveryFee,
            grandTotal,
            instructions: instructions || '',
            branch
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error('Order Creation Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).populate('customer');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Send email notification based on status
        if (order.customer?.email) {
            await sendOrderStatusEmail(
                order.customer.email,
                order.orderNumber,
                status,
                order.grandTotal,
                order.customer.name
            );
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};

export const getOrdersByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        const customer = await Customer.findOne({ phone });
        
        if (!customer) {
            return res.status(200).json({
                success: true,
                orders: [],
                message: 'No orders found for this phone number'
            });
        }

        const orders = await Order.find({ customer: customer._id })
            .populate('customer')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};
