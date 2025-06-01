import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

// Mock env config
vi.mock('../../../src/config/env.config', () => ({
  JWT_SECRET: 'test-secret',
  JWT_EXPIRES_IN: '1h',
}));

const { generateToken } = require('../../../src/utils/token.utils');

describe('generateToken()', () => {
  const mockUser = {
    id: 'user-123',
    role: 'admin',
    email: 'admin@gmail.com',
  };

  let token;

  beforeEach(() => {
    token = generateToken(mockUser);
  });

  it('should return a JWT string', () => {
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should contain correct payload when decoded', () => {
    const decoded = jwt.decode(token);

    expect(decoded).toMatchObject({
      id: mockUser.id,
      role: mockUser.role,
      email: mockUser.email,
    });

    if (decoded && typeof decoded === 'object') {
      expect('iat' in decoded).toBe(true);
      expect('exp' in decoded).toBe(true);
    }
  });

  it('should throw an error when no user is provided', () => {
    expect(() => generateToken()).toThrow();
  });
});
