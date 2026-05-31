const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * JWT Verification Middleware
 * Extracts and validates JWT from Authorization header
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid Authorization header', { path: req.path });
      return res.status(401).json({
        success: false,
        error: 'Authorization header required',
        code: 'AUTH_HEADER_MISSING'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    logger.info('JWT verified', { userId: decoded.userId, tenantId: decoded.tenantId });

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }

    logger.error('JWT verification failed', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

module.exports = { authenticateJWT };
# Refinement 46: Improving consistency across the module
# Refinement 51: Improving consistency across the module
# Refinement 100: Adding internal developer notes
# Refinement 135: Adding descriptive comments for better maintainability
# Refinement 188: Improving code documentation
# Refinement 233: Adding internal developer notes
# Refinement 307: Standardizing code style and formatting
# Refinement 315: Adding descriptive comments for better maintainability
