const getStatusMessage = (status, customMessage) => {
  if (typeof customMessage === 'string' && customMessage.trim()) {
    return customMessage.trim();
  }

  switch (status) {
    case 'Accepted':
      return 'Your order has been accepted and is being prepared.';
    case 'Rejected':
      return 'Your order was rejected. Please contact support for details.';
    case 'Preparing':
      return 'Your order is being prepared.';
    case 'Out for Delivery':
      return 'Your order is on its way.';
    case 'Delivered':
      return 'Your order has been delivered.';
    case 'Cancelled':
      return 'Your order has been cancelled.';
    default:
      return 'Your order status has been updated.';
  }
};

module.exports = { getStatusMessage };
