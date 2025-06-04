import { describe, it, expect, vi,afterEach,beforeEach } from 'vitest';
import * as vehicleController from '../../src/controllers/vehicle.controller';
import * as vehicleService from '../../src/services/vehicle.service';
import { vi } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

vi.mock('../../src/services/vehicle.service');

describe('Vehicle Controller', () => {
  const mockVehicle = {
    id: uuidv4(),
    vin: '1HGCM82633A123456',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    rentalPrice: 45.99,
    ownerId: uuidv4()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateVehicle', () => {
    it('should update vehicle successfully', async () => {
      const req = {
        params: { id: mockVehicle.id },
        body: { rentalPrice: 50 }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.updateVehicle.mockResolvedValue({
        ...mockVehicle,
        rentalPrice: 50
      });

      await vehicleController.updateVehicle(req, res);

      expect(vehicleService.updateVehicle).toHaveBeenCalledWith(mockVehicle.id, { rentalPrice: 50 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        rentalPrice: 50
      }));
    });

    it('should handle update errors', async () => {
      const req = {
        params: { id: 'invalid-id' },
        body: {}
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.updateVehicle.mockRejectedValue({
        status: 404,
        message: 'Vehicle not found'
      });

      await vehicleController.updateVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vehicle not found'
      });
    });
  });

  describe('deleteVehicle', () => {
    it('should delete vehicle successfully', async () => {
      const req = {
        params: { id: mockVehicle.id }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await vehicleController.deleteVehicle(req, res);

      expect(vehicleService.deleteVehicle).toHaveBeenCalledWith(mockVehicle.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vehicle deleted successfully'
      });
    });

    it('should handle delete errors', async () => {
      const req = {
        params: { id: 'invalid-id' }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.deleteVehicle.mockRejectedValue({
        status: 404,
        message: 'Vehicle not found'
      });

      await vehicleController.deleteVehicle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vehicle not found'
      });
    });
  });

  describe('getVehicleById', () => {
    it('should fetch vehicle by ID', async () => {
      const req = {
        params: { id: mockVehicle.id }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.getVehicleById.mockResolvedValue(mockVehicle);

      await vehicleController.getVehicleById(req, res);

      expect(vehicleService.getVehicleById).toHaveBeenCalledWith(mockVehicle.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockVehicle);
    });

    it('should return 404 if vehicle not found', async () => {
      const req = {
        params: { id: 'non-existent-id' }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.getVehicleById.mockResolvedValue(null);

      await vehicleController.getVehicleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vehicle not found'
      });
    });

    it('should handle server errors', async () => {
      const req = {
        params: { id: mockVehicle.id }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.getVehicleById.mockRejectedValue(new Error('Database error'));

      await vehicleController.getVehicleById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Server error while fetching vehicle'
      });
    });
  });

  describe('getAllVehicles', () => {
    it('should fetch all vehicles', async () => {
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.getAllVehicles.mockResolvedValue([mockVehicle]);

      await vehicleController.getAllVehicles(req, res);

      expect(vehicleService.getAllVehicles).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockVehicle]);
    });

    it('should handle server errors', async () => {
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.getAllVehicles.mockRejectedValue(new Error('Database error'));

      await vehicleController.getAllVehicles(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Server error while fetching vehicles'
      });
    });
  });

  describe('searchVehicleByVin', () => {
    it('should find vehicle by VIN', async () => {
      const req = {
        params: { vin: mockVehicle.vin }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.searchVehicleByVin.mockResolvedValue(mockVehicle);

      await vehicleController.searchVehicleByVin(req, res);

      expect(vehicleService.searchVehicleByVin).toHaveBeenCalledWith(mockVehicle.vin);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockVehicle);
    });

    it('should return 404 if VIN not found', async () => {
      const req = {
        params: { vin: 'invalid-vin' }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.searchVehicleByVin.mockResolvedValue(null);

      await vehicleController.searchVehicleByVin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Vehicle not found'
      });
    });

    it('should handle server errors', async () => {
      const req = {
        params: { vin: mockVehicle.vin }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.searchVehicleByVin.mockRejectedValue(new Error('Database error'));

      await vehicleController.searchVehicleByVin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Server error while searching vehicle'
      });
    });
  });

  describe('getVehiclesByMaxPrice', () => {
    it('should fetch vehicles by max price', async () => {
      const maxPrice = 50;
      const req = {
        params: { maxPrice }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.getVehiclesByMaxPrice.mockResolvedValue([mockVehicle]);

      await vehicleController.getVehiclesByMaxPrice(req, res);

      expect(vehicleService.getVehiclesByMaxPrice).toHaveBeenCalledWith(maxPrice);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockVehicle]);
    });

    it('should handle invalid max price', async () => {
      const req = {
        params: { maxPrice: 'invalid' }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      vehicleService.getVehiclesByMaxPrice.mockRejectedValue(new Error('Invalid price'));

      await vehicleController.getVehiclesByMaxPrice(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Server error while fetching vehicles by maximum price'
      });
    });
  });
});

