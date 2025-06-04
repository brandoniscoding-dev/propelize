import * as  authService from '../services/auth.service';
import User from'../models/user.model';

/**
 * Controller to handle user registration.
 * Calls the registration service, returns user details without tokens.
 * 
 * @param {Object} req - Express request object containing user registration data.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing user details, or error message.
 */
const registerUser = async (req, res) => {
  try {
    const { user } = await authService.registerUser(req.body);
    return res.status(201).json({ user });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Controller to handle user login.
 * Validates credentials, returns accessToken, refreshToken, and user details in JSON.
 * 
 * @param {Object} req - Express request object containing user login credentials.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing accessToken, refreshToken, user details, or error message.
 */
const loginUser = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await authService.loginUser(req.body);
    return res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Controller to handle token refresh.
 * Validates the refresh token, returns new accessToken and user details in JSON.
 * 
 * @param {Object} req - Express request object containing the refresh token.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing accessToken, user details, or error message.
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const { accessToken, user } = await authService.refreshAccessToken(refreshToken);
    return res.status(200).json({ accessToken, user });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Controller to handle user logout.
 * Clears the refreshToken in the database.
 * 
 * @param {Object} req - Express request object containing authenticated user data.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON confirmation of logout or error message.
 */
const logoutUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user authenticated' });
    }
    const user = await User.findByPk(req.user.id);
    if (user) {
      await user.update({ refreshToken: null });
    }
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser };