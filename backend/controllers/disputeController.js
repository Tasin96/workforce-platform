const asyncHandler = require('express-async-handler');
const { Dispute, Booking, Notification, User, WorkerProfile } = require('../models');
const { serializeDispute } = require('../utils/serializers');

// @desc Raise a dispute on a booking
// @route POST /api/disputes
const createDispute = asyncHandler(async (req, res) => {
  const { booking_id, review_id, reason } = req.body;

  if (!reason || !String(reason).trim()) {
    res.status(400);
    throw new Error('Dispute reason is required');
  }

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(booking_id);
  if (!isUUID) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const booking = await Booking.findByPk(booking_id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const workerProfile = await WorkerProfile.findByPk(booking.worker_id);
  const isCustomer = req.user.user_id === booking.customer_id;
  const isWorker = workerProfile && workerProfile.user_id === req.user.user_id;
  const isAdmin = req.user.role === 'admin';

  if (!isCustomer && !isWorker && !isAdmin) {
    res.status(403);
    throw new Error('You are not authorized to dispute this booking');
  }

  const dispute = await Dispute.create({
    booking_id,
    review_id: review_id || null,
    raised_by: req.user.user_id,
    reason: String(reason).trim(),
    status: 'open',
  });

  const shortBookingId = (booking_id || '').slice(-6).toUpperCase();
  const shortReason = (reason || '').trim().slice(0, 60);

  // Notify admins
  const admins = await User.findAll({ where: { role: 'admin' } });
  for (const admin of admins) {
    await Notification.create({
      user_id: admin.user_id,
      type: 'dispute_opened',
      message: `Dispute raised by ${req.user.name} for booking #${shortBookingId}: "${shortReason}..."`,
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

  const shortBookingId = (dispute.booking_id || '').slice(-6).toUpperCase();

  // Notify the user who raised it
  await Notification.create({
    user_id: dispute.raised_by,
    type: 'dispute_status',
    message: `Your dispute for booking #${shortBookingId} has been updated to "${dispute.status}".`,
    link: '/bookings',
  });

  res.json(serializeDispute(dispute));
});

module.exports = { createDispute, getMyDisputes, getAllDisputes, updateDispute };

