const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'pizza',
        'veg pizza',
        'non-veg pizza',
        'sides',
        'beverages',
        'combo',
        'others',
        'new launches',
        'bestsellers',
      ],
    },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Addon', addonSchema);

