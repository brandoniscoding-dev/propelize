const userService = require('../services/user.service');

/**
 * Get the profile of the currently authenticated user.
 */
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await userService.getCurrentUser(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    console.error('getCurrentUser error:', error.message);
    return res.status(error.status || 500).json({ message: 'Failed to retrieve user profile' });
  }
};

/**
 * Update the authenticated user's profile.
 */
const updateCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const updatedUser = await userService.updateCurrentUser(req.user.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('updateCurrentUser error:', error.message);
    return res.status(error.status || 500).json({ message: 'Failed to update user profile' });
  }
};

/**
 * Delete the authenticated user's account.
 */
const deleteCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    await userService.deleteCurrentUser(req.user.id);
    return res.status(204).send();
  } catch (error) {
    console.error('deleteCurrentUser error:', error.message);
    return res.status(error.status || 500).json({ message: 'Failed to delete user account' });
  }
};

/**
 * Get a list of all users (admin only).
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('getAllUsers error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Get a user by ID (admin only).
 */
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    console.error('getUserById error:', error.message);
    return res.status(error.status || 500).json({ message: 'Failed to fetch user' });
  }
};

/**
 * Update a user by ID (admin only).
 */
const updateUserById = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('updateUserById error:', error.message);
    return res.status(error.status || 500).json({ message: 'Failed to update user' });
  }
};

/**
 * Delete a user by ID (admin only).
 */
const deleteUserById = async (req, res) => {
  try {
    await userService.deleteUserById(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('deleteUserById error:', error.message);
    return res.status(error.status || 500).json({ message: 'Failed to delete user' });
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
