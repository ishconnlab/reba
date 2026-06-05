const mongoose = require('mongoose');

const stockOutSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    quantityOut: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be greater than 0'],
    },
    totalQuantityOut: {
      type: Number,
      default: 0,
    },
    stockOutDate: {
      type: Date,
      required: [true, 'Stock out date is required'],
      default: Date.now,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockOut', stockOutSchema);
