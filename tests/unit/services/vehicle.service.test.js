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
      const updatedVehicle = { ...mockVehicle, rentalPrice: 12000 };
      vi.spyOn(Vehicle, 'findByPk').mockResolvedValue({
        update: vi.fn().mockResolvedValue(updatedVehicle),
      });
      const result = await updateVehicle('fake-id', { rentalPrice: 12000 });
      expect(Vehicle.findByPk).toHaveBeenCalledWith('fake-id');
      expect(result).toEqual(updatedVehicle);
    });

    it('should throw an error if vehicle not found', async () => {
      vi.spyOn(Vehicle, 'findByPk').mockResolvedValue(null);
      await expect(updateVehicle('