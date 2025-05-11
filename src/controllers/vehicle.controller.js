const vehicleService = require('../services/vehicle.service');

const createvehicle = async (req, res) => {
    try {
        const vehicle = await vehicleService.createvehicle(req.body);
        res.status(201).json(vehicle);
        logger.info('Vehicle created successfully');
    } catch (err) {
        res.status(500).json({ error: 'Server error while creating vehicle' });
        logger.error('Error creating vehicle: ' + err.message);
    }
};

const updatevehicle = async (req, res) => {
    try {
        const updated = await vehicleService.updatevehicle(req.params.id, req.body);
        if (updated[0] > 0) { 
            res.status(200).json({ message: 'Vehicle updated successfully' }); 
            logger.info('Vehicle updated successfully');
        } else {
            res.status(404).json({ message: 'Vehicle not found' });  
            logger.warn('Vehicle not found with ID: ' + req.params.id);
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error while updating vehicle' });
        logger.error('Error updating vehicle: ' + err.message);
    }
};

const deletevehicle = async (req, res) => {
    try {
        const deleted = await vehicleService.deletevehicle(req.params.id);
        if (deleted) {
            res.status(200).json({ message: 'Vehicle deleted successfully' });  
            logger.info('Vehicle deleted successfully');
        } else {
            res.status(404).json({ message: 'Vehicle not found' }); 
            logger.warn('Vehicle not found with ID: ' + req.params.id);
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error while deleting vehicle' });
        logger.error('Error deleting vehicle: ' + err.message);
    }
};

const getvehicleById = async (req, res) => {
    try {
        const vehicle = await vehicleService.getvehicleById(req.params.id);
        if (vehicle) {
            res.status(200).json(vehicle);  
            logger.info('Vehicle fetched successfully by ID: ' + req.params.id);
        } else {
            res.status(404).json({ message: 'Vehicle not found' });  
            logger.warn('Vehicle not found with ID: ' + req.params.id);
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching vehicle' });
        logger.error('Error fetching vehicle: ' + err.message);
    }
};

const getAllvehicles = async (req, res) => {
    try {
        const vehicles = await vehicleService.getAllvehicles();
        res.status(200).json(vehicles);
        logger.info('All vehicles fetched successfully');
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching vehicles' });
        logger.error('Error fetching vehicles: ' + err.message);
    }
};

const searchVehicleByVin = async (req, res) => {
    try {
        const vin = req.params.vin;

        const vehicle = await vehicleService.searchVehicleByVin(vin);
        
        if (vehicle) {
            res.status(200).json(vehicle);  
            logger.info('Vehicle found by registration number: ' + vin);
        } else {
            res.status(404).json({ message: 'Vehicle not found' }); 
            logger.warn('Vehicle not found with registration number: ' + vin);
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error while searching vehicle' });
        logger.error('Error searching vehicle by registration number: ' + err.message);
    }
};

const getVehiclesByMaxPrice = async (req, res) => {
    try {
        const vehicles = await vehicleService.getVehiclesByMaxPrice(req.params.maxPrice);
        res.status(200).json(vehicles);
        logger.info('Vehicles fetched by maximum price: $' + req.params.maxPrice);
    } catch (err) {
        res.status(500).json({ error: 'Server error while fetching vehicles by maximum price' });
        logger.error('Error fetching vehicles by maximum price: $' + req.params.maxPrice);
    }
}

module.exports = {
    createvehicle,
    updatevehicle,
    deletevehicle,
    getvehicleById,
    getAllvehicles,
    searchVehicleByVin,
    getVehiclesByMaxPrice 
};