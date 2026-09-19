const asyncHandler = require('express-async-handler');
const { User, WorkerProfile, Notification } = require('../models');
const generateToken = require('../utils/generateToken');

// @desc Register new user (customer or worker)
// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role, location, service_type } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const userExists = await User.scope('withPassword').findOne({ where: { email: email.toLowerCase() } });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    phone: phone || null,
    password,
    role: role === 'worker' ? 'worker' : 'customer',
    location,
  });

  if (user.role === 'worker') {
    await WorkerProfile.create({
      user_id: user.user_id,
      service_type: service_type || 'General',
      experience: '0-1 years',
    });
  }

  await Notification.create({
    user_id: user.user_id,
    type: 'welcome',
    message: `Welcome to WorkForce, ${user.name.split(' ')[0]}! Your account is ready.`,
  });

  res.status(201).json({
    _id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    token: generateToken(user.user_id),
  });
});

// @desc Login user
// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.scope('withPassword').findOne({ where: { email: (email || '').toLowerCase() } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      avatar: user.avatar,
      token: generateToken(user.user_id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc Get logged-in user profile
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.user_id);
  let workerProfile = null;
  if (user.role === 'worker') {
    workerProfile = await WorkerProfile.findOne({ where: { user_id: user.user_id } });
  }
  res.json({ user, workerProfile });
});

module.exports = { registerUser, loginUser, getMe };
