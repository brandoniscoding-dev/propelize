const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validateUpdateUser } = require('../middlewares/validate.middleware');

// Apply authentication middleware to all user routes
router.use(authenticate);

/**
 * @route GET /users/me
 * @desc Get the currently authenticated user's profile
 * @access Private (Authenticated users)
 */
router.get('/me', userController.getCurrentUser);

/**
 * @route PUT /users/me
 * @desc Update the currently authenticated user's profile
 * @access Private (Authenticated users)
 */
router.put('/me', validateUpdateUser, userController.updateCurrentUser);

/**
 * @route DELETE /users/me
 * @desc Delete the currently authenticated user's account
 * @access Private (Authenticated users)
 */
router.delete('/me', userController.deleteCurrentUser);

/**
 * @route GET /users/
 * @desc Get all users (admin only)
 * @access Private (Admin)
 */
router.get('/', authorize('admin'), userController.getAllUsers);

/**
 * @route GET /users/:id
 * @desc Get a user by ID (admin only)
 * @access Private (Admin)
 */
router.get('/:id', authorize('admin'), userController.getUserById);

/**
 * @route PUT /users/:id
 * @desc Update a user by ID (admin only)
 * @access Private (Admin)
 */
router.put('/:id', authorize('admin'), validateUpdateUser, userController.updateUserById);

/**
 * @route DELETE /users/:id
 * @desc Delete a user by ID (admin only)
 * @access Private (Admin)
 */
router.delete('/:id', authorize('admin'), userController.deleteUserById);

module.exports = router;
