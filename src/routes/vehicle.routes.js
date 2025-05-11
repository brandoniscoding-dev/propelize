const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  createVehicleSchema,
  updateVehicleSchema
} = require('../validators/vehicles.validators');

// Generic middleware to validate request bodies against Joi schemas
/**
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware for validating request body
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

// Apply authentication middleware to all vehicle routes
router.use(authenticate);

/**
 * @route POST /vehicles/vehicle
 * @desc Create a new vehicle (for authenticated users)
 * @access Private
 */
router.post('/vehicle', validateRequest(createVehicleSchema), vehicleController.createvehicle);

/**
 * @route PUT /vehicles/vehicle/:id
 * @desc Update a vehicle by ID
 * @access Private
 */
router.put('/vehicle/:id', validateRequest(updateVehicleSchema), vehicleController.updatevehicle);

/**
 * @route DELETE /vehicles/vehicle/:id
 * @desc Delete a vehicle by ID
 * @access Private
 */
router.delete('/vehicle/:id', vehicleController.deletevehicle);

/**
 * @route GET /vehicles/vehicle/:id
 * @desc Get a vehicle by its ID
 * @access Private
 */
router.get('/vehicle/:id', vehicleController.getvehicleById);

/**
 * @route GET /vehicles
 * @desc Get all vehicles for the current user
 * @access Private
 */
router.get('/vehicles', vehicleController.getAllvehicles);

/**
 * @route GET /vehicles/vehicle/search/:vin
 * @desc Search vehicle by VIN (Vehicle Identification Number)
 * @access Private
 */
router.get('/vehicle/search/:vin', vehicleController.searchVehicleByVin);

/**
 * @route GET /vehicles/price/:maxPrice
 * @desc Get vehicles with a price below or equal to the specified max
 * @access Private
 */
router.get('/vehicles/price/:maxPrice', vehicleController.getVehiclesByMaxPrice);

/**
 * @route GET /vehicles/admin/vehicles
 * @desc Get all vehicles (admin access only)
 * @access Private (Admin only)
 */
router.get('/admin/vehicles', authorize('admin'), vehicleController.getVehiclesByMaxPrice);

module.exports = router;
