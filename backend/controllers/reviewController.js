const asyncHandler = require('express-async-handler');
const { Review, Booking, WorkerProfile, User, Notification } = require('../models');
const { serializeReview } = require('../utils/serializers');

// @desc Create a review for a completed booking
// @route POST /api/reviews
const createReview = asyncHandler(async (req, res) => {
  const { booking_id, rating, comment } = req.body;

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

  if (booking.customer_id !== req.user.user_id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You are only authorized to review your own bookings');
  }

  if (booking.status !== 'completed') {
    res.status(400);
    throw new Error('You can only review completed bookings');
  }

  const existing = await Review.findOne({ where: { booking_id } });
  if (existing) {
    res.status(400);
    throw new Error('This booking has already been reviewed');
  }

  const review = await Review.create({
    booking_id,
    customer_id: req.user.user_id,
    worker_id: booking.worker_id,
    rating,
    comment,
  });

  const profile = await WorkerProfile.findByPk(booking.worker_id);
  if (profile) {
    const currentCount = profile.rating_count || 0;
    const currentRating = parseFloat(profile.rating || 0);
    const newCount = currentCount + 1;
    const newAvg = (currentRating * currentCount + Number(rating)) / newCount;
    profile.rating = Math.round(newAvg * 100) / 100;
    profile.rating_count = newCount;
    await profile.save();

    // Send notification to the specialist
    if (profile.user_id) {
      await Notification.create({
        user_id: profile.user_id,
        type: 'review_received',
        message: `You received a ${Number(rating).toFixed(1)}★ review from ${req.user.name}: "${(comment || '').slice(0, 50)}"`,
        link: '/bookings',
      });
    }
  }

  const full = await Review.findByPk(review.review_id, {
    include: [{ model: User, as: 'customer', attributes: ['user_id', 'name', 'avatar'] }],
  });
  res.status(201).json(serializeReview(full));
});

// @desc Get reviews for a worker
// @route GET /api/reviews/worker/:workerId
const getWorkerReviews = asyncHandler(async (req, res) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.workerId);
  if (!isUUID) {
    return res.json([]);
  }

  const reviews = await Review.findAll({
    where: { worker_id: req.params.workerId },
    include: [{ model: User, as: 'customer', attributes: ['user_id', 'name', 'avatar'] }],
    order: [['createdAt', 'DESC']],
  });
  res.json(reviews.map(serializeReview));
});

module.exports = { createReview, getWorkerReviews };
