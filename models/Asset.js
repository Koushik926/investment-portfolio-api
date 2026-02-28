const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Please provide a stock symbol'],
      trim: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0.001, 'Quantity must be greater than 0'],
    },
    buyPrice: {
      type: Number,
      required: [true, 'Please provide buy price'],
      min: [0, 'Buy price cannot be negative'],
    },
    currentPrice: {
      type: Number,
      default: 0,
      min: [0, 'Current price cannot be negative'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

assetSchema.index({ symbol: 1 });

module.exports = mongoose.model('Asset', assetSchema);
