const logger = require('../utils/logger');

/**
 * Tenant Isolation Middleware
 * Extracts department_id from JWT and enforces tenant boundaries
 */
const enforceTenantIsolation = async (req, res, next) => {
  try {
    if (!req.user) {
      logger.error('Tenant middleware called without authenticated user');
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const { tenantId, departmentId, roles } = req.user;

    if (!tenantId || !departmentId) {
      logger.error('Missing tenant/department claims', { userId: req.user.userId });
      return res.status(403).json({
        success: false,
        error: 'Invalid token: missing tenant or department context',
        code: 'TENANT_CONTEXT_MISSING'
      });
    }

    req.tenantContext = {
      tenantId: String(tenantId),
      departmentId: String(departmentId),
      roles: Array.isArray(roles) ? roles : []
    };

    res.setHeader('X-Tenant-ID', tenantId);
    res.setHeader('X-Department-ID', departmentId);

    logger.debug('Tenant context established', { tenantId, departmentId });

    next();
  } catch (error) {
    logger.error('Tenant isolation failed', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Tenant isolation failed',
      code: 'TENANT_ISOLATION_FAILED'
    });
  }
};

/**
 * Role-based access control middleware factory
 */
const requireRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      logger.warn('Unauthorized role access', { userId: req.user?.userId, userRoles });
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'ROLE_FORBIDDEN'
      });
    }

    next();
  };
};

module.exports = { enforceTenantIsolation, requireRoles };
# Refinement 1: Minor refactoring of function calls
# Refinement 17: Standardizing code style and formatting
# Refinement 22: Minor refactoring of function calls
