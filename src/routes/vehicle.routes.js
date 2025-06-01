const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const {
  validateCreateVehicles,
  validateUpdateVehicles
} = require('../middlewares/validate.middleware');


// Apply authentication middleware to all vehicle routes
router.use(authenticate);

/**
 * @route POST /vehicles/vehicle
 * @desc Create a new vehicle (for authenticated users)
 * @access Private
 */
router.post('/vehicle', validateCreateVehicles, vehicleController.createVehicle);

/**
 * @route PUT /vehicles/vehicle/:id
 * @desc Update a vehicle by ID
 * @access Private
 */
router.put('/vehicle/:id', validateUpdateVehicles, vehicleController.updateVehicle);

/**
 * @route DELETE /vehicles/vehicle/:id
 * @desc Delete a vehicle by ID
 * @access Private
 */
router.delete('/vehicle/:id', vehicleController.deleteVehicle);

/**
 * @route GET /vehicles/vehicle/:id
 * @desc Get a vehicle by its ID
 * @access Private
 */
router.get('/vehicle/:id', vehicleController.getVehicleById);

/**
 * @route GET /vehicles
 * @desc Get all vehicles for the current user
 * @access Private
 */
router.get('/vehicles', vehicleController.getAllVehicles);

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
