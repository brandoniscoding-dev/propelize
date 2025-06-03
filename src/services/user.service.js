import * as  User  from'../models/user.model';
import bcrypt  from 'bcryptjs';

/**
 * Fetch the currently authenticated user's profile.
 * Throws an error if the user does not exist.
 *
 * @param {string} id - User UUID
 * @returns {Object} User details (id, username, email, role)
 */
const getCurrentUser = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'username', 'email', 'role'],
  });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  return user;
};

/**
 * Update the currently authenticated user's profile.
 * If password is provided, it is hashed before update.
 *
 * @param {string} id - User UUID
 * @param {Object} data - Fields to update
 * @returns {Object} Updated user details (id, username, email, role)
 */
const updateCurrentUser = async (id, data) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'username', 'email', 'role'],
  });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await user.update(data);
  return user;
};

/**
 * Delete the currently authenticated user's account.
 * Throws if the user does not exist.
 *
 * @param {string} id - User UUID
 */
const deleteCurrentUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  await user.destroy();
};

/**
 * Fetch a user by ID.
 * Throws an error if the user does not exist.
 *
 * @param {string} id - User UUID
 * @returns {Object} User details (id, username, email, role)
 */
const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'username', 'email', 'role'],
  });
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
 * @returns {Object} Updated user details (id, username, email, role)
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
 * @returns {Array} List of user details (id, username, email, role)
 */
const getAllUsers = async () => {
  return await User.findAll({
    attributes: ['id', 'username', 'email', 'role'],
  });
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers,
};