import * as  vehicleService from '../services/vehicle.service';

/**
 * Create a new vehicle.
 * Calls the vehicle service to create a vehicle with provided data.
 *
 * @param {Object} req - Express request object containing vehicle data in req.body.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing created vehicle details (id, vin, make, model, rentalPrice) or error message.
 */
const createVehicle = async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['make', 'model', 'vin', 'ownerId'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          error: `${field} is required` 
        });
      }
    }

    // Create vehicle
    const vehicle = await vehicleService.createVehicle(req.body);
    
    return res.status(201).json(vehicle);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};

/**
 * Update an existing vehicle by ID.
 * Calls the vehicle service to update the vehicle with provided data.
 *
 * @param {Object} req - Express request object containing vehicle ID in req.params and update data in req.body.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON confirmation or error message.
 */
const updateVehicle = async (req, res) => {
  try {
    const updatedVehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json(updatedVehicle);
    console.info('Vehicle updated successfully');
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
    console.error('Error updating vehicle: ' + err.message);
  }
};

/**
 * Delete a vehicle by ID.
 * Calls the vehicle service to delete the vehicle.
 *
 * @param {Object} req - Express request object containing vehicle ID in req.params.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON confirmation or error message.
 */
const deleteVehicle = async (req, res) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
    console.info('Vehicle deleted successfully');
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
    console.error('Error deleting vehicle: ' + err.message);
  }
};

/**
 * Retrieve a vehicle by its ID.
 * Calls the vehicle service to fetch the vehicle.
 *
 * @param {Object} req - Express request object containing vehicle ID in req.params.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing vehicle details (id, vin, make, model, rentalPrice) or error message.
 */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (vehicle) {
      res.status(200).json(vehicle);
      console.info('Vehicle fetched successfully by ID: ' + req.params.id);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
      console.warn('Vehicle not found with ID: ' + req.params.id);
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching vehicle' });
    console.error('Error fetching vehicle: ' + err.message);
  }
};

/**
 * Fetch all vehicles.
 * Calls the vehicle service to retrieve all vehicles.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing list of vehicle details (id, vin, make, model, rentalPrice) or error message.
 */
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
    console.info('All vehicles fetched successfully');
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching vehicles' });
    console.error('Error fetching vehicles: ' + err.message);
  }
};

/**
 * Search for a vehicle by its VIN.
 * Calls the vehicle service to find a vehicle by VIN.
 *
 * @param {Object} req - Express request object containing VIN in req.params.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing vehicle details (id, vin, make, model, rentalPrice) or error message.
 */
const searchVehicleByVin = async (req, res) => {
  try {
    const vin = req.params.vin;
    const vehicle = await vehicleService.searchVehicleByVin(vin);
    if (vehicle) {
      res.status(200).json(vehicle);
      console.info('Vehicle found by VIN: ' + vin);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
      console.warn('Vehicle not found with VIN: ' + vin);
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error while searching vehicle' });
    console.error('Error searching vehicle by VIN: ' + err.message);
  }
};

/**
 * Retrieve vehicles by maximum rental price.
 * Calls the vehicle service to fetch vehicles with rental price below or equal to maxPrice.
 *
 * @param {Object} req - Express request object containing maxPrice in req.params.
 * @param {Object} res - Express response object.
 * @returns {Response} JSON containing list of vehicle details (id, vin, make, model, rentalPrice) or error message.
 */
const getVehiclesByMaxPrice = async (req, res) => {
  try {
    const vehicles = await vehicleService.getVehiclesByMaxPrice(req.params.maxPrice);
    res.status(200).json(vehicles);
    console.info('Vehicles fetched by maximum price: $' + req.params.maxPrice);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching vehicles by maximum price' });
    console.error('Error fetching vehicles by maximum price: ' + err.message);
  }
};

module.exports = {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleById,
  getAllVehicles,
  searchVehicleByVin,
  getVehiclesByMaxPrice,
};