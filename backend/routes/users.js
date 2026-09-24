const express = require('express');
const router = express.Router();
const { updateMe, getUsers, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.put('/me', protect, updateMe);
router.get('/', protect, authorize('admin'), getUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
