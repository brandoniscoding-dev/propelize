// src/controllers/user.controller.js
const userService = require('../services/user.service');

/**
 * Get the profile of the currently authenticated user.
 * @param {Object} req - Express request (contains authenticated user ID in req.user).
 * @param {Object} res - Express response.
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json(user); 
  } catch (error) {
    console.error("getCurrentUser error:", error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Update the authenticated user's profile.
 * @param {Object} req - Express request (includes update data in req.body).
 * @param {Object} res - Express response.
 */
const updateCurrentUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.user.id, req.body);
    res.status(200).json(updatedUser); 
  } catch (error) {
    console.error("updateCurrentUser error:", error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Delete the authenticated user's account.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 */
const deleteCurrentUser = async (req, res) => {
  try {
    await userService.deleteUserById(req.user.id);
    res.status(204).send(); 
  } catch (error) {
    console.error("deleteCurrentUser error:", error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Get a list of all users.
 * Only accessible by admin users.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users); 
  } catch (error) {
    console.error("getAllUsers error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * Get a user by ID (admin only).
 * @param {Object} req - Express request (includes user ID in req.params).
 * @param {Object} res - Express response.
 */
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user); 
  } catch (error) {
    console.error("getUserById error:", error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Update a user by ID (admin only).
 * @param {Object} req - Express request (includes user ID in req.params and update data in req.body).
 * @param {Object} res - Express response.
 */
const updateUserById = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateUserById error:", error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Delete a user by ID (admin only).
 * @param {Object} req - Express request (includes user ID in req.params).
 * @param {Object} res - Express response.
 */
const deleteUserById = async (req, res) => {
  try {
    await userService.deleteUserById(req.params.id);
    res.status(204).send(); 
  } catch (error) {
    console.error("deleteUserById error:", error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
