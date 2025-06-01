const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  validateRegistration,
  validateLogin,
  validateRefreshToken,
} = require('../middlewares/validate.middleware'); 
const { authenticate } = require('../middlewares/auth.middleware'); 

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validateRegistration, authController.registerUser);

/**
 * @route POST /auth/login
 * @desc Authenticate user and return access and refresh tokens
 * @access Public
 */
router.post('/login', validateLogin, authController.loginUser);

/**
 * @route POST /auth/refresh
 * @desc Refresh an access token using a valid refresh token
 * @access Public
 */
router.post('/refresh', validateRefreshToken, authController.refreshToken);

/**
 * @route POST /auth/logout
 * @desc Log out user by invalidating refresh token
 * @access Private
 */
router.post('/logout', authenticate, authController.logoutUser);

module.exports = router;