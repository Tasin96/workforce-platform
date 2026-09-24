const express = require('express');
const router = express.Router();
const {
  getWorkers,
  getWorkerById,
  updateMyWorkerProfile,
  upsertServiceOffer,
  addAvailability,
  deleteWorker,
} = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getWorkers);
router.put('/me', protect, authorize('worker'), updateMyWorkerProfile);
router.post('/me/offers', protect, authorize('worker'), upsertServiceOffer);
router.post('/me/availability', protect, authorize('worker'), addAvailability);
router.get('/:id', getWorkerById);
router.delete('/:id', protect, authorize('admin'), deleteWorker);

module.exports = router;
