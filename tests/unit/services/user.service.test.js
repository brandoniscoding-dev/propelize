import { describe, it, expect, vi, beforeEach } from 'vitest';
const bcrypt = require('bcryptjs');
const User = require('../../../src/models/user.model');
const {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers,
} = require('../../../src/services/user.service');

describe('user.service', () => {
  const mockUser = {
    id: 'user-uuid',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'user',
    update: vi.fn().mockResolvedValue(undefined),
    destroy: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return the user if found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      const result = await getCurrentUser('user-uuid');
      expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
        attributes: ['id', 'username', 'email', 'role'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 error if user not found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(null);
      await expect(getCurrentUser('nonexistent-id')).rejects.toMatchObject({
        message: 'User not found',
        status: 404,
      });
    });
  });

  describe('updateCurrentUser', () => {
    it('should update user without password', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      const updateData = { email: 'new@example.com' };
      const result = await updateCurrentUser('user-uuid', updateData);
      expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
        attributes: ['id', 'username', 'email', 'role'],
      });
      expect(mockUser.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockUser);
    });

    it('should hash password before updating if password provided', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('new-hashed-password');
      const updateData = { password: 'newpass123' };
      const result = await updateCurrentUser('user-uuid', updateData);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass123', 10);
      expect(mockUser.update).toHaveBeenCalledWith({ password: 'new-hashed-password' });
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 error if user not found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(null);
      await expect(updateCurrentUser('nonexistent-id', { email: 'new@example.com' })).rejects.toMatchObject({
        message: 'User not found',
        status: 404,
      });
    });
  });

  describe('deleteCurrentUser', () => {
    it('should delete the user if found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      await deleteCurrentUser('user-uuid');
      expect(User.findByPk).toHaveBeenCalledWith('user-uuid');
      expect(mockUser.destroy).toHaveBeenCalled();
    });

    it('should throw 404 error if user not found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(null);
      await expect(deleteCurrentUser('nonexistent-id')).rejects.toMatchObject({
        message: 'User not found',
        status: 404,
      });
    });
  });

  describe('getUserById', () => {
    it('should return the user if found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      const result = await getUserById('user-uuid');
      expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
        attributes: ['id', 'username', 'email', 'role'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 error if user not found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(null);
      await expect(getUserById('nonexistent-id')).rejects.toMatchObject({
        message: 'User not found',
        status: 404,
      });
    });
  });

  describe('updateUserById', () => {
    it('should update user without password', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      const updateData = { email: 'new@example.com' };
      const result = await updateUserById('user-uuid', updateData);
      expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
        attributes: ['id', 'username', 'email', 'role'],
      });
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

    it('should throw 404 error if user not found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(null);
      await expect(updateUserById('nonexistent-id', { email: 'new@example.com' })).rejects.toMatchObject({
        message: 'User not found',
        status: 404,
      });
    });
  });

  describe('deleteUserById', () => {
    it('should delete the user if found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(mockUser);
      await deleteUserById('user-uuid');
      expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
        attributes: ['id', 'username', 'email', 'role'],
      });
      expect(mockUser.destroy).toHaveBeenCalled();
    });

    it('should throw 404 error if user not found', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue(null);
      await expect(deleteUserById('nonexistent-id')).rejects.toMatchObject({
        message: 'User not found',
        status: 404,
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      vi.spyOn(User, 'findAll').mockResolvedValue(users);
      const result = await getAllUsers();
      expect(User.findAll).toHaveBeenCalledWith({
        attributes: ['id', 'username', 'email', 'role'],
      });
      expect(result).toEqual(users);
    });
  });
});