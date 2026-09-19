const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// disputes(dispute_id PK, booking_id FK, review_id FK nullable, raised_by, reason,
// status ENUM, created_at, resolved_at)
const Dispute = sequelize.define(
  'Dispute',
  {
    dispute_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    booking_id: { type: DataTypes.UUID, allowNull: false },
    review_id: { type: DataTypes.UUID, allowNull: true },
    raised_by: { type: DataTypes.UUID, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('open', 'under_review', 'resolved', 'rejected'), defaultValue: 'open' },
    resolved_at: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'disputes', createdAt: 'created_at', updatedAt: 'updated_at' }
);

module.exports = Dispute;
