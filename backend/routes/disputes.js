const express = require('express');
const router = express.Router();
const { createDispute, getMyDisputes, getAllDisputes, updateDispute } = require('../controllers/disputeController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createDispute);
router.get('/my', protect, getMyDisputes);
router.get('/', protect, authorize('admin'), getAllDisputes);
router.put('/:id', protect, authorize('admin'), updateDispute);

module.exports = router;
