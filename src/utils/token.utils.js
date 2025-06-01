const jwt = require('jsonwebtoken');
const ENV = require('../config/env.config');

/**
 * Generate an access token for a user.
 * @param {Object} user - User object with id and role.
 * @returns {string} JWT access token.
 * @throws {Error} If user object is missing id or role.
 */
const generateAccessToken = (user) => {
  if (!user || !user.id || !user.role) {
    throw new Error('User object must contain id and role');
  }
  return jwt.sign(
    { id: user.id, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate a refresh token for a user.
 * @param {Object} user - User object with id.
 * @returns {string} JWT refresh token.
 * @throws {Error} If user object is missing id.
 */
const generateRefreshToken = (user) => {
  if (!user || !user.id) {
    throw new Error('User object must contain id');
  }
  return jwt.sign(
    { id: user.id },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Verify a refresh token.
 * @param {string} token - Refresh token to verify.
 * @returns {Object} Decoded token payload.
 * @throws {Error} If token is invalid or expired.
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET);
  } catch (error) {
    const err = new Error('Invalid or expired refresh token');
    err.status = 401;
    throw err;
  }
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };