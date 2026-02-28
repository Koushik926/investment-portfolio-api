const rateLimit = require('express-rate-limit');
const { HTTP_STATUS } = require('../utils/constants');

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs,
  max: 5,
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

module.exports = {
  apiLimiter,
  authLimiter,
};
