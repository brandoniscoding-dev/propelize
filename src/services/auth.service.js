const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token.utils');
const User = require('../models/user.model');

/**
 * Register a new user.
 * - Checks for existing email.
 * - Hashes the password before saving.
 * - Creates the user in the database.
 *
 * @param {Object} userDetails - Object containing username, email, password, and role.
 * @returns {Object} Object containing user details (id, username, email, role).
 * @throws {Object} 400 - If email is already in use.
 */
const registerUser = async ({ username, email, password, role }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw { status: 400, message: 'Email already in use' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword, role: role || 'user' });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Authenticate an existing user.
 * - Verifies email and password match.
 * - Generates access and refresh tokens.
 * - Stores the refresh token in the database.
 *
 * @param {Object} credentials - Object containing email and password.
 * @returns {Object} Object containing accessToken, refreshToken, and user details (id, username, email, role).
 * @throws {Object} 400 - If credentials are invalid.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
    attributes: ['id', 'username', 'email', 'role', 'password'],
  });
  if (!user) {
    throw { status: 400, message: 'Invalid credentials' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 400, message: 'Invalid credentials' };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await user.update({ refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Refresh an access token using a refresh token.
 * - Validates the refresh token against the database.
 * - Generates a new access token if valid.
 *
 * @param {string} refreshToken - The refresh token to validate.
 * @returns {Object} Object containing new accessToken and user details (id, username, email, role).
 * @throws {Object} 401 - If the refresh token is invalid or does not match the database.
 */
const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findByPk(decoded.id, {
    attributes: ['id', 'username', 'email', 'role', 'refreshToken'],
  });

  if (!user || user.refreshToken !== refreshToken) {
    throw { status: 401, message: 'Invalid refresh token' };
  }

  const accessToken = generateAccessToken(user);

  return {
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = { registerUser, loginUser, refreshAccessToken };