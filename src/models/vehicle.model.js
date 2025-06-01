const { DataTypes } = require('sequelize');
const db = require('../config/db.config');

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
  rentalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'vehicles',
  timestamps: true
});

module.exports = Vehicle;
