const { DataTypes } = require('sequelize');
const dbConfig = require('../config/db');
const sequelize = dbConfig.sequelize || dbConfig.default?.sequelize || dbConfig;

// services(service_id PK, service_name UNIQUE, type)
const Service = sequelize.define(
  'Service',
  {
    service_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    service_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    type: { type: DataTypes.STRING(100), allowNull: false },
    icon: { type: DataTypes.STRING(50), defaultValue: 'tool' },
    description: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'services' }
);

module.exports = Service;
