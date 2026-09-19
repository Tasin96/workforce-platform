const dbConfig = require('../config/db');
const sequelize = dbConfig.sequelize || dbConfig.default?.sequelize || dbConfig;
const User = require('./User');
const Service = require('./Service');
const WorkerProfile = require('./WorkerProfile');
const Availability = require('./Availability');
const WorkerServiceOffer = require('./WorkerServiceOffer');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Review = require('./Review');
const Dispute = require('./Dispute');
const Notification = require('./Notification');

// ---- Associations (mirrors the ER diagram's relationships) ----

// users 1:1 worker_profiles
User.hasOne(WorkerProfile, { foreignKey: 'user_id', sourceKey: 'user_id', as: 'workerProfile' });
WorkerProfile.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id', as: 'user' });

// worker_profiles 1:many availabilities
WorkerProfile.hasMany(Availability, { foreignKey: 'worker_id', sourceKey: 'worker_id', as: 'availability' });
Availability.belongsTo(WorkerProfile, { foreignKey: 'worker_id', targetKey: 'worker_id', as: 'workerProfile' });

// worker_profiles <-> services many:many via worker_service_offers
WorkerProfile.hasMany(WorkerServiceOffer, { foreignKey: 'worker_id', sourceKey: 'worker_id', as: 'offers' });
WorkerServiceOffer.belongsTo(WorkerProfile, { foreignKey: 'worker_id', targetKey: 'worker_id', as: 'workerProfile' });
Service.hasMany(WorkerServiceOffer, { foreignKey: 'service_id', sourceKey: 'service_id', as: 'offers' });
WorkerServiceOffer.belongsTo(Service, { foreignKey: 'service_id', targetKey: 'service_id', as: 'service' });

// bookings
User.hasMany(Booking, { foreignKey: 'customer_id', sourceKey: 'user_id', as: 'bookingsAsCustomer' });
Booking.belongsTo(User, { foreignKey: 'customer_id', targetKey: 'user_id', as: 'customer' });
WorkerProfile.hasMany(Booking, { foreignKey: 'worker_id', sourceKey: 'worker_id', as: 'bookings' });
Booking.belongsTo(WorkerProfile, { foreignKey: 'worker_id', targetKey: 'worker_id', as: 'worker' });
Service.hasMany(Booking, { foreignKey: 'service_id', sourceKey: 'service_id', as: 'bookings' });
Booking.belongsTo(Service, { foreignKey: 'service_id', targetKey: 'service_id', as: 'service' });

// payments 1:1 bookings
Booking.hasOne(Payment, { foreignKey: 'booking_id', sourceKey: 'booking_id', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id', targetKey: 'booking_id', as: 'booking' });

// reviews 1:1 bookings
Booking.hasOne(Review, { foreignKey: 'booking_id', sourceKey: 'booking_id', as: 'review' });
Review.belongsTo(Booking, { foreignKey: 'booking_id', targetKey: 'booking_id', as: 'booking' });
User.hasMany(Review, { foreignKey: 'customer_id', sourceKey: 'user_id', as: 'reviewsGiven' });
Review.belongsTo(User, { foreignKey: 'customer_id', targetKey: 'user_id', as: 'customer' });
WorkerProfile.hasMany(Review, { foreignKey: 'worker_id', sourceKey: 'worker_id', as: 'reviews' });
Review.belongsTo(WorkerProfile, { foreignKey: 'worker_id', targetKey: 'worker_id', as: 'workerProfile' });

// disputes
Booking.hasMany(Dispute, { foreignKey: 'booking_id', sourceKey: 'booking_id', as: 'disputes' });
Dispute.belongsTo(Booking, { foreignKey: 'booking_id', targetKey: 'booking_id', as: 'booking' });
Review.hasOne(Dispute, { foreignKey: 'review_id', sourceKey: 'review_id', as: 'dispute' });
Dispute.belongsTo(Review, { foreignKey: 'review_id', targetKey: 'review_id', as: 'review' });
User.hasMany(Dispute, { foreignKey: 'raised_by', sourceKey: 'user_id', as: 'disputesRaised' });
Dispute.belongsTo(User, { foreignKey: 'raised_by', targetKey: 'user_id', as: 'raiser' });

// notifications
User.hasMany(Notification, { foreignKey: 'user_id', sourceKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Service,
  WorkerProfile,
  Availability,
  WorkerServiceOffer,
  Booking,
  Payment,
  Review,
  Dispute,
  Notification,
};
