const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// reviews(review_id PK, booking_id FK UNIQUE, customer_id FK, worker_id FK, rating CHECK 1-5, comment)
const Review = sequelize.define(
  'Review',
  {
    review_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    booking_id: { type: DataTypes.UUID, allowNull: false, unique: true },
    customer_id: { type: DataTypes.UUID, allowNull: false },
    worker_id: { type: DataTypes.UUID, allowNull: false },
    rating: { type: DataTypes.DECIMAL(2, 1), allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'reviews' }
);

module.exports = Review;
