import { describe, it, expect, vi, beforeEach } from 'vitest';
const { Op } = require('sequelize');
const vehicle = require('../../../src/models/vehicle.model');
const {
  createvehicle,
  updatevehicle,
  deletevehicle,
  getvehicleById,
  getAllvehicles,
  searchVehicleByVin,
  getVehiclesByMaxPrice
} = require('../../../src/services/vehicle.service');

describe('vehicle.service', () => {
  const mockVehicle = {
    id: 'fake-id',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    vin: '12345678901234567',
    rentalPrice: 15000,
    ownerId: 'owner-uuid'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createvehicle', () => {
    it('should create a vehicle', async () => {
      vi.spyOn(vehicle, 'create').mockResolvedValue(mockVehicle);
      const result = await createvehicle(mockVehicle);
      expect(vehicle.create).toHaveBeenCalledWith(mockVehicle);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('updatevehicle', () => {
    it('should update a vehicle by id', async () => {
      const updateResult = [1]; // Sequelize returns [affectedCount]
      vi.spyOn(vehicle, 'update').mockResolvedValue(updateResult);
      const result = await updatevehicle('fake-id', { rentalPrice: 12000 });
      expect(vehicle.update).toHaveBeenCalledWith({ rentalPrice: 12000 }, { where: { id: 'fake-id' } });
      expect(result).toEqual(updateResult);
    });
  });

  describe('deletevehicle', () => {
    it('should delete a vehicle by id', async () => {
      vi.spyOn(vehicle, 'destroy').mockResolvedValue(1);
      const result = await deletevehicle('fake-id');
      expect(vehicle.destroy).toHaveBeenCalledWith({ where: { id: 'fake-id' } });
      expect(result).toBe(1);
    });
  });

  describe('getvehicleById', () => {
    it('should retrieve a vehicle by id', async () => {
      vi.spyOn(vehicle, 'findByPk').mockResolvedValue(mockVehicle);
      const result = await getvehicleById('fake-id');
      expect(vehicle.findByPk).toHaveBeenCalledWith('fake-id');
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('getAllvehicles', () => {
    it('should fetch all vehicles', async () => {
      const vehicles = [mockVehicle];
      vi.spyOn(vehicle, 'findAll').mockResolvedValue(vehicles);
      const result = await getAllvehicles();
      expect(vehicle.findAll).toHaveBeenCalled();
      expect(result).toEqual(vehicles);
    });
  });

  describe('searchVehicleByVin', () => {
    it('should find vehicle by vin', async () => {
      vi.spyOn(vehicle, 'findOne').mockResolvedValue(mockVehicle);
      const result = await searchVehicleByVin('12345678901234567');
      expect(vehicle.findOne).toHaveBeenCalledWith({ where: { vin: '12345678901234567' } });
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('getVehiclesByMaxPrice', () => {
    it('should get vehicles with rentalPrice <= maxPrice', async () => {
      const vehicles = [mockVehicle];
      vi.spyOn(vehicle, 'findAll').mockResolvedValue(vehicles);
      const result = await getVehiclesByMaxPrice(16000);
      expect(vehicle.findAll).toHaveBeenCalledWith({
        where: {
          rentalPrice: {
            [Op.lte]: 16000
          }
        }
      });
      expect(result).toEqual(vehicles);
    });
  });
});
