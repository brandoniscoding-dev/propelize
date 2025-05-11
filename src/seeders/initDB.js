// src/seeders/initDB.js

const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Vehicle = require('../models/vehicle.model');

/**
 * Initialise la base de données avec des utilisateurs et des véhicules par défaut,
 * uniquement si elle est vide.
 */
async function initDB() {
  const usersCount = await User.count();

  // Si des utilisateurs existent déjà, on ne fait rien
  if (usersCount > 0) {
    console.log('La base contient déjà des données. Seeder ignoré.');
    return;
  }

  console.log('Insertion des données initiales...');

  // Hachage du mot de passe par défaut
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Insertion des utilisateurs (admin + 2 utilisateurs)
  const users = await User.bulkCreate([
    {
      username: 'admin',
      email: 'admin@propelize.com',
      password: hashedPassword,
      role: 'admin'
    },
    {
      username: 'user1',
      email: 'user1@propelize.com',
      password: hashedPassword,
      role: 'user'
    },
    {
      username: 'user2',
      email: 'user2@propelize.com',
      password: hashedPassword,
      role: 'user'
    }
  ]);

  // Insertion de véhicules associés aux utilisateurs
  await Vehicle.bulkCreate([
    {
      make: 'Tesla',
      model: 'Model S',
      year: 2020,
      vin: 'TESLA2020VIN001',
      ownerId: users[1].id // user1
    },
    {
      make: 'Ford',
      model: 'Mustang',
      year: 2018,
      vin: 'FORD2018VIN001',
      ownerId: users[2].id // user2
    }
  ]);

  console.log('Données initiales insérées.');
}

module.exports = initDB;
