const asyncHandler = require('express-async-handler');
const { Service } = require('../models');
const { serializeService } = require('../utils/serializers');

// @desc Get all services
// @route GET /api/services
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.findAll({ order: [['service_name', 'ASC']] });
  res.json(services.map(serializeService));
});

// @desc Create a service (admin)
// @route POST /api/services
const createService = asyncHandler(async (req, res) => {
  const { service_name, type, icon, description } = req.body;
  const exists = await Service.findOne({ where: { service_name } });
  if (exists) {
    res.status(400);
    throw new Error('Service already exists');
  }
  const service = await Service.create({ service_name, type, icon, description });
  res.status(201).json(serializeService(service));
});

module.exports = { getServices, createService };
