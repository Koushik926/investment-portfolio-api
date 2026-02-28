const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const validatePortfolioCreate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Portfolio name is required')
    .isLength({ min: 2 })
    .withMessage('Portfolio name must be at least 2 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

const validatePortfolioUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Portfolio name must be at least 2 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

const validateAssetAdd = [
  body('symbol')
    .trim()
    .toUpperCase()
    .notEmpty()
    .withMessage('Stock symbol is required')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Stock symbol must be uppercase alphanumeric'),
  body('quantity')
    .isFloat({ min: 0.001 })
    .withMessage('Quantity must be greater than 0'),
  body('buyPrice')
    .isFloat({ min: 0 })
    .withMessage('Buy price must be a positive number'),
  body('currentPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current price must be a positive number'),
];

const validatePaginationParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

const validatePortfolioId = [
  param('portfolioId')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid portfolio ID'),
];

const validateAssetId = [
  param('assetId')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid asset ID'),
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validatePortfolioCreate,
  validatePortfolioUpdate,
  validateAssetAdd,
  validatePaginationParams,
  validatePortfolioId,
  validateAssetId,
};
