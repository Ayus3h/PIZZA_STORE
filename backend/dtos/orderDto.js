const toOrderResponseDto = (order) => ({
  _id: order._id,
  user: order.user,
  orderItems: order.orderItems,
  totalAmount: order.totalAmount,
  paymentOption: order.paymentOption,
  deliveryMode: order.deliveryMode,
  orderStatus: order.orderStatus,
  statusMessage: order.statusMessage,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

const toOrderSummaryDto = (order) => ({
  _id: order._id,
  orderItems: order.orderItems,
  orderStatus: order.orderStatus,
  statusMessage: order.statusMessage,
  totalAmount: order.totalAmount,
  paymentOption: order.paymentOption,
  deliveryMode: order.deliveryMode,
  createdAt: order.createdAt,
});

module.exports = { toOrderResponseDto, toOrderSummaryDto };
