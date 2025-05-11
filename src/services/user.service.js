const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * Fetch a user by ID.
 * Throws an error if the user does not exist.
 *
 * @param {string} id - User UUID
 * @returns {Object} User instance
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};

/**
 * Update user information by ID.
 * If password is provided, it is hashed before update.
 *
 * @param {string} id - User UUID
 * @param {Object} data - Fields to update
 * @returns {Object} Updated user instance
 */
const updateUserById = async (id, data) => {
  const user = await getUserById(id);

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await user.update(data);
  return user;
};

/**
 * Delete a user by ID.
 * Throws if the user does not exist.
 *
 * @param {string} id - User UUID
 */
const deleteUserById = async (id) => {
  const user = await getUserById(id);
  await user.destroy();
};

/**
 * Retrieve all users.
 * Typically restricted to admin users.
 *
 * @returns {Array} List of all users
 */
const getAllUsers = async () => {
  return await User.findAll();
};

module.exports = {
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers
};
