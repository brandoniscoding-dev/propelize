import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser
} from '../../src/controllers/auth.controller.js';
import * as authService from '../../src/services/auth.service.js';
import User from '../../src/models/user.model.js';

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockUser = {
    id: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user'
  };

  describe('registerUser', () => {
    it('should register a new user and return 201', async () => {
      vi.spyOn(authService, 'registerUser').mockResolvedValue({
        user: mockUser
      });

      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should handle registration errors', async () => {
      vi.spyOn(authService, 'registerUser').mockRejectedValue({
        status: 400,
        message: 'Email already in use'
      });

      const req = { body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
    });
  });

  describe('loginUser', () => {
    it('should login user and return tokens', async () => {
      vi.spyOn(authService, 'loginUser').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser
      });

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser
      });
    });

    it('should handle login errors', async () => {
      vi.spyOn(authService, 'loginUser').mockRejectedValue({
        status: 400,
        message: 'Invalid credentials'
      });

      const req = { body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token', async () => {
      vi.spyOn(authService, 'refreshAccessToken').mockResolvedValue({
        accessToken: 'new-access-token',
        user: mockUser
      });

      const req = {
        body: {
          refreshToken: 'valid-refresh-token'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'new-access-token',
        user: mockUser
      });
    });

    it('should require refresh token', async () => {
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
      vi.spyOn(authService, 'refreshAccessToken').mockRejectedValue({
        status: 401,
        message: 'Invalid refresh token'
      });

      const req = {
        body: {
          refreshToken: 'invalid-refresh-token'
        }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await refreshToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid refresh token' });
    });
  });

  describe('logoutUser', () => {
    it('should logout user successfully', async () => {
      const mockUpdate = vi.fn().mockResolvedValue(true);
      vi.spyOn(User, 'findByPk').mockResolvedValue({
        update: mockUpdate
      });

      const req = {
        user: { id: mockUser.id }
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };

      await logoutUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(mockUser.id);
      expect(mockUpdate).toHaveBeenCalledWith({ refreshToken: null });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });

    it('should handle unauthenticated logout', async () => {
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
      vi.spyOn(User, 'findByPk').mockRejectedValue(new Error('Database error'));

      const req = {
        user: { id: mockUser.id }
      };
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