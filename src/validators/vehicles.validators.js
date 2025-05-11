const Joi = require('joi');

/**
 * Validation schema for vehicle creation
 */
const createVehicleSchema = Joi.object({
  brand: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': '"brand" must be a string.',
      'string.empty': '"brand" cannot be empty.',
      'string.min': '"brand" must be at least {#limit} characters.',
      'string.max': '"brand" must be at most {#limit} characters.',
      'any.required': '"brand" is required.'
    }),

  model: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.base': '"model" must be a string.',
      'string.empty': '"model" cannot be empty.',
      'string.min': '"model" must be at least {#limit} characters.',
      'string.max': '"model" must be at most {#limit} characters.',
      'any.required': '"model" is required.'
    }),

  vin: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.base': '"vin" must be a string.',
      'string.empty': '"vin" cannot be empty.',
      'string.alphanum': '"vin" must be alphanumeric.',
      'string.min': '"vin" must be at least {#limit} characters.',
      'string.max': '"vin" must be at most {#limit} characters.',
      'any.required': '"vin" is required.'
    }),

  rentalPrice: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': '"rentalPrice" must be a number.',
      'number.positive': '"rentalPrice" must be greater than zero.',
      'any.required': '"rentalPrice" is required.'
    })
});

/**
 * Validation schema for vehicle update
 */
const updateVehicleSchema = Joi.object({
  brand: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.base': '"brand" must be a string.',
      'string.empty': '"brand" cannot be empty.',
      'string.min': '"brand" must be at least {#limit} characters.',
      'string.max': '"brand" must be at most {#limit} characters.'
    }),

  model: Joi.string()
    .min(1)
    .max(50)
    .optional()
    .messages({
      'string.base': '"model" must be a string.',
      'string.empty': '"model" cannot be empty.',
      'string.min': '"model" must be at least {#limit} characters.',
      'string.max': '"model" must be at most {#limit} characters.'
    }),

  vin: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .optional()
    .messages({
      'string.base': '"vin" must be a string.',
      'string.empty': '"vin" cannot be empty.',
      'string.alphanum': '"vin" must be alphanumeric.',
      'string.min': '"vin" must be at least {#limit} characters.',
      'string.max': '"vin" must be at most {#limit} characters.'
    }),

  rentalPrice: Joi.number()
    .positive()
    .optional()
    .messages({
      'number.base': '"rentalPrice" must be a number.',
      'number.positive': '"rentalPrice" must be greater than zero.'
    })
});

module.exports = {
  createVehicleSchema,
  updateVehicleSchema
};
