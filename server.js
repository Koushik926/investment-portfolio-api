require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const { HTTP_STATUS } = require('./utils/constants');

const app = express();

// Connect to MongoDB
connectDB();

// Trust proxy - for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent MongoDB injection

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Request logging
app.use(requestLogger(process.env.NODE_ENV));

// Rate limiting for all API routes
app.use('/api/', apiLimiter);

// Root route
app.get('/', (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Welcome to Investment Portfolio Management API',
    endpoints: {
      health: '/health',
      apiInfo: '/api',
      auth: '/api/auth',
      portfolios: '/api/portfolios',
    },
  });
});

// Health check route (no rate limit)
app.get('/health', (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API info route
app.get('/api', (req, res) => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Investment Portfolio Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      portfolios: '/api/portfolios',
    },
  });
});

// Routes with specific rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/portfolios', portfolioRoutes);

// 404 handler
app.use((req, res) => {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║   Investment Portfolio API Server                     ║
║   Status: Running                                     ║
║   Port: ${PORT}                                       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║   URL: http://localhost:${PORT}                       ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
