const { Op } = require('sequelize');
const vehicle = require('../models/vehicle.model');

/**
 * Create a new vehicle entry in the database.
 *
 * @param {Object} data - Vehicle details
 * @returns {Object} Created vehicle instance
 */
const createvehicle = async (data) => {
  return await vehicle.create(data);
};

/**
 * Update an existing vehicle by ID.
 *
 * @param {string} id - Vehicle ID
 * @param {Object} data - Updated fields
 * @returns {Array} Update result
 */
const updatevehicle = async (id, data) => {
  return await vehicle.update(data, { where: { id } });
};

/**
 * Delete a vehicle by ID.
 *
 * @param {string} id - Vehicle ID
 * @returns {number} Number of rows deleted
 */
const deletevehicle = async (id) => {
  return await vehicle.destroy({ where: { id } });
};

/**
 * Retrieve a vehicle by its ID.
 *
 * @param {string} id - Vehicle ID
 * @returns {Object|null} Vehicle instance or null
 */
const getvehicleById = async (id) => {
  return await vehicle.findByPk(id);
};

/**
 * Fetch all vehicles from the database.
 *
 * @returns {Array} List of all vehicles
 */
const getAllvehicles = async () => {
  return await vehicle.findAll();
};

/**
 * Search for a vehicle by its registration number.
 *
 * @param {string} vin - Registration plate
 * @returns {Object|null} Matching vehicle or null
 */
const searchVehicleByVin = async (vin) => {
  return await vehicle.findOne({ where: { vin } });
};

/**
 * Retrieve all vehicles with a rental price below or equal to the specified max price.
 *
 * @param {number} maxPrice - Maximum rental price
 * @returns {Array} List of vehicles matching the condition
 */
const getVehiclesByMaxPrice = async (maxPrice) => {
  return await vehicle.findAll({
    where: {
      rentalPrice: {
        [Op.lte]: maxPrice
      }
    }
  });
};

module.exports = {
  createvehicle,
  updatevehicle,
  deletevehicle,
  getvehicleById,
  getAllvehicles,
  searchVehicleByVin,
  getVehiclesByMaxPrice,
};
