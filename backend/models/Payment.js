const { DataTypes } = require('sequelize');
const dbConfig = require('../config/db');
const sequelize = dbConfig.sequelize || dbConfig.default?.sequelize || dbConfig;

// payments(payment_id PK, booking_id FK UNIQUE, amount CHECK>=0, method ENUM,
// status ENUM, transaction_id UNIQUE, paid_at)
const Payment = sequelize.define(
  'Payment',
  {
    payment_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    booking_id: { type: DataTypes.UUID, allowNull: false, unique: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    method: { type: DataTypes.ENUM('cash', 'card', 'mobile_banking'), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'pending' },
    transaction_id: { type: DataTypes.STRING(255), allowNull: true, unique: true },
    paid_at: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'payments' }
);

module.exports = Payment;
