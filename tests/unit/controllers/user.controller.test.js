import { describe, it, expect, vi, beforeEach } from 'vitest';
const {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../../../src/controllers/user.controller.js');

const userService = require('../../../src/services/user.service.js');

describe('User Controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockUser = {
    id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAdminUser = { ...mockUser, role: 'admin' };

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      vi.spyOn(userService, 'getCurrentUser').mockResolvedValue(mockUser);

      const req = { user: { id: mockUser.id } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await getCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
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

      await updateCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('deleteCurrentUser', () => {
    it('should delete the current user and return 204', async () => {
      vi.spyOn(userService, 'deleteCurrentUser').mockResolvedValue(true);

      const req = { user: { id: mockUser.id } };
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
      };

      await deleteCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser, mockAdminUser];
      vi.spyOn(userService, 'getAllUsers').mockResolvedValue(users);

      const req = { user: mockAdminUser };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      vi.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);

      const req = {
        user: mockAdminUser,
        params: { id: mockUser.id }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateUserById', () => {
    it('should update a user by ID and return the updated user', async () => {
      const updates = { role: 'admin' };
      const updatedUser = { ...mockUser, ...updates };

      vi.spyOn(userService, 'updateUserById').mockResolvedValue(updatedUser);

      const req = {
        user: mockAdminUser,
        params: { id: mockUser.id },
        body: updates
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await updateUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user by ID and return 204', async () => {
      vi.spyOn(userService, 'deleteUserById').mockResolvedValue(true);

      const req = {
        user: mockAdminUser,
        params: { id: mockUser.id }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn()
      };

      await deleteUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should handle errors in updateCurrentUser', async () => {
      const error = new Error('Update failed');
      error.status = 400;
      vi.spyOn(userService, 'updateCurrentUser').mockRejectedValue(error);

      const req = { user: { id: mockUser.id }, body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await updateCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update user profile' });
    });

    it('should handle errors in deleteCurrentUser', async () => {
      const error = new Error('Deletion failed');
      error.status = 500;
      vi.spyOn(userService, 'deleteCurrentUser').mockRejectedValue(error);

      const req = { user: { id: mockUser.id } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await deleteCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to delete user account' });

    });
  });
});
