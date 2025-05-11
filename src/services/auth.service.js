const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token.utils');
const User = require('../models/user.model');

/**
 * Register a new user.
 * - Checks for existing email.
 * - Hashes the password before saving.
 * - Creates the user in the database.
 * - Returns a signed JWT.
 *
 * @param {Object} userDetails - { username, email, password, role }
 * @returns {string} JWT token
 */
const registerUser = async ({ username, email, password, role }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw { status: 400, message: "Email already in use" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword, role });

  return generateToken(user);
};

/**
 * Authenticate an existing user.
 * - Verifies email and password match.
 * - Returns a signed JWT.
 *
 * @param {Object} credentials - { email, password }
 * @returns {string} JWT token
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw { status: 400, message: "Invalid credentials" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 400, message: "Invalid credentials" };
  }

  return generateToken(user);
};

module.exports = { registerUser, loginUser };
