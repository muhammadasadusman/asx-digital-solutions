const jwt = require('jsonwebtoken');
const { readCollection } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'asx_digital_ultra_secret_key_2026';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Please login.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = readCollection('users');
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User session expired or user not found.' });
    }

    // Attach user without password
    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
}

// Granular RBAC Permission checker
function requirePermission(permissionKey) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Super Admin has all privileges
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Check custom permissions assigned by Admin
    if (req.user.permissions && req.user.permissions[permissionKey] === true) {
      return next();
    }

    return res.status(403).json({
      message: `Access denied: You do not have the '${permissionKey}' permission. Contact the ASX Super Admin for authorization.`,
    });
  };
}

module.exports = {
  requireAuth,
  requirePermission,
  JWT_SECRET,
};
