const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// worker_profiles(worker_id PK, user_id FK UNIQUE, service_type, experience, rating CHECK 0-5)
const WorkerProfile = sequelize.define(
  'WorkerProfile',
  {
    worker_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false, unique: true },
    service_type: { type: DataTypes.STRING(100), allowNull: false },
    experience: { type: DataTypes.STRING(100), defaultValue: '0-1 years' },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: { min: 0, max: 5 },
    },
    rating_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    bio: { type: DataTypes.TEXT, defaultValue: '' },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    skills: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    completed_jobs: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: 'worker_profiles' }
);

module.exports = WorkerProfile;
