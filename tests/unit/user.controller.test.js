import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} from '../../src/controllers/user.controller.js';
import * as userService from '../../src/services/user.service.js';

describe('User Controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Mock user data based on your model
  const mockUser = {
    id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAdminUser = {
    ...mockUser,
    role: 'admin'
  };

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      // Mock the service to return the raw user data
      const rawUserData = {
        id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Mock the service to return the raw user data
      vi.spyOn(userService, 'getCurrentUser').mockResolvedValue(rawUserData);
      
      const req = { user: { id: rawUserData.id } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
  
      await getCurrentUser(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      // Expect the raw user data to be returned
      expect(res.json).toHaveBeenCalledWith(rawUserData);
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

  describe('getAllUsers (admin only)', () => {
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

  describe('getUserById (admin only)', () => {
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

  describe('updateUserById (admin only)', () => {
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

  describe('deleteUserById (admin only)', () => {
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

  describe('Error Handling', () => {
    it('should handle errors in updateCurrentUser', async () => {
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

      await updateCurrentUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Update failed' });
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
      expect(res.json).toHaveBeenCalledWith({ message: 'Deletion failed' });
    });
  });
});