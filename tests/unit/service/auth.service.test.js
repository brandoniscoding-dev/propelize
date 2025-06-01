import { describe, it, expect, vi, beforeEach } from 'vitest';
const bcrypt = require('bcryptjs');
const User = require('../../../src/models/user.model');

vi.mock('../../../src/utils/token.utils', () => ({
  generateToken: vi.fn()
}));

import * as tokenUtils from '../../../src/utils/token.utils';
const { registerUser, loginUser } = require('../../../src/services/auth.service');

describe('auth.service', () => {
  const mockUser = {
    id: 'user-id',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'hashed-password',
    role: 'user'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a new user and return a token', async () => {
      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'securePass123',
        role: 'user'
      };

      vi.spyOn(User, 'findOne').mockResolvedValue(null);
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password');
      vi.spyOn(User, 'create').mockResolvedValue(mockUser);
      tokenUtils.generateToken.mockReturnValue('jwt-token');

      const result = await registerUser(userData);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed-password'
      });
      expect(tokenUtils.generateToken).toHaveBeenCalledWith(mockUser);
      expect(result).toBe('jwt-token');
    });

    it('should throw error if email already exists', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);

      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'securePass123',
        role: 'user'
      };

      await expect(registerUser(userData)).rejects.toMatchObject({
        status: 400,
        message: 'Email already in use'
      });
    });
  });

  describe('loginUser', () => {
    it('should authenticate a user and return token', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'securePass123'
      };

      vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      tokenUtils.generateToken.mockReturnValue('jwt-token');

      const result = await loginUser(credentials);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: credentials.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
      expect(tokenUtils.generateToken).toHaveBeenCalledWith(mockUser);
      expect(result).toBe('jwt-token');
    });

    it('should throw error if user not found', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValue(null);

      await expect(loginUser({ email: 'invalid@example.com', password: 'any' }))
        .rejects.toMatchObject({
          status: 400,
          message: 'Invalid credentials'
        });
    });

    it('should throw error if password does not match', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      vi.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(loginUser({ email: 'john@example.com', password: 'wrong' }))
        .rejects.toMatchObject({
          status: 400,
          message: 'Invalid credentials'
        });
    });
  });
});
