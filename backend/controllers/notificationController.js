const asyncHandler = require('express-async-handler');
const { Notification } = require('../models');
const { serializeNotification } = require('../utils/serializers');

// @desc Get my notifications
// @route GET /api/notifications
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { user_id: req.user.user_id },
    order: [['sent_at', 'DESC']],
    limit: 50,
  });
  res.json(notifications.map(serializeNotification));
});

// @desc Mark notification as read
// @route PUT /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id);
  if (!isUUID) {
    res.status(404);
    throw new Error('Notification not found');
  }

  const notif = await Notification.findOne({
    where: { notification_id: req.params.id, user_id: req.user.user_id },
  });
  if (!notif) {
    res.status(404);
    throw new Error('Notification not found');
  }
  notif.is_read = true;
  await notif.save();
  res.json(serializeNotification(notif));
});

// @desc Mark all as read
// @route PUT /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.update({ is_read: true }, { where: { user_id: req.user.user_id, is_read: false } });
  res.json({ success: true });
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
