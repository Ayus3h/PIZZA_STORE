const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        required: true,
        enum: ['pizza', 'veg pizza', 'non-veg pizza', 'sides', 'beverages', 'combo', 'others', 'new launches', 'bestsellers']
    },
    imageUrl: { type: String, required: true }, // Added field for images
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);