import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../src/utils/token.utils';

// Mock environment configuration
vi.mock('../../../src/config/env.config', () => ({
  ENV: {
    JWT_SECRET: 'yourSecretKey',
  },
}));

describe('Token Utility Functions', () => {
  const mockUser = {
    id: 'user-123',
    role: 'admin',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JWT access token', () => {
      const token = generateAccessToken(mockUser);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      const decoded = jwt.verify(token, 'yourSecretKey');
      expect(decoded).toMatchObject({
        id: mockUser.id,
        role: mockUser.role,
      });
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should include correct expiration time (15 minutes)', () => {
      const token = generateAccessToken(mockUser);
      const decoded = jwt.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const expectedExpiration = currentTime + 15 * 60; // 15 minutes in seconds
      expect(decoded.exp).toBeGreaterThanOrEqual(expectedExpiration - 5);
      expect(decoded.exp).toBeLessThanOrEqual(expectedExpiration + 5);
    });

    it('should throw an error if user object is missing required fields', () => {
      expect(() => generateAccessToken({})).toThrowError('User object must contain id and role');
      expect(() => generateAccessToken({ id: 'user-123' })).toThrowError('User object must contain id and role');
      expect(() => generateAccessToken({ role: 'admin' })).toThrowError('User object must contain id and role');
      expect(() => generateAccessToken(null)).toThrowError('User object must contain id and role');
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid JWT refresh token', () => {
      const token = generateRefreshToken(mockUser);
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      const decoded = jwt.verify(token, 'yourSecretKey');
      expect(decoded).toMatchObject({
        id: mockUser.id,
      });
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should include correct expiration time (7 days)', () => {
      const token = generateRefreshToken(mockUser);
      const decoded = jwt.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const expectedExpiration = currentTime + 7 * 24 * 60 * 60; // 7 days in seconds
      expect(decoded.exp).toBeGreaterThanOrEqual(expectedExpiration - 5);
      expect(decoded.exp).toBeLessThanOrEqual(expectedExpiration + 5);
    });

    it('should throw an error if user object is missing id', () => {
      expect(() => generateRefreshToken({})).toThrowError('User object must contain id');
      expect(() => generateRefreshToken(null)).toThrowError('User object must contain id');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token and return decoded payload', () => {
      const token = generateRefreshToken(mockUser);
      const decoded = verifyRefreshToken(token);
      expect(decoded).toMatchObject({
        id: mockUser.id,
      });
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should throw an error for an invalid token', () => {
      const invalidToken = 'invalid.token.string';
      expect(() => verifyRefreshToken(invalidToken)).toThrowError('Invalid or expired refresh token');
    });

    it('should throw an error with status 401 for expired token', () => {
      vi.spyOn(jwt, 'verify').mockImplementation(() => {
        const error = new Error('TokenExpiredError');
        error.name = 'TokenExpiredError';
        throw error;
      });

      const token = generateRefreshToken(mockUser);
      expect(() => verifyRefreshToken(token)).toThrowError('Invalid or expired refresh token');
      try {
        verifyRefreshToken(token);
      } catch (error) {
        expect(error.message).toBe('Invalid or expired refresh token');
        expect(error.status).toBe(401);
      }
    });
  });
});