const asyncHandler = require('express-async-handler');
const { User } = require('../models');
const { serializeUser } = require('../utils/serializers');

// @desc Update own profile
// @route PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.user_id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone || user.phone;
  user.location = req.body.location ?? user.location;
  user.avatar = req.body.avatar ?? user.avatar;
  if (req.body.password) user.password = req.body.password;

  await user.save();
  res.json(serializeUser(user));
});

// @desc Get all users (admin)
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users.map(serializeUser));
});

module.exports = { updateMe, getUsers };
