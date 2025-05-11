const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  validateRegistration,
  validateLogin
} = require('../middlewares/validate.middleware');

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validateRegistration, authController.registerUser);

/**
 * @route POST /auth/login
 * @desc Authenticate user and return a JWT token
 * @access Public
 */
router.post('/login', validateLogin, authController.loginUser);

/**
 * @route POST /auth/logout
 * @desc LOgout user and return a JWT token
 * @access Public
 */
router.post('/logout', validateLogin, authController.logoutUser);

module.exports = router;
