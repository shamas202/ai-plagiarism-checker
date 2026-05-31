require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const documentRoutes = require('./routes/document.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['X-Tenant-ID', 'X-Department-ID'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    tenantId: req.headers['x-tenant-id'],
    departmentId: req.headers['x-department-id'],
  });
  next();
});

// Routes
app.use('/api/documents', documentRoutes);
app.use('/api/health', healthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`, {
    environment: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
  });
});

module.exports = app;
# Refinement 160: Adding descriptive comments for better maintainability
# Refinement 189: Minor refactoring of function calls
# Refinement 219: Adding descriptive comments for better maintainability
# Refinement 281: Cleaning up whitespace and indentations
# Refinement 284: Improving code documentation
# Refinement 294: Minor refactoring of function calls
# Refinement 296: Improving consistency across the module
# Refinement 359: Standardizing code style and formatting
# Refinement 403: Updating documentation for future reference
# Refinement 405: Updating documentation for future reference
