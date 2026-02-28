const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a portfolio name'],
      trim: true,
      maxlength: [100, 'Portfolio name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
      },
    ],
    totalInvestment: {
      type: Number,
      default: 0,
      min: [0, 'Total investment cannot be negative'],
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

portfolioSchema.index({ userId: 1 });
portfolioSchema.index({ userId: 1, createdAt: -1 });

portfolioSchema.methods.calculatePortfolioValue = function () {
  let totalValue = 0;
  if (this.assets && this.assets.length > 0) {
    this.assets.forEach((asset) => {
      totalValue += asset.quantity * (asset.currentPrice || asset.buyPrice);
    });
  }
  return totalValue;
};

portfolioSchema.methods.calculateProfitLoss = function () {
  let totalValue = 0;
  let totalInvestment = this.totalInvestment || 0;
  
  if (this.assets && this.assets.length > 0) {
    this.assets.forEach((asset) => {
      totalValue += asset.quantity * (asset.currentPrice || asset.buyPrice);
    });
  }
  
  return totalValue - totalInvestment;
};

portfolioSchema.methods.calculateProfitLossPercentage = function () {
  const totalInvestment = this.totalInvestment || 0;
  if (totalInvestment === 0) return 0;
  
  const profitLoss = this.calculateProfitLoss();
  return (profitLoss / totalInvestment) * 100;
};

module.exports = mongoose.model('Portfolio', portfolioSchema);
