const { DataTypes } = require('sequelize');
const dbConfig = require('../config/db');
const sequelize = dbConfig.sequelize || dbConfig.default?.sequelize || dbConfig;

// bookings(booking_id PK, customer_id FK, worker_id FK, service_id FK, date_time,
// status ENUM, accepted_at, started_at, completed_at, cancelled_by, cancellation_reason)
const Booking = sequelize.define(
  'Booking',
  {
    booking_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    customer_id: { type: DataTypes.UUID, allowNull: false },
    worker_id: { type: DataTypes.UUID, allowNull: false },
    service_id: { type: DataTypes.UUID, allowNull: false },
    date_time: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    address: { type: DataTypes.TEXT, defaultValue: '' },
    notes: { type: DataTypes.TEXT, defaultValue: '' },
    estimated_cost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    accepted_at: { type: DataTypes.DATE, allowNull: true },
    started_at: { type: DataTypes.DATE, allowNull: true },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    cancelled_by: { type: DataTypes.UUID, allowNull: true },
    cancellation_reason: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'bookings' }
);

module.exports = Booking;
