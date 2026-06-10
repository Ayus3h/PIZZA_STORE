const SUPPORTED_PAYMENT_MODES = ['Cash on Delivery', 'Credit Card', 'UPI'];

const isValidPaymentMode = (mode) => SUPPORTED_PAYMENT_MODES.includes(mode);

const getSupportedPaymentModes = () => [...SUPPORTED_PAYMENT_MODES];

module.exports = { isValidPaymentMode, getSupportedPaymentModes };
