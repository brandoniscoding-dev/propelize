import { Op } from 'sequelize';
import Vehicle from '../models/vehicle.model';

/**
 * Create a new vehicle entry in the database.
 *
 * @param {Object} data - Vehicle details (vin, make, model, rentalPrice, etc.).
 * @returns {Object} Created vehicle details (id, vin, make, model, rentalPrice).
 */
const createVehicle = async (data) => {
  const vehicle = await Vehicle.create(data);
  return vehicle;
};

/**
 * Update an existing vehicle by ID.
 *
 * @param {string} id - Vehicle ID.
 * @param {Object} data - Updated fields (vin, make, model, rentalPrice, etc.).
 * @returns {Object} Updated vehicle details (id, vin, make, model, rentalPrice).
 * @throws {Error} If the vehicle is not found.
 */
const updateVehicle = async (id, data) => {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.status = 404;
    throw error;
  }
  await vehicle.update(data);
  return vehicle;
};

/**
 * Delete a vehicle by ID.
 *
 * @param {string} id - Vehicle ID.
 * @throws {Error} If the vehicle is not found.
 */
const deleteVehicle = async (id) => {
  const vehicle = await Vehicle.findByPk(id);
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.status = 404;
    throw error;
  }
  await vehicle.destroy();
};

/**
 * Retrieve a vehicle by its ID.
 *
 * @param {string} id - Vehicle ID.
 * @returns {Object|null} Vehicle details (id, vin, make, model, rentalPrice) or null.
 */
const getVehicleById = async (id) => {
  return await Vehicle.findByPk(id, {
    attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
  });
};

/**
 * Fetch all vehicles from the database.
 *
 * @returns {Array} List of vehicle details (id, vin, make, model, rentalPrice).
 */
const getAllVehicles = async () => {
  return await Vehicle.findAll({
    attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
  });
};

/**
 * Search for a vehicle by its registration number.
 *
 * @param {string} vin - Vehicle VIN.
 * @returns {Object|null} Vehicle details (id, vin, make, model, rentalPrice) or null.
 */
const searchVehicleByVin = async (vin) => {
  return await Vehicle.findOne({
    where: { vin },
    attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
  });
};

/**
 * Retrieve all vehicles with a rental price below or equal to the specified max price.
 *
 * @param {number} maxPrice - Maximum rental price.
 * @returns {Array} List of vehicle details (id, vin, make, model, rentalPrice).
 */
const getVehiclesByMaxPrice = async (maxPrice) => {
  return await Vehicle.findAll({
    where: {
      rentalPrice: {
        [Op.lte]: maxPrice,
      },
    },
    attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
  });
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