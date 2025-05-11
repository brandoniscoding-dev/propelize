// src/models/vehicle.model.js
const { DataTypes } = require('sequelize');
const db = require('../config/db.config');
const User = require('./user.model');

const Vehicle = db.define('Vehicle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  make: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vin: {
    type: DataTypes.STRING,
    unique: true
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'vehicles',
  timestamps: true
});

// Association
Vehicle.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Vehicle, { foreignKey: 'ownerId', as: 'vehicles' });

module.exports = Vehicle;
