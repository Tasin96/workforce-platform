require('dotenv').config();
const SequelizeModule = require('sequelize');
const Sequelize = SequelizeModule.Sequelize || SequelizeModule.default || SequelizeModule;
const pg = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const isRemoteDb = Boolean(
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes('localhost') &&
  !process.env.DATABASE_URL.includes('127.0.0.1')
);
const useSSL = String(process.env.PG_SSL).toLowerCase() === 'true' || isProduction || isRemoteDb;

const commonOptions = {
  dialect: 'postgres',
  dialectModule: pg,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: useSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
  define: {
    underscored: true, // maps camelCase model attrs to snake_case columns
    timestamps: true,
  },
};

// Prefer a single DATABASE_URL (works out of the box with most Postgres hosts).
// Falls back to individual PG* env vars for local setups.
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, commonOptions)
  : new Sequelize(
      process.env.PGDATABASE || 'workforce_platform',
      process.env.PGUSER || 'postgres',
      process.env.PGPASSWORD || 'postgres',
      {
        ...commonOptions,
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`PostgreSQL connected: ${sequelize.config.host}/${sequelize.config.database}`);
  } catch (err) {
    console.error(`PostgreSQL connection error: ${err.message}`);
    // In serverless environments, avoid process.exit so handlers can surface the error gracefully
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = { sequelize, connectDB };
module.exports.default = { sequelize, connectDB };
module.exports.sequelize = sequelize;
module.exports.connectDB = connectDB;
