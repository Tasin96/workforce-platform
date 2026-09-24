const asyncHandler = require('express-async-handler');
const { Payment, Booking, Notification, WorkerProfile, User, Service } = require('../models');
const { serializePayment, serializeBooking } = require('../utils/serializers');

// @desc Create/record a payment for a booking
// @route POST /api/payments
const createPayment = asyncHandler(async (req, res) => {
  const { booking_id, amount, method, transaction_id: customTxn } = req.body;

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
    throw new Error('Not authorized to record payment for this booking');
  }

  const existing = await Payment.findOne({ where: { booking_id } });
  if (existing) {
    res.status(400);
    throw new Error('Payment already recorded for this booking');
  }
  const transaction_id = (customTxn && customTxn.trim()) || `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const payment = await Payment.create({
    booking_id,
    amount: amount !== undefined ? amount : (booking.estimated_cost || 0),
    method: method || 'cash',
    status: 'paid',
    transaction_id,
    paid_at: new Date(),
  });

  if (workerProfile) {
    const shortBookingId = (booking.booking_id || '').slice(-6).toUpperCase();
    await Notification.create({
      user_id: workerProfile.user_id,
      type: 'payment_received',
      message: `Payment of ৳${payment.amount} via ${method || 'cash'} recorded for job ticket #${shortBookingId}.`,
      link: '/bookings',
    });
  }

  // Also fetch the created payment with booking details
  const fullPayment = await Payment.findByPk(payment.payment_id, {
    include: [
      {
        model: Booking,
        as: 'booking',
        include: [
          { model: User, as: 'customer', attributes: ['user_id', 'name', 'phone', 'email', 'location'] },
          {
            model: WorkerProfile,
            as: 'worker',
            include: [{ model: User, as: 'user', attributes: ['user_id', 'name', 'phone'] }],
          },
          { model: Service, as: 'service' },
        ],
      },
    ],
  });

  res.status(201).json(serializePayment(fullPayment || payment));
});

// @desc Get payment by booking
// @route GET /api/payments/booking/:bookingId
const getPaymentByBooking = asyncHandler(async (req, res) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.bookingId);
  if (!isUUID) {
    return res.status(404).json(null);
  }
  const payment = await Payment.findOne({
    where: { booking_id: req.params.bookingId },
    include: [
      {
        model: Booking,
        as: 'booking',
        include: [
          { model: User, as: 'customer', attributes: ['user_id', 'name', 'phone', 'email', 'location'] },
          {
            model: WorkerProfile,
            as: 'worker',
            include: [{ model: User, as: 'user', attributes: ['user_id', 'name', 'phone'] }],
          },
          { model: Service, as: 'service' },
        ],
      },
    ],
  });

  if (payment && payment.booking) {
    const isCustomer = req.user.user_id === payment.booking.customer_id;
    const isWorker = payment.booking.worker && payment.booking.worker.user_id === req.user.user_id;
    const isAdmin = req.user.role === 'admin';
    if (!isCustomer && !isWorker && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this payment');
    }
  }

  res.json(serializePayment(payment));
});

// @desc Get all payments for current user (or all if admin)
// @route GET /api/payments/my
const getMyPayments = asyncHandler(async (req, res) => {
  let payments = [];
  const bookingChildren = [
    { model: User, as: 'customer', attributes: ['user_id', 'name', 'phone', 'email', 'location'] },
    {
      model: WorkerProfile,
      as: 'worker',
      include: [{ model: User, as: 'user', attributes: ['user_id', 'name', 'phone'] }],
    },
    { model: Service, as: 'service' },
  ];

  if (req.user.role === 'admin') {
    payments = await Payment.findAll({
      include: [{ model: Booking, as: 'booking', include: bookingChildren }],
      order: [['paid_at', 'DESC'], ['createdAt', 'DESC']],
    });
  } else if (req.user.role === 'worker') {
    const profile = await WorkerProfile.findOne({ where: { user_id: req.user.user_id } });
    if (profile) {
      payments = await Payment.findAll({
        include: [
          {
            model: Booking,
            as: 'booking',
            where: { worker_id: profile.worker_id },
            include: bookingChildren,
          },
        ],
        order: [['paid_at', 'DESC'], ['createdAt', 'DESC']],
      });
    }
  } else {
    // customer
    payments = await Payment.findAll({
      include: [
        {
          model: Booking,
          as: 'booking',
          where: { customer_id: req.user.user_id },
          include: bookingChildren,
        },
      ],
      order: [['paid_at', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  res.json(payments.map((p) => serializePayment(p)));
});

module.exports = { createPayment, getPaymentByBooking, getMyPayments };

