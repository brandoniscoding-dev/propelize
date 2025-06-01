require('dotenv').config();

const ENV = {
  PORT: process.env.PORT || 3000,
  DB_NAME: process.env.DB_NAME || 'propelize',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || 'postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  JWT_SECRET: process.env.JWT_SECRET || 'yourSecretKey',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '3h',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'yourRefreshSecretKey',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

module.exports = ENV;