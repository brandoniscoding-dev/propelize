const jwt = require('jsonwebtoken');
const ENV = require('../config/env.config');

/**
 * Generate an access token for a user.
 * @param {Object} user - User object with id and role.
 * @returns {string} JWT access token.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: '15m' } // Durée courte pour l'accessToken
  );
};

/**
 * Generate a refresh token for a user.
 * @param {Object} user - User object with id.
 * @returns {string} JWT refresh token.
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    ENV.JWT_SECRET,
    { expiresIn: '7d' } // Durée longue pour le refreshToken
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