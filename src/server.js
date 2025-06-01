const app = require('./app');
const db = require('./config/db.config');
const ENV = require('./config/env.config'); 
const initDB = require('./seeders/initDB');

require('./models');

async function startServer() {
  try {
    await db.authenticate();
    console.log('Connexion à la base de données réussie');

    await db.sync({ alter: true }); 
    console.log('Base synchronisée');

    await initDB(); 

    app.listen(ENV.PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${ENV.PORT}`);
    });
  } catch (err) {
    console.error('Échec du démarrage du serveur :', err);
    process.exit(1);
  }
}

startServer();
