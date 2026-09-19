const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// availabilities(availability_id PK, worker_id FK, day_of_week, start_time, end_time CHECK end>start)
const Availability = sequelize.define(
  'Availability',
  {
    availability_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    worker_id: { type: DataTypes.UUID, allowNull: false },
    day_of_week: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    start_time: { type: DataTypes.TIME, allowNull: false },
    end_time: { type: DataTypes.TIME, allowNull: false },
  },
  {
    tableName: 'availabilities',
    validate: {
      endAfterStart() {
        if (this.start_time && this.end_time && this.end_time <= this.start_time) {
          throw new Error('end_time must be after start_time');
        }
      },
    },
  }
);

module.exports = Availability;
