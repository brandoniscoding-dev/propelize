import { describe, it, expect, vi, beforeEach } from 'vitest';
const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser
} = require('../../../src/controllers/auth.controller.js');

const authService = require('../../../src/services/auth.service.js');
const User = require('../../../src/models/user.model.js');

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockUser = {
    id: 'abc123',
    username: 'brandon',
    email: 'brandon@example.com',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // -------------------- registerUser --------------------
  describe('registerUser', () => {
    it('should register user and return user data', async () => {
      vi.spyOn(authService, 'registerUser').mockResolvedValue({ user: mockUser });

      const req = { body: { email: 'brandon@example.com', password: 'secure' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should handle registration errors', async () => {
      const error = new Error('Registration failed');
      error.status = 400;
      vi.spyOn(authService, 'registerUser').mockRejectedValue(error);

      const req = { body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Registration failed' });
    });
  });

  // -------------------- loginUser --------------------
  describe('loginUser', () => {
    it('should log in user and return tokens + user', async () => {
      const mockResponse = {
        accessToken: 'token123',
        refreshToken: 'refresh123',
        user: mockUser
      };
      vi.spyOn(authService, 'loginUser').mockResolvedValue(mockResponse);

      const req = { body: { email: 'brandon@example.com', password: 'secure' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle login errors', async () => {
      const error = new Error('Invalid credentials');
      error.status = 401;
      vi.spyOn(authService, 'loginUser').mockRejectedValue(error);

      const req = { body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  // -------------------- refreshToken --------------------
  describe('refreshToken', () => {
    it('should refresh token and return new accessToken + user', async () => {
      const mockResult = {
        accessToken: 'newAccess123',
        user: mockUser
      };
      vi.spyOn(authService, 'refreshAccessToken').mockResolvedValue(mockResult);

      const req = { body: { refreshToken: 'refresh123' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 if refresh token is missing', async () => {
      const req = { body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Refresh token is required' });
    });

    it('should handle refresh token errors', async () => {
      const error = new Error('Invalid refresh token');
      error.status = 403;
      vi.spyOn(authService, 'refreshAccessToken').mockRejectedValue(error);

      const req = { body: { refreshToken: 'invalid' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid refresh token' });
    });
  });

  // -------------------- logoutUser --------------------
  describe('logoutUser', () => {
    it('should logout authenticated user and return confirmation', async () => {
      vi.spyOn(User, 'findByPk').mockResolvedValue({
        update: vi.fn().mockResolvedValue(true)
      });

      const req = { user: { id: mockUser.id } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await logoutUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });

    it('should return 401 if no user is authenticated', async () => {
      const req = {};
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await logoutUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No user authenticated' });
    });

    it('should handle logout errors', async () => {
      vi.spyOn(User, 'findByPk').mockRejectedValue(new Error('DB error'));

      const req = { user: { id: mockUser.id } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await logoutUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});
