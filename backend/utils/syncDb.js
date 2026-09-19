// Creates/updates all PostgreSQL tables from the Sequelize models.
// Run this once after pointing DATABASE_URL / PG* env vars at your database.
require('dotenv').config();
const { sequelize } = require('../models');

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL. Syncing tables...');
    // { alter: true } updates existing tables to match the models without dropping data.
    // Use { force: true } instead ONLY if you want to drop and recreate everything.
    await sequelize.sync({ alter: true });
    console.log('All tables are in sync.');
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err.message);
    process.exit(1);
  }
};

run();
