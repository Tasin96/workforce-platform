const express = require('express');
const router = express.Router();
const { createPayment, getPaymentByBooking, getMyPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createPayment);
router.get('/my', protect, getMyPayments);
router.get('/booking/:bookingId', protect, getPaymentByBooking);

module.exports = router;

