const User = require('./user.model');
const Vehicle = require('./vehicle.model');

Vehicle.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Vehicle, { foreignKey: 'ownerId', as: 'vehicles' });

module.exports = {
  User,
  Vehicle
};
