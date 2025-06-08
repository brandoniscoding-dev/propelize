import { describe, it, expect, vi, beforeEach } from 'vitest';
const userController = require('../../../src/controllers/user.controller.js');
const userService = require('../../../src/services/user.service.js');

describe('User Controller', () => {
  const mockUser = {
    id: 'a1b2c3d4',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user'
  };

  beforeEach(() => {
    vi.restoreAllMocks(); // restaure les mocks / spies
  });

  describe('updateCurrentUser', () => {
    it('should update and return the updated user', async () => {
      const updates = { username: 'newusername', email: 'new@example.com' };
      const updatedUser = { ...mockUser, ...updates };

      vi.spyOn(userService, 'updateCurrentUser').mockResolvedValue(updatedUser);

      const req = {
        user: { id: mockUser.id },
        body: updates
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await userController.updateCurrentUser(req, res);

      expect(userService.updateCurrentUser).toHaveBeenCalledWith(mockUser.id, updates);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 400 on update error', async () => {
      const error = new Error('Update failed');
      error.status = 400;

      vi.spyOn(userService, 'updateCurrentUser').mockRejectedValue(error);

      const req = {
        user: { id: mockUser.id },
        body: {}
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await userController.updateCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update user profile' });
    });
  });

  describe('deleteCurrentUser', () => {
    it('should delete the current user and return a 204 status', async () => {
      vi.spyOn(userService, 'deleteCurrentUser').mockResolvedValue();

      const req = {
        user: { id: mockUser.id }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
      };

      await userController.deleteCurrentUser(req, res);

      expect(userService.deleteCurrentUser).toHaveBeenCalledWith(mockUser.id);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 on delete error', async () => {
      const error = new Error('Delete failed');
      error.status = 400;

      vi.spyOn(userService, 'deleteCurrentUser').mockRejectedValue(error);

      const req = {
        user: { id: mockUser.id }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await userController.deleteCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to delete user account' });
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user data', async () => {
      const req = { user: mockUser };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await userController.getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getAllUsers', () => {
    it('should return the list of all users', async () => {
      const users = [mockUser, { ...mockUser, id: 'x2y3z4' }];
      vi.spyOn(userService, 'getAllUsers').mockResolvedValue(users);

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await userController.getAllUsers(req, res);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return 500 on service error', async () => {
      const error = new Error('Database error');
      error.status = 500;

      vi.spyOn(userService, 'getAllUsers').mockRejectedValue(error);

      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

});
