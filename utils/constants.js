// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
const ERROR_MESSAGES = {
  SERVER_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists with this email',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_MISSING: 'Authentication token is required',
  TOKEN_INVALID: 'Invalid or expired token',
  PORTFOLIO_NOT_FOUND: 'Portfolio not found',
  ASSET_NOT_FOUND: 'Asset not found',
  VALIDATION_ERROR: 'Validation failed',
  ROUTE_NOT_FOUND: 'Route not found',
};

// Success Messages
const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  PORTFOLIO_CREATED: 'Portfolio created successfully',
  PORTFOLIO_UPDATED: 'Portfolio updated successfully',
  PORTFOLIO_DELETED: 'Portfolio deleted successfully',
  ASSET_ADDED: 'Asset added successfully',
  ASSET_UPDATED: 'Asset updated successfully',
  ASSET_REMOVED: 'Asset removed successfully',
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// JWT
const JWT_DEFAULTS = {
  EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
};

// Validation Rules
const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  QUANTITY_MIN: 0.001,
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  JWT_DEFAULTS,
  VALIDATION_RULES,
};
