// src/controllers/auth.controller.js
const authService = require('../services/auth.service');

/**
 * Controller to handle user registration.
 * Calls the registration service, then returns a JWT token upon success.
 * 
 * @param {Object} req - Express request object containing user registration data.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing JWT token or error message.
 */
const registerUser = async (req, res) => {
  try {
    const token = await authService.registerUser(req.body);
    return res.status(201).json({ token }); // 201 Created
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Controller to handle user login.
 * Validates credentials and returns a JWT token if valid.
 * 
 * @param {Object} req - Express request object containing user login credentials.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing JWT token or error message.
 */
const loginUser = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(error.status || 500).json({ message: error.message });
  }
};

/**
 * Controller to handle user logout.
 * Note: JWT-based auth is stateless, so logout is client-side.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON confirmation of logout.
 */
const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logout successful. Please delete your token client-side." });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
