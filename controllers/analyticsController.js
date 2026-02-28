const Portfolio = require('../models/Portfolio');
const { sendResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * @desc    Get portfolio analytics/statistics for user
 * @route   GET /api/portfolios/analytics
 * @access  Private
 */
const getPortfolioAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const portfolios = await Portfolio.find({ userId }).populate('assets');

    if (!portfolios || portfolios.length === 0) {
      return sendResponse(res, HTTP_STATUS.OK, 'No portfolios found', {
        totalPortfolios: 0,
        totalInvestment: 0,
        totalCurrentValue: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
        bestPerforming: null,
        worstPerforming: null,
      });
    }

    let totalInvestment = 0;
    let totalCurrentValue = 0;
    let bestPerforming = null;
    let worstPerforming = null;
    let maxReturn = -Infinity;
    let minReturn = Infinity;

    const portfolioStats = portfolios.map((portfolio) => {
      const portfolioValue = portfolio.calculatePortfolioValue();
      const profitLoss = portfolio.calculateProfitLoss();
      const profitLossPercentage = portfolio.calculateProfitLossPercentage();

      totalInvestment += portfolio.totalInvestment;
      totalCurrentValue += portfolioValue;

      // Track best and worst performing
      if (profitLossPercentage > maxReturn) {
        maxReturn = profitLossPercentage;
        bestPerforming = {
          id: portfolio._id,
          name: portfolio.name,
          profitLossPercentage: profitLossPercentage.toFixed(2),
          profitLoss: profitLoss.toFixed(2),
        };
      }

      if (profitLossPercentage < minReturn) {
        minReturn = profitLossPercentage;
        worstPerforming = {
          id: portfolio._id,
          name: portfolio.name,
          profitLossPercentage: profitLossPercentage.toFixed(2),
          profitLoss: profitLoss.toFixed(2),
        };
      }

      return {
        id: portfolio._id,
        name: portfolio.name,
        investment: portfolio.totalInvestment,
        currentValue: portfolioValue,
        profitLoss,
        profitLossPercentage,
        assetCount: portfolio.assets.length,
      };
    });

    const totalProfitLoss = totalCurrentValue - totalInvestment;
    const totalProfitLossPercentage =
      totalInvestment > 0 ? (totalProfitLoss / totalInvestment) * 100 : 0;

    const analytics = {
      totalPortfolios: portfolios.length,
      totalInvestment: totalInvestment.toFixed(2),
      totalCurrentValue: totalCurrentValue.toFixed(2),
      totalProfitLoss: totalProfitLoss.toFixed(2),
      totalProfitLossPercentage: totalProfitLossPercentage.toFixed(2),
      bestPerforming,
      worstPerforming,
      portfolios: portfolioStats,
    };

    return sendResponse(
      res,
      HTTP_STATUS.OK,
      'Portfolio analytics retrieved successfully',
      analytics
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolioAnalytics,
};
