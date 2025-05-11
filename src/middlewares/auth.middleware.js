const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET } = require('../config/env.config');

/**
 * Middleware to authenticate requests by verifying the JWT token.
 * - Extracts the token from the Authorization header.
 * - Verifies the token and fetches the associated user from the database.
 * - Attaches user information to the request object for downstream routes.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to call.
 * @returns {void} Calls next middleware or responds with an error.
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure token is present and valid
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from DB based on the decoded token ID
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user information to request for downstream routes
    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err);
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
    // Ensure user has the required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
