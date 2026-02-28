const Portfolio = require('../models/Portfolio');
const Asset = require('../models/Asset');
const { sendResponse, sendPaginatedResponse } = require('../utils/responseHandler');

const createPortfolio = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    const portfolio = new Portfolio({
      userId,
      name,
      description,
    });

    await portfolio.save();

    const portfolioData = {
      id: portfolio._id,
      name: portfolio.name,
      description: portfolio.description,
      assets: portfolio.assets,
      totalInvestment: portfolio.totalInvestment,
      createdAt: portfolio.createdAt,
    };

    return sendResponse(res, 201, 'Portfolio created successfully', portfolioData);
  } catch (error) {
    next(error);
  }
};

const getUserPortfolios = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const total = await Portfolio.countDocuments({ userId });

    const portfolios = await Portfolio.find({ userId })
      .populate('assets')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const portfolioData = portfolios.map((portfolio) => ({
      id: portfolio._id,
      name: portfolio.name,
      description: portfolio.description,
      assets: portfolio.assets,
      totalInvestment: portfolio.totalInvestment,
      portfolioValue: portfolio.calculatePortfolioValue(),
      profitLoss: portfolio.calculateProfitLoss(),
      profitLossPercentage: portfolio.calculateProfitLossPercentage(),
      createdAt: portfolio.createdAt,
    }));

    return sendPaginatedResponse(
      res,
      200,
      'Portfolios retrieved successfully',
      portfolioData,
      page,
      limit,
      total
    );
  } catch (error) {
    next(error);
  }
};

const getPortfolioById = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user.userId;

    const portfolio = await Portfolio.findById(portfolioId).populate('assets');

    if (!portfolio) {
      return sendResponse(res, 404, 'Portfolio not found');
    }

    if (portfolio.userId.toString() !== userId.toString()) {
      return sendResponse(res, 403, 'Unauthorized to access this portfolio');
    }

    const portfolioData = {
      id: portfolio._id,
      name: portfolio.name,
      description: portfolio.description,
      assets: portfolio.assets,
      totalInvestment: portfolio.totalInvestment,
      portfolioValue: portfolio.calculatePortfolioValue(),
      profitLoss: portfolio.calculateProfitLoss(),
      profitLossPercentage: portfolio.calculateProfitLossPercentage(),
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    };

    return sendResponse(res, 200, 'Portfolio retrieved successfully', portfolioData);
  } catch (error) {
    next(error);
  }
};

const updatePortfolio = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user.userId;
    const { name, description } = req.body;

    let portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return sendResponse(res, 404, 'Portfolio not found');
    }

    if (portfolio.userId.toString() !== userId.toString()) {
      return sendResponse(res, 403, 'Unauthorized to update this portfolio');
    }

    if (name) portfolio.name = name;
    if (description) portfolio.description = description;

    await portfolio.save();

    await portfolio.populate('assets');

    const portfolioData = {
      id: portfolio._id,
      name: portfolio.name,
      description: portfolio.description,
      assets: portfolio.assets,
      totalInvestment: portfolio.totalInvestment,
      portfolioValue: portfolio.calculatePortfolioValue(),
      profitLoss: portfolio.calculateProfitLoss(),
      profitLossPercentage: portfolio.calculateProfitLossPercentage(),
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    };

    return sendResponse(res, 200, 'Portfolio updated successfully', portfolioData);
  } catch (error) {
    next(error);
  }
};

const deletePortfolio = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user.userId;

    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return sendResponse(res, 404, 'Portfolio not found');
    }

    if (portfolio.userId.toString() !== userId.toString()) {
      return sendResponse(res, 403, 'Unauthorized to delete this portfolio');
    }

    // Delete all assets associated with this portfolio
    await Asset.deleteMany({ _id: { $in: portfolio.assets } });

    await Portfolio.findByIdAndDelete(portfolioId);

    return sendResponse(res, 200, 'Portfolio deleted successfully');
  } catch (error) {
    next(error);
  }
};

