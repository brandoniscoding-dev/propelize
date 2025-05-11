const jwt = require('jsonwebtoken');
const ENV = require('../config/env.config');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );
};

module.exports = { generateToken };
