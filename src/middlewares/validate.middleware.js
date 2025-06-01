const { updateValidationSchema } = require('../validators/user.validators');
const { createVehicleSchema, updateVehicleSchema } = require('../validators/vehicles.validators');
const { registerValidationSchema, loginValidationSchema } = require('../validators/auth.validators');
const { refreshTokenValidationSchema } = require ('../validators/refreshToken.validators')

/**
 * Middleware to validate the request body using the given Joi schema.
 * - If validation fails, responds with a 400 status and the error message.
 * - If validation passes, proceeds to the next middleware or route handler.
 * 
 * @param {Object} schema - Joi schema to validate the request body.
 * @returns {Function} Express middleware function.
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body); 
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next(); 
  };
};

// Exporting validation middleware for different request types
module.exports = {
  validateUpdateUser: validateRequest(updateValidationSchema),
  validateCreateVehicles: validateRequest(createVehicleSchema),
  validateUpdateVehicles: validateRequest(updateVehicleSchema),
  validateRegistration: validateRequest(registerValidationSchema),
  validateLogin: validateRequest(loginValidationSchema),
  validateRefreshToken: validateRequest(refreshTokenValidationSchema),
};
