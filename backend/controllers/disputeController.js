const asyncHandler = require('express-async-handler');
const { Dispute, Booking, Notification, User } = require('../models');
const { serializeDispute } = require('../utils/serializers');

// @desc Raise a dispute on a booking
// @route POST /api/disputes
const createDispute = asyncHandler(async (req, res) => {
  const { booking_id, review_id, reason } = req.body;
  const booking = await Booking.findByPk(booking_id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const dispute = await Dispute.create({
    booking_id,
    review_id: review_id || null,
    raised_by: req.user.user_id,
    reason,
    status: 'open',
  });

  // Notify admins
  const admins = await User.findAll({ where: { role: 'admin' } });
  for (const admin of admins) {
    await Notification.create({
      user_id: admin.user_id,
      type: 'dispute_opened',
      message: `Dispute raised by ${req.user.name} for booking #${booking_id.slice(-6).toUpperCase()}: "${reason.slice(0, 60)}..."`,
      link: '/dashboard',
    });
  }

  res.status(201).json(serializeDispute(dispute));
});

// @desc Get my disputes
// @route GET /api/disputes/my
const getMyDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.findAll({
    where: { raised_by: req.user.user_id },
    include: [{ model: Booking, as: 'booking' }],
    order: [['created_at', 'DESC']],
  });
  res.json(disputes.map(serializeDispute));
});

// @desc Get all disputes (admin)
// @route GET /api/disputes
const getAllDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.findAll({
    include: [{ model: Booking, as: 'booking' }, { model: User, as: 'raiser' }],
    order: [['created_at', 'DESC']],
  });
  res.json(disputes.map(serializeDispute));
});

// @desc Update dispute status (admin)
// @route PUT /api/disputes/:id
const updateDispute = asyncHandler(async (req, res) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id);
  if (!isUUID) {
    res.status(404);
    throw new Error('Dispute not found');
  }

  const dispute = await Dispute.findByPk(req.params.id);
  if (!dispute) {
    res.status(404);
    throw new Error('Dispute not found');
  }
  dispute.status = req.body.status || dispute.status;
  if (['resolved', 'rejected'].includes(dispute.status)) dispute.resolved_at = new Date();
  await dispute.save();

  // Notify the user who raised it
  await Notification.create({
    user_id: dispute.raised_by,
    type: 'dispute_status',
    message: `Your dispute for booking #${dispute.booking_id.slice(-6).toUpperCase()} has been updated to "${dispute.status}".`,
    link: '/bookings',
  });

  res.json(serializeDispute(dispute));
});

module.exports = { createDispute, getMyDisputes, getAllDisputes, updateDispute };

