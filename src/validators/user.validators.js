const Joi = require('joi');

/**
 * Validation schema for user update
 */
const updateValidationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.base': '"username" must be a string.',
      'string.empty': '"username" cannot be empty.',
      'string.min': '"username" must be at least {#limit} characters.',
      'string.max': '"username" must be at most {#limit} characters.'
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({
      'string.base': '"email" must be a string.',
      'string.empty': '"email" cannot be empty.',
      'string.email': '"email" must be a valid email address.'
    }),

  password: Joi.string()
    .min(8)
    .optional()
    .messages({
      'string.base': '"password" must be a string.',
      'string.empty': '"password" cannot be empty.',
      'string.min': '"password" must be at least {#limit} characters.'
    }),

  role: Joi.string()
    .valid('admin', 'user')
    .optional()
    .messages({
      'any.only': '"role" must be one of [admin, user].'
    })
});


module.exports = {
  updateValidationSchema
};
