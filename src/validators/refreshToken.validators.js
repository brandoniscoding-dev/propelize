const Joi = require('joi');


/**
 * Validation schema for refresh token
 */
const refreshTokenValidationSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
      'string.empty': 'Refresh token is required',
    }),
  });

module.exports = {
  refreshTokenValidationSchema
}