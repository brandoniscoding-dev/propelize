// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import bcrypt from 'bcryptjs';
// import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../src/utils/token.util';
// import { registerUser, loginUser, refreshAccessToken } from '../../../src/services/auth.service';
// import User from '../../../src/models/user.model';

// // Mock manuel des fonctions de token.util
// vi.mock('../../../src/utils/token.util', () => ({
//   generateAccessToken: vi.fn(),
//   generateRefreshToken: vi.fn(),
//   verifyRefreshToken: vi.fn(),
// }));

// // Mock manuel de bcrypt avec export par défaut
// vi.mock('bcryptjs', () => {
//   const bcryptMock = {
//     hash: vi.fn(),
//     compare: vi.fn(),
//   };
//   return {
//     __esModule: true,
//     default: bcryptMock,
//   };
// });

// // Mock de l'environnement pour éviter les erreurs liées à ENV.JWT_SECRET
// vi.mock('../../../src/config/env.config', () => ({
//   JWT_SECRET: 'yourSecretKey',
// }));

// describe('auth.service', () => {
//   const mockUser = {
//     id: 'user-uuid',
//     username: 'john_doe',
//     email: 'john@example.com',
//     password: 'hashed-password',
//     role: 'user',
//     refreshToken: null,
//     update: vi.fn().mockResolvedValue(undefined),
//     dataValues: {
//       id: 'user-uuid',
//       username: 'john_doe',
//       email: 'john@example.com',
//       role: 'user',
//       password: 'hashed-password',
//     },
//   };

//   beforeEach(() => {
//     vi.clearAllMocks();
//     // Mock des méthodes Sequelize sur User
//     vi.spyOn(User, 'findOne').mockClear().mockImplementation(() => Promise.resolve());
//     vi.spyOn(User, 'create').mockClear().mockImplementation(() => Promise.resolve());
//     vi.spyOn(User, 'findByPk').mockClear().mockImplementation(() => Promise.resolve());
//   });

//   describe('registerUser', () => {
//     it('should register a new user successfully', async () => {
//       const userDetails = {
//         username: 'john_doe',
//         email: 'john@example.com',
//         password: 'password123',
//         role: 'user',
//       };

//       vi.spyOn(User, 'findOne').mockResolvedValue(null); // Aucun utilisateur existant
//       bcrypt.hash.mockResolvedValue('hashed-password');
//       vi.spyOn(User, 'create').mockResolvedValue(mockUser);

//       const result = await registerUser(userDetails);

//       expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
//       expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
//       expect(User.create).toHaveBeenCalledWith({
//         username: 'john_doe',
//         email: 'john@example.com',
//         password: 'hashed-password',
//         role: 'user',
//       });
//       expect(result).toEqual({
//         user: {
//           id: 'user-uuid',
//           username: 'john_doe',
//           email: 'john@example.com',
//           role: 'user',
//         },
//       });
//     });

//     it('should throw 400 error if email is already in use', async () => {
//       vi.spyOn(User, 'findOne').mockResolvedValue(mockUser); // Email déjà utilisé

//       await expect(
//         registerUser({
//           username: 'john_doe',
//           email: 'john@example.com',
//           password: 'password123',
//         })
//       ).rejects.toMatchObject({
//         status: 400,
//         message: 'Email already in use',
//       });

//       expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
//       expect(bcrypt.hash).not.toHaveBeenCalled();
//       expect(User.create).not.toHaveBeenCalled();
//     });

//     it('should use default role "user" if role is not provided', async () => {
//       vi.spyOn(User, 'findOne').mockResolvedValue(null);
//       bcrypt.hash.mockResolvedValue('hashed-password');
//       vi.spyOn(User, 'create').mockResolvedValue(mockUser);

//       await registerUser({
//         username: 'john_doe',
//         email: 'john@example.com',
//         password: 'password123',
//       });

//       expect(User.create).toHaveBeenCalledWith({
//         username: 'john_doe',
//         email: 'john@example.com',
//         password: 'hashed-password',
//         role: 'user',
//       });
//     });
//   });

//   describe('loginUser', () => {
//     it('should login user and return tokens', async () => {
//       const credentials = {
//         email: 'john@example.com',
//         password: 'password123',
//       };

//       vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(true);
//       generateAccessToken.mockReturnValue('access-token');
//       generateRefreshToken.mockReturnValue('refresh-token');

//       const result = await loginUser(credentials);

//       expect(User.findOne).toHaveBeenCalledWith({
//         where: { email: 'john@example.com' },
//         attributes: ['id', 'username', 'email', 'role', 'password'],
//       });
//       expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
//       expect(generateAccessToken).toHaveBeenCalledWith(mockUser);
//       expect(generateRefreshToken).toHaveBeenCalledWith(mockUser);
//       expect(mockUser.update).toHaveBeenCalledWith({ refreshToken: 'refresh-token' });
//       expect(result).toEqual({
//         accessToken: 'access-token',
//         refreshToken: 'refresh-token',
//         user: {
//           id: 'user-uuid',
//           username: 'john_doe',
//           email: 'john@example.com',
//           role: 'user',
//         },
//       });
//     });

//     it('should throw 400 error if email does not exist', async () => {
//       vi.spyOn(User, 'findOne').mockResolvedValue(null);

//       await expect(
//         loginUser({
//           email: 'john@example.com',
//           password: 'password123',
//         })
//       ).rejects.toMatchObject({
//         status: 400,
//         message: 'Invalid credentials',
//       });

//       expect(User.findOne).toHaveBeenCalledWith({
//         where: { email: 'john@example.com' },
//         attributes: ['id', 'username', 'email', 'role', 'password'],
//       });
//       expect(bcrypt.compare).not.toHaveBeenCalled();
//     });

//     it('should throw 400 error if password is incorrect', async () => {
//       vi.spyOn(User, 'findOne').mockResolvedValue(mockUser);
//       bcrypt.compare.mockResolvedValue(false);

//       await expect(
//         loginUser({
//           email: 'john@example.com',
//           password: 'wrong-password',
//         })
//       ).rejects.toMatchObject({
//         status: 400,
//         message: 'Invalid credentials',
//       });

//       expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password');
//     });
//   });

//   describe('refreshAccessToken', () => {
//     it('should refresh access token successfully', async () => {
//       const refreshToken = 'refresh-token';
//       const decoded = { id: 'user-uuid' };

//       verifyRefreshToken.mockReturnValue(decoded);
//       vi.spyOn(User, 'findByPk').mockResolvedValue({
//         ...mockUser,
//         refreshToken: 'refresh-token',
//       });
//       generateAccessToken.mockReturnValue('new-access-token');

//       const result = await refreshAccessToken(refreshToken);

//       expect(verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
//       expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
//         attributes: ['id', 'username', 'email', 'role', 'refreshToken'],
//       });
//       expect(generateAccessToken).toHaveBeenCalledWith({
//         ...mockUser,
//         refreshToken: 'refresh-token',
//       });
//       expect(result).toEqual({
//         accessToken: 'new-access-token',
//         user: {
//           id: 'user-uuid',
//           username: 'john_doe',
//           email: 'john@example.com',
//           role: 'user',
//         },
//       });
//     });

//     it('should throw 401 error if user not found', async () => {
//       verifyRefreshToken.mockReturnValue({ id: 'user-uuid' });
//       vi.spyOn(User, 'findByPk').mockResolvedValue(null);

//       await expect(refreshAccessToken('refresh-token')).rejects.toMatchObject({
//         status: 401,
//         message: 'Invalid refresh token',
//       });

//       expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
//         attributes: ['id', 'username', 'email', 'role', 'refreshToken'],
//       });
//     });

//     it('should throw 401 error if refresh token does not match', async () => {
//       verifyRefreshToken.mockReturnValue({ id: 'user-uuid' });
//       vi.spyOn(User, 'findByPk').mockResolvedValue({
//         ...mockUser,
//         refreshToken: 'different-token',
//       });

//       await expect(refreshAccessToken('refresh-token')).rejects.toMatchObject({
//         status: 401,
//         message: 'Invalid refresh token',
//       });

//       expect(User.findByPk).toHaveBeenCalledWith('user-uuid', {
//         attributes: ['id', 'username', 'email', 'role', 'refreshToken'],
//       });
//     });

//     it('should throw 401 error if verifyRefreshToken fails', async () => {
//       verifyRefreshToken.mockImplementation(() => {
//         const error = new Error('Invalid or expired refresh token');
//         error.status = 401;
//         throw error;
//       });

//       await expect(refreshAccessToken('invalid-token')).rejects.toMatchObject({
//         status: 401,
//         message: 'Invalid or expired refresh token',
//       });

//       expect(User.findByPk).not.toHaveBeenCalled();
//     });
//   });
// });