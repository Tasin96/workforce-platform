const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const {
  User,
  WorkerProfile,
  WorkerServiceOffer,
  Availability,
  Booking,
  Payment,
  Review,
  Dispute,
  Notification,
  sequelize,
} = require('../models');
const { serializeUser } = require('../utils/serializers');

// @desc Update own profile
// @route PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.user_id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone || user.phone;
  user.location = req.body.location ?? user.location;
  user.avatar = req.body.avatar ?? user.avatar;
  if (req.body.password) user.password = req.body.password;

  await user.save();
  res.json(serializeUser(user));
});

// @desc Get all users (admin)
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    order: [['created_at', 'DESC']],
  });
  res.json(users.map(serializeUser));
});

// Shared deletion helper for removing any user or worker account
const removeUserAccount = async (targetUserId, currentAdminId) => {
  const user = await User.findByPk(targetUserId);
  if (!user) {
    const error = new Error('User account not found');
    error.status = 404;
    throw error;
  }

  if (user.user_id === currentAdminId) {
    const error = new Error('Admins cannot delete their own account');
    error.status = 400;
    throw error;
  }

  const workerProfile = await WorkerProfile.findOne({ where: { user_id: targetUserId } });
  const workerId = workerProfile ? workerProfile.worker_id : null;

  await sequelize.transaction(async (t) => {
    // 1. Gather all booking IDs associated with this user (as customer or worker)
    const bookingWhere = [{ customer_id: targetUserId }];
    if (workerId) {
      bookingWhere.push({ worker_id: workerId });
    }

    const bookings = await Booking.findAll({
      where: { [Op.or]: bookingWhere },
      attributes: ['booking_id'],
      transaction: t,
    });
    const bookingIds = bookings.map((b) => b.booking_id);

    // 2. Remove disputes associated with these bookings or raised by this user
    const disputeWhere = [{ raised_by: targetUserId }];
    if (bookingIds.length > 0) {
      disputeWhere.push({ booking_id: bookingIds });
    }
    await Dispute.destroy({
      where: { [Op.or]: disputeWhere },
      transaction: t,
    });

    // 3. Remove payments associated with these bookings
    if (bookingIds.length > 0) {
      await Payment.destroy({
        where: { booking_id: bookingIds },
        transaction: t,
      });
    }

    // 4. Remove reviews associated with these bookings, or left by customer, or for worker
    const reviewWhere = [{ customer_id: targetUserId }];
    if (bookingIds.length > 0) {
      reviewWhere.push({ booking_id: bookingIds });
    }
    if (workerId) {
      reviewWhere.push({ worker_id: workerId });
    }
    await Review.destroy({
      where: { [Op.or]: reviewWhere },
      transaction: t,
    });

    // 5. Update any other bookings where this user was the canceller
    await Booking.update(
      { cancelled_by: null },
      { where: { cancelled_by: targetUserId }, transaction: t }
    );

    // 6. Delete all bookings
    if (bookingIds.length > 0) {
      await Booking.destroy({
        where: { booking_id: bookingIds },
        transaction: t,
      });
    }

    // 7. Delete notifications for this user
    await Notification.destroy({
      where: { user_id: targetUserId },
      transaction: t,
    });

    // 8. If worker, delete worker service offers, availabilities, and worker profile
    if (workerId) {
      await WorkerServiceOffer.destroy({
        where: { worker_id: workerId },
        transaction: t,
      });
      await Availability.destroy({
        where: { worker_id: workerId },
        transaction: t,
      });
      await WorkerProfile.destroy({
        where: { worker_id: workerId },
        transaction: t,
      });
    }

    // 9. Finally delete the user account
    await User.destroy({
      where: { user_id: targetUserId },
      transaction: t,
    });
  });

  return {
    success: true,
    message: `Account for ${user.name} (${user.role}) has been permanently removed.`,
    deletedUserId: targetUserId,
  };
};

// @desc Delete user or worker account (admin only)
// @route DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const result = await removeUserAccount(req.params.id, req.user.user_id);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500);
    throw err;
  }
});

module.exports = { updateMe, getUsers, deleteUser, removeUserAccount };
