import* as userService from  '../services/user.service';
 
/**
 * Get the profile of the currently authenticated user.
 * Calls the user service to fetch the user by ID.
 *
 * @param {Object} req - Express request object containing authenticated user ID in req.user.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing user details (id, username, email, role) or error message.
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getCurrentUser(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    console.error('getCurrentUser error:', error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Update the authenticated user's profile.
 * Calls the user service to update the user by ID.
 *
 * @param {Object} req - Express request object containing update data in req.body.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing updated user details (id, username, email, role) or error message.
 */
const updateCurrentUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateCurrentUser(req.user.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('updateCurrentUser error:', error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Delete the authenticated user's account.
 * Calls the user service to delete the user by ID.
 *
 * @param {Object} req - Express request object containing authenticated user ID in req.user.
 * @param {Object} res - Express response object.
 * @returns {Response} Empty response with status 204 or error message.
 */
const deleteCurrentUser = async (req, res) => {
  try {
    await userService.deleteCurrentUser(req.user.id);
    res.status(204).send();
  } catch (error) {
    console.error('deleteCurrentUser error:', error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Get a list of all users.
 * Calls the user service to fetch all users (admin only).
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing list of user details (id, username, email, role) or error message.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('getAllUsers error:', error.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

/**
 * Get a user by ID (admin only).
 * Calls the user service to fetch the user by ID.
 *
 * @param {Object} req - Express request object containing user ID in req.params.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing user details (id, username, email, role) or error message.
 */
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    console.error('getUserById error:', error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Update a user by ID (admin only).
 * Calls the user service to update the user by ID.
 *
 * @param {Object} req - Express request object containing user ID in req.params and update data in req.body.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing updated user details (id, username, email, role) or error message.
 */
const updateUserById = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('updateUserById error:', error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Delete a user by ID (admin only).
 * Calls the user service to delete the user by ID.
 *
 * @param {Object} req - Express request object containing user ID in req.params.
 * @param {Object} res - Express response object.
 * @returns {Response} Empty response with status 204 or error message.
 */
const deleteUserById = async (req, res) => {
  try {
    await userService.deleteUserById(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('deleteUserById error:', error.message);
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
  deleteUserById,
};