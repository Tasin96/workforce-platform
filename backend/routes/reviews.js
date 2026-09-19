const express = require('express');
const router = express.Router();
const { createReview, getWorkerReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer', 'admin'), createReview);
router.get('/worker/:workerId', getWorkerReviews);

module.exports = router;
