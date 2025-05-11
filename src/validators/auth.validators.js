const Joi = require('joi');

/**
 * Validation schema for user registration
 * Ensures that username, email, password, and role are properly structured
 */
const registerValidationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Username must be a string.',
      'string.min': 'Username must be at least 3 characters long.',
      'string.max': 'Username must not exceed 30 characters.',
      'any.required': 'Username is required.'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.'
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Password must be a string.',
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.'
    }),

  role: Joi.string()
    .valid('admin', 'user')
    .default('user')
    .messages({
      'string.base': 'Role must be a string.',
      'any.only': 'Role must be either "admin" or "user".'
    })
});

/**
 * Validation schema for user login
 * Validates the presence and format of email and password
 */
const loginValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'any.required': 'Email is required.'
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.base': 'Password must be a string.',
      'any.required': 'Password is required.'
    })
});

module.exports = {
  registerValidationSchema,
  loginValidationSchema
};
