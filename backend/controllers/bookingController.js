const asyncHandler = require('express-async-handler');
const { Booking, WorkerProfile, Notification, User, Service, Payment, Review, Dispute } = require('../models');
const { serializeBooking } = require('../utils/serializers');

const bookingIncludes = [
  { model: User, as: 'customer', attributes: ['user_id', 'name', 'phone', 'location'] },
  {
    model: WorkerProfile,
    as: 'worker',
    include: [{ model: User, as: 'user', attributes: ['user_id', 'name', 'phone', 'location'] }],
  },
  { model: Service, as: 'service' },
  { model: Payment, as: 'payment' },
  { model: Review, as: 'review' },
  { model: Dispute, as: 'disputes' },
];

// @desc Create a booking (customer or admin books a worker for a service)
// @route POST /api/bookings
const createBooking = asyncHandler(async (req, res) => {
  let { worker_id, service_id, date_time, address, notes, estimatedCost } = req.body;

  if (!worker_id || !date_time) {
    res.status(400);
    throw new Error('worker_id and date_time are required');
  }

  const workerProfile = await WorkerProfile.findByPk(worker_id);
  if (!workerProfile) {
    res.status(404);
    throw new Error('Worker not found');
  }

  if (!service_id) {
    const { Op } = require('sequelize');
    const matchingService = await Service.findOne({
      where: { service_name: { [Op.iLike]: `%${workerProfile.service_type || ''}%` } },
    });
    if (matchingService) {
      service_id = matchingService.service_id;
    } else {
      const defaultService = await Service.findOne();
      if (defaultService) service_id = defaultService.service_id;
    }
  }

  const booking = await Booking.create({
    customer_id: req.user.user_id,
    worker_id,
    service_id,
    date_time,
    address,
    notes,
    estimated_cost: estimatedCost || 0,
    status: 'pending',
  });

  await Notification.create({
    user_id: workerProfile.user_id,
    type: 'booking_request',
    message: `New booking request from ${req.user.name} for ${new Date(date_time).toLocaleString()}`,
    link: `/bookings/${booking.booking_id}`,
  });

  const full = await Booking.findByPk(booking.booking_id, { include: bookingIncludes });
  res.status(201).json(serializeBooking(full));
});

// @desc Get bookings for logged-in user (customer, worker, or admin)
// @route GET /api/bookings/my
const getMyBookings = asyncHandler(async (req, res) => {
  let bookings;
  if (req.user.role === 'admin') {
    bookings = await Booking.findAll({
      include: bookingIncludes,
      order: [['createdAt', 'DESC']],
    });
  } else if (req.user.role === 'worker') {
    const profile = await WorkerProfile.findOne({ where: { user_id: req.user.user_id } });
    bookings = profile
      ? await Booking.findAll({
          where: { worker_id: profile.worker_id },
          include: bookingIncludes,
          order: [['createdAt', 'DESC']],
        })
      : [];
  } else {
    bookings = await Booking.findAll({
      where: { customer_id: req.user.user_id },
      include: bookingIncludes,
      order: [['createdAt', 'DESC']],
    });
  }
  res.json(bookings.map(serializeBooking));
});

// @desc Get single booking by ID
// @route GET /api/bookings/:id
const getBookingById = asyncHandler(async (req, res) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id);
  if (!isUUID) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const booking = await Booking.findByPk(req.params.id, { include: bookingIncludes });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const isCustomer = req.user.user_id === booking.customer_id;
  const isWorker = req.user.role === 'worker' && booking.worker?.user_id === req.user.user_id;
  const isAdmin = req.user.role === 'admin';
  if (!isCustomer && !isWorker && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json(serializeBooking(booking));
});

// @desc Update booking status (accept, start, complete, cancel)
// @route PUT /api/bookings/:id/status
const updateBookingStatus = asyncHandler(async (req, res) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id);
  if (!isUUID) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const { status, cancellation_reason } = req.body;
  const validTransitions = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
  if (!validTransitions.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const booking = await Booking.findByPk(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  const previousStatus = booking.status;
  booking.status = status;
  if (status === 'accepted') booking.accepted_at = new Date();
  if (status === 'in_progress') booking.started_at = new Date();
  if (status === 'completed' && previousStatus !== 'completed') {
    booking.completed_at = new Date();
    const workerProfile = await WorkerProfile.findByPk(booking.worker_id);
    if (workerProfile) {
      workerProfile.completed_jobs = (workerProfile.completed_jobs || 0) + 1;
      await workerProfile.save();
    }
  }
  if (status === 'cancelled') {
    booking.cancelled_by = req.user.user_id;
    booking.cancellation_reason = cancellation_reason || '';
  }

  await booking.save();

  // notify the other party
  const workerProfile = await WorkerProfile.findByPk(booking.worker_id);
  const notifyUserId =
    req.user.user_id === booking.customer_id ? workerProfile?.user_id : booking.customer_id;

  if (notifyUserId) {
    await Notification.create({
      user_id: notifyUserId,
      type: 'booking_update',
      message: `Booking status updated to "${status.replace('_', ' ')}"`,
      link: `/bookings/${booking.booking_id}`,
    });
  }

  const full = await Booking.findByPk(booking.booking_id, { include: bookingIncludes });
  res.json(serializeBooking(full));
});

module.exports = { createBooking, getMyBookings, getBookingById, updateBookingStatus };
