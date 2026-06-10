const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            item: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Item' }
        }
    ],
    totalAmount: { type: Number, required: true },
    // Payment and Delivery Modes
    paymentOption: { type: String, required: true, enum: ['Cash on Delivery', 'Credit Card', 'UPI'] },
    deliveryMode: { type: String, required: true, enum: ['Home Delivery', 'Takeaway'] },
    // Added Cancelled status
    orderStatus: { 
        type: String, 
        required: true, 
        enum: ['Pending', 'Accepted', 'Rejected', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending' 
    },
    statusMessage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);