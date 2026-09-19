const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// worker_service_offers(worker_id FK, service_id FK, hourly_rate, fixed_price) composite PK
const WorkerServiceOffer = sequelize.define(
  'WorkerServiceOffer',
  {
    worker_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    service_id: { type: DataTypes.UUID, allowNull: false, primaryKey: true },
    hourly_rate: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    fixed_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  },
  { tableName: 'worker_service_offers' }
);

module.exports = WorkerServiceOffer;
