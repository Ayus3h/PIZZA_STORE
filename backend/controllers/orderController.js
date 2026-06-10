const Order = require('../models/Order');
const orderService = require('../services/orderService');

const placeOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder({
            userId: req.user._id,
            ...req.body,
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getUserOrders(req.user._id);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(req.params.id);
        res.status(200).json({ message: 'Order has been cancelled successfully.', order });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// NEW: Get all orders for Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAdminOrders();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMonthlyRevenue = async (req, res) => {
    try {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end },
            orderStatus: { $ne: 'Cancelled' }
        });

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        res.status(200).json({
            month: now.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
            totalRevenue,
            orderCount: orders.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// NEW: Update order status for Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.body.message);
        res.status(200).json(order);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

module.exports = { placeOrder, getMyOrders, cancelOrder, getAllOrders, updateOrderStatus, getMonthlyRevenue };