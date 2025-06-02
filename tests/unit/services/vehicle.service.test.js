import { describe, it, expect, vi, beforeEach } from 'vitest';
const { Op } = require('sequelize');
const Vehicle = require('../../../src/models/vehicle.model');
const {
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleById,
  getAllVehicles,
  searchVehicleByVin,
  getVehiclesByMaxPrice,
} = require('../../../src/services/vehicle.service');

describe('vehicle.service', () => {
  const mockVehicle = {
    id: 'fake-id',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    vin: '12345678901234567',
    rentalPrice: 15000,
    ownerId: 'owner-uuid',
    update: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createVehicle', () => {
    it('should create a vehicle', async () => {
      vi.spyOn(Vehicle, 'create').mockResolvedValue(mockVehicle);
      const result = await createVehicle(mockVehicle);
      expect(Vehicle.create).toHaveBeenCalledWith(mockVehicle);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe('updateVehicle', () => {
    it('should update a vehicle by id', async () => {
      vi.spyOn(Vehicle, 'findByPk').mockResolvedValue(mockVehicle);
      const updateData = { rentalPrice: 12000 };
      const result = await updateVehicle('fake-id', updateData);
      expect(Vehicle.findByPk).toHaveBeenCalledWith('fake-id');
      expect(mockVehicle.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockVehicle);
    });

    it('should throw 404 error if vehicle not found', async () => {
      vi.spyOn(Vehicle, 'findByPk').mockResolvedValue(null);
      await expect(updateVehicle('nonexistent-id', { rentalPrice: 12000 })).rejects.toMatchObject({
        message: 'Vehicle not found',
        status: 404,
      });
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle by id', async () => {
      vi.spyOn(Vehicle, 'findByPk').mockResolvedValue(mockVehicle);
      await deleteVehicle('fake-id');
      expect(Vehicle.findByPk).toHaveBeenCalledWith('fake-id');
      expect(mockVehicle.destroy).toHaveBeenCalled();
    });

    it('should throw 404 error if vehicle not found', async () => {
      vi.spyOn(Vehicle, 'findByPk').mockResolvedValue(null);
      await expect(deleteVehicle('nonexistent-id')).rejects.toMatchObject({
        message: 'Vehicle not found',
        status: 404,
      });
    });
  });

  describe('getVehicleById', () => {
    it('should retrieve a vehicle by id', async () => {
      vi.spyOn(Vehicle, 'findByPk').mockResolvedValue(mockVehicle);
      const result = await getVehicleById('fake-id');
      expect(Vehicle.findByPk).toHaveBeenCalledWith('fake-id', {
        attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
      });
      expect(result).toEqual(mockVehicle);
    });

    it('should return null if vehicle not found', async () => {
      vi.spyOn(Vehicle, 'findByPk').mockResolvedValue(null);
      const result = await getVehicleById('nonexistent-id');
      expect(Vehicle.findByPk).toHaveBeenCalledWith('nonexistent-id', {
        attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
      });
      expect(result).toBeNull();
    });
  });

  describe('getAllVehicles', () => {
    it('should fetch all vehicles', async () => {
      const vehicles = [mockVehicle];
      vi.spyOn(Vehicle, 'findAll').mockResolvedValue(vehicles);
      const result = await getAllVehicles();
      expect(Vehicle.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
      });
      expect(result).toEqual(vehicles);
    });
  });

  describe('searchVehicleByVin', () => {
    it('should find vehicle by vin', async () => {
      vi.spyOn(Vehicle, 'findOne').mockResolvedValue(mockVehicle);
      const result = await searchVehicleByVin('12345678901234567');
      expect(Vehicle.findOne).toHaveBeenCalledWith({
        where: { vin: '12345678901234567' },
        attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
      });
      expect(result).toEqual(mockVehicle);
    });

    it('should return null if vehicle not found', async () => {
      vi.spyOn(Vehicle, 'findOne').mockResolvedValue(null);
      const result = await searchVehicleByVin('nonexistent-vin');
      expect(Vehicle.findOne).toHaveBeenCalledWith({
        where: { vin: 'nonexistent-vin' },
        attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
      });
      expect(result).toBeNull();
    });
  });

  describe('getVehiclesByMaxPrice', () => {
    it('should get vehicles with rentalPrice <= maxPrice', async () => {
      const vehicles = [mockVehicle];
      vi.spyOn(Vehicle, 'findAll').mockResolvedValue(vehicles);
      const result = await getVehiclesByMaxPrice(16000);
      expect(Vehicle.findAll).toHaveBeenCalledWith({
        where: {
          rentalPrice: {
            [Op.lte]: 16000,
          },
        },
        attributes: ['id', 'vin', 'make', 'model', 'rentalPrice'],
      });
      expect(result).toEqual(vehicles);
    });
  });
});