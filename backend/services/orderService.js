const Order = require('../models/Order');
const { toOrderResponseDto, toOrderSummaryDto } = require('../dtos/orderDto');
const { getStatusMessage } = require('./messageService');
const { isValidPaymentMode } = require('./paymentService');

const createOrder = async ({ userId, orderItems, totalAmount, paymentOption, deliveryMode }) => {
  if (!orderItems || orderItems.length === 0) {
    const error = new Error('No items in order');
    error.statusCode = 400;
    throw error;
  }

  if (!isValidPaymentMode(paymentOption)) {
    const error = new Error('Unsupported payment mode');
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.create({
    user: userId,
    orderItems: orderItems.map((oi) => ({
      ...oi,
      addOnsExtraPrice: Number(oi.addOnsExtraPrice || 0),
      addOnIds: Array.isArray(oi.addOnIds) ? oi.addOnIds : [],
    })),
    totalAmount,
    paymentOption,
    deliveryMode,
    orderStatus: 'Pending',
  });


  return toOrderResponseDto(order);
};

const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return orders.map(toOrderSummaryDto);
};

const getAdminOrders = async () => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  return orders.map(toOrderResponseDto);
};

const cancelOrder = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  if (order.orderStatus !== 'Pending') {
    const error = new Error('Cannot cancel order that is already processing.');
    error.statusCode = 400;
    throw error;
  }

  order.orderStatus = 'Cancelled';
  order.statusMessage = getStatusMessage('Cancelled');
  await order.save();

  return toOrderResponseDto(order);
};

const updateOrderStatus = async (orderId, status, customMessage) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  order.orderStatus = status || order.orderStatus;
  order.statusMessage = getStatusMessage(order.orderStatus, customMessage);
  await order.save();

  return toOrderResponseDto(order);
};

module.exports = {
  createOrder,
  getUserOrders,
  getAdminOrders,
  cancelOrder,
  updateOrderStatus,
};
