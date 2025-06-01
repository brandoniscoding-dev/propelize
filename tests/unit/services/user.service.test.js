import { describe, it, expect, vi, beforeEach } from 'vitest';
const bcrypt = require('bcryptjs');
const User = require('../../../src/models/user.model');
const {
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers
} = require('../../../src/services/user.service');

describe('user.service', () => {
  const mockUser = {
    id: 'user-uuid',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'hashed-password',
    update: vi.fn(),
    destroy: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return the user if found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      const result = await getUserById('user-uuid');
      expect(User.findByPk).toHaveBeenCalledWith('user-uuid');
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 error if user not found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(null);
      await expect(getUserById('nonexistent-id')).rejects.toMatchObject({
        message: 'User not found',
        status: 404
      });
    });
  });

  describe('updateUserById', () => {
    it('should update user without password', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      const updateData = { email: 'new@example.com' };

      const result = await updateUserById('user-uuid', updateData);

      expect(mockUser.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockUser);
    });

    it('should hash password before updating if password provided', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('new-hashed-password');

      const updateData = { password: 'newpass123' };

      const result = await updateUserById('user-uuid', updateData);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpass123', 10);
      expect(mockUser.update).toHaveBeenCalledWith({ password: 'new-hashed-password' });
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteUserById', () => {
    it('should delete the user if found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      await deleteUserById('user-uuid');
      expect(mockUser.destroy).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(null);
      await expect(deleteUserById('invalid-id')).rejects.toMatchObject({
        message: 'User not found',
        status: 404
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      vi.spyOn(User, 'findAll').mockResolvedValue(users);
      const result = await getAllUsers();
      expect(User.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });
});
