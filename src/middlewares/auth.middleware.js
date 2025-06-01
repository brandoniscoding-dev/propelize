const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const ENV = require('../config/env.config');

/**
 * Middleware to authenticate requests by verifying the JWT token.
 * - Extracts the token from the Authorization header (Bearer <token>).
 * - Verifies the token and fetches the associated user from the database.
 * - Checks that the user's refreshToken is not null (indicating an active session).
 * - Attaches user information to the request object for downstream routes.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to call.
 * @returns {void} Calls next middleware or responds with an error.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'username', 'email', 'role', 'refreshToken'],
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.refreshToken) {
      return res.status(401).json({ message: 'Session expired, please log in again' });
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to authorize access based on user roles.
 * - Restricts access to routes based on the user’s role.
 * - Usage: authorize('admin'), authorize('user', 'moderator'), etc.
 *
 * @param {...string} roles - Roles that are authorized to access the route.
 * @returns {Function} Express middleware function that checks user roles.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};