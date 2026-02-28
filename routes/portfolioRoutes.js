const express = require('express');
const {
  createPortfolio,
  getUserPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  addAssetToPortfolio,
  removeAssetFromPortfolio,
  updateAsset,
} = require('../controllers/portfolioController');
const { getPortfolioAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validatePortfolioCreate,
  validatePortfolioUpdate,
  validateAssetAdd,
  validatePaginationParams,
  validatePortfolioId,
  validateAssetId,
  handleValidationErrors,
} = require('../middleware/validation');

const router = express.Router();

// All portfolio routes require authentication
router.use(authMiddleware);

// Analytics route (must be before /:portfolioId to avoid conflict)
router.get('/analytics', getPortfolioAnalytics);

// Portfolio routes
router.post('/', validatePortfolioCreate, handleValidationErrors, createPortfolio);
router.get('/', validatePaginationParams, handleValidationErrors, getUserPortfolios);
router.get('/:portfolioId', validatePortfolioId, handleValidationErrors, getPortfolioById);
router.put('/:portfolioId', validatePortfolioId, validatePortfolioUpdate, handleValidationErrors, updatePortfolio);
router.delete('/:portfolioId', validatePortfolioId, handleValidationErrors, deletePortfolio);

// Asset routes
router.post('/:portfolioId/assets', validatePortfolioId, validateAssetAdd, handleValidationErrors, addAssetToPortfolio);
router.delete('/:portfolioId/assets/:assetId', validatePortfolioId, validateAssetId, handleValidationErrors, removeAssetFromPortfolio);
router.put('/:portfolioId/assets/:assetId', validatePortfolioId, validateAssetId, handleValidationErrors, updateAsset);

module.exports = router;
