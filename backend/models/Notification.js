const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// notifications(notification_id PK, user_id FK, type, message, is_read DEFAULT false, sent_at)
const Notification = sequelize.define(
  'Notification',
  {
    notification_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.STRING(50), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    sent_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    link: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'notifications' }
);

module.exports = Notification;