const addAssetToPortfolio = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user.userId;
    const { symbol, quantity, buyPrice, currentPrice } = req.body;

    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return sendResponse(res, 404, 'Portfolio not found');
    }

    if (portfolio.userId.toString() !== userId.toString()) {
      return sendResponse(res, 403, 'Unauthorized to modify this portfolio');
    }

    const asset = new Asset({
      symbol,
      quantity,
      buyPrice,
      currentPrice: currentPrice || buyPrice,
    });

    await asset.save();

    portfolio.assets.push(asset._id);
    portfolio.totalInvestment += quantity * buyPrice;

    await portfolio.save();

    await portfolio.populate('assets');

    const portfolioData = {
      id: portfolio._id,
      name: portfolio.name,
      assets: portfolio.assets,
      totalInvestment: portfolio.totalInvestment,
      portfolioValue: portfolio.calculatePortfolioValue(),
      profitLoss: portfolio.calculateProfitLoss(),
      profitLossPercentage: portfolio.calculateProfitLossPercentage(),
    };

    return sendResponse(res, 201, 'Asset added to portfolio successfully', portfolioData);
  } catch (error) {
    next(error);
  }
};

const removeAssetFromPortfolio = async (req, res, next) => {
  try {
    const { portfolioId, assetId } = req.params;
    const userId = req.user.userId;

    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return sendResponse(res, 404, 'Portfolio not found');
    }

    if (portfolio.userId.toString() !== userId.toString()) {
      return sendResponse(res, 403, 'Unauthorized to modify this portfolio');
    }

    const asset = await Asset.findById(assetId);

    if (!asset) {
      return sendResponse(res, 404, 'Asset not found');
    }

    const belongsToPortfolio = portfolio.assets.some((id) => id.toString() === assetId);
    if (!belongsToPortfolio) {
      return sendResponse(res, 404, 'Asset not found in this portfolio');
    }

    // Remove asset from portfolio
    portfolio.assets = portfolio.assets.filter((id) => id.toString() !== assetId);
    portfolio.totalInvestment = Math.max(
      0,
      portfolio.totalInvestment - asset.quantity * asset.buyPrice
    );

    await portfolio.save();

    // Delete asset
    await Asset.findByIdAndDelete(assetId);

    await portfolio.populate('assets');

    const portfolioData = {
      id: portfolio._id,
      name: portfolio.name,
      assets: portfolio.assets,
      totalInvestment: portfolio.totalInvestment,
      portfolioValue: portfolio.calculatePortfolioValue(),
      profitLoss: portfolio.calculateProfitLoss(),
      profitLossPercentage: portfolio.calculateProfitLossPercentage(),
    };

    return sendResponse(res, 200, 'Asset removed from portfolio successfully', portfolioData);
  } catch (error) {
    next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const { portfolioId, assetId } = req.params;
    const userId = req.user.userId;
    const { currentPrice } = req.body;

    const portfolio = await Portfolio.findById(portfolioId);

    if (!portfolio) {
      return sendResponse(res, 404, 'Portfolio not found');
    }

    if (portfolio.userId.toString() !== userId.toString()) {
      return sendResponse(res, 403, 'Unauthorized to modify this portfolio');
    }

    const asset = await Asset.findById(assetId);

    if (!asset) {
      return sendResponse(res, 404, 'Asset not found');
    }

    const belongsToPortfolio = portfolio.assets.some((id) => id.toString() === assetId);
    if (!belongsToPortfolio) {
      return sendResponse(res, 404, 'Asset not found in this portfolio');
    }

    if (currentPrice !== undefined) {
      asset.currentPrice = currentPrice;
    }

    await asset.save();

    await portfolio.populate('assets');

    const portfolioData = {
      id: portfolio._id,
      name: portfolio.name,
      assets: portfolio.assets,
      totalInvestment: portfolio.totalInvestment,
      portfolioValue: portfolio.calculatePortfolioValue(),
      profitLoss: portfolio.calculateProfitLoss(),
      profitLossPercentage: portfolio.calculateProfitLossPercentage(),
    };

    return sendResponse(res, 200, 'Asset updated successfully', portfolioData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPortfolio,
  getUserPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  addAssetToPortfolio,
  removeAssetFromPortfolio,
  updateAsset,
};
