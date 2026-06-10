const express = require('express');
const { placeOrder, getMyOrders, cancelOrder, getAllOrders, updateOrderStatus, getMonthlyRevenue } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer Routes
router.post('/', protect, placeOrder);
router.get('/myorders', protect, getMyOrders);
router.put('/:id/cancel', protect, cancelOrder);

// Admin Routes
router.get('/all', protect, admin, getAllOrders);
router.get('/revenue', protect, admin, getMonthlyRevenue);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;