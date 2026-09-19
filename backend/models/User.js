const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db');
const sequelize = dbConfig.sequelize || dbConfig.default?.sequelize || dbConfig;

// users(user_id PK, name, email UNIQUE, phone UNIQUE, password, role ENUM, location)
const User = sequelize.define(
  'User',
  {
    user_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
      set(value) {
        this.setDataValue('email', value ? value.toLowerCase().trim() : value);
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      set(value) {
        this.setDataValue('phone', value && String(value).trim() ? String(value).trim() : null);
      },
    },
    password: { type: DataTypes.TEXT, allowNull: false },
    role: { type: DataTypes.ENUM('customer', 'worker', 'admin'), allowNull: false, defaultValue: 'customer' },
    location: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
    avatar: { type: DataTypes.TEXT, allowNull: true, defaultValue: '' },
  },
  {
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: { attributes: {} },
    },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

User.prototype.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = User;
