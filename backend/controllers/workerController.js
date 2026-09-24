const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { WorkerProfile, WorkerServiceOffer, Availability, User, Service } = require('../models');
const {
  serializeWorkerProfile,
  serializeOffer,
  serializeAvailability,
} = require('../utils/serializers');

// @desc Search / browse workers with filters (location, service, rating, price)
// @route GET /api/workers?service=&trade=&location=&minRating=&q=
const getWorkers = asyncHandler(async (req, res) => {
  const { service, trade, location, minRating, q } = req.query;

  const where = {};
  if (minRating) where.rating = { [Op.gte]: Number(minRating) };
  const serviceFilter = service || trade;
  if (serviceFilter && serviceFilter !== 'All') {
    where.service_type = { [Op.iLike]: `%${serviceFilter}%` };
  }

  const userInclude = { model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone', 'location', 'avatar'] };
  if (location) userInclude.where = { location: { [Op.iLike]: `%${location}%` } };

  let profiles = await WorkerProfile.findAll({
    where,
    include: [
      userInclude,
      { model: WorkerServiceOffer, as: 'offers', include: [{ model: Service, as: 'service' }] },
    ],
  });

  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    profiles = profiles.filter((p) => {
      const name = (p.user?.name || '').toLowerCase();
      const st = (p.service_type || '').toLowerCase();
      const bio = (p.bio || '').toLowerCase();
      const loc = (p.user?.location || '').toLowerCase();
      const skills = Array.isArray(p.skills) ? p.skills.map((s) => String(s).toLowerCase()) : [];
      return (
        name.includes(term) ||
        st.includes(term) ||
        bio.includes(term) ||
        loc.includes(term) ||
        skills.some((s) => s.includes(term))
      );
    });
  }

  const results = profiles.map((p) => ({
    ...serializeWorkerProfile(p),
    offers: (p.offers || []).map(serializeOffer),
  }));

  res.json(results);
});

// @desc Get single worker profile detail
// @route GET /api/workers/:id
const getWorkerById = asyncHandler(async (req, res) => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(req.params.id);
  if (!isUUID) {
    res.status(404);
    throw new Error('Worker profile not found');
  }

  const profile = await WorkerProfile.findByPk(req.params.id, {
    include: [{ model: User, as: 'user', attributes: ['user_id', 'name', 'email', 'phone', 'location', 'avatar'] }],
  });
  if (!profile) {
    res.status(404);
    throw new Error('Worker profile not found');
  }
  const offers = await WorkerServiceOffer.findAll({
    where: { worker_id: profile.worker_id },
    include: [{ model: Service, as: 'service' }],
  });
  const availability = await Availability.findAll({ where: { worker_id: profile.worker_id } });

  res.json({
    profile: serializeWorkerProfile(profile),
    offers: offers.map(serializeOffer),
    availability: availability.map(serializeAvailability),
  });
});

// @desc Update own worker profile
// @route PUT /api/workers/me
const updateMyWorkerProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ where: { user_id: req.user.user_id } });
  if (!profile) {
    res.status(404);
    throw new Error('Worker profile not found');
  }
  profile.service_type = req.body.service_type ?? profile.service_type;
  profile.experience = req.body.experience ?? profile.experience;
  profile.bio = req.body.bio ?? profile.bio;
  if (req.body.skills !== undefined) {
    profile.skills = Array.isArray(req.body.skills)
      ? req.body.skills
      : typeof req.body.skills === 'string'
      ? req.body.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : profile.skills;
  }
  await profile.save();

  // If hourly_rate or fixed_price provided, update default service offer
  if (req.body.hourly_rate !== undefined || req.body.fixed_price !== undefined) {
    let matchingService = await Service.findOne({
      where: { service_name: { [Op.iLike]: `%${profile.service_type || ''}%` } },
    });
    if (!matchingService) {
      matchingService = await Service.findOne();
    }
    if (matchingService) {
      await WorkerServiceOffer.upsert({
        worker_id: profile.worker_id,
        service_id: matchingService.service_id,
        hourly_rate: req.body.hourly_rate !== undefined ? parseFloat(req.body.hourly_rate) : null,
        fixed_price: req.body.fixed_price !== undefined ? parseFloat(req.body.fixed_price) : null,
      });
    }
  }

  const updatedOffers = await WorkerServiceOffer.findAll({
    where: { worker_id: profile.worker_id },
    include: [{ model: Service, as: 'service' }],
  });

  res.json({
    ...serializeWorkerProfile(profile, { includeUser: false }),
    offers: updatedOffers.map(serializeOffer),
  });
});

// @desc Add/Update a service offer (hourly_rate / fixed_price) for logged-in worker
// @route POST /api/workers/me/offers
const upsertServiceOffer = asyncHandler(async (req, res) => {
  const { service_id, hourly_rate, fixed_price } = req.body;
  const profile = await WorkerProfile.findOne({ where: { user_id: req.user.user_id } });
  if (!profile) {
    res.status(404);
    throw new Error('Worker profile not found');
  }
  const service = await Service.findByPk(service_id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const [offer] = await WorkerServiceOffer.upsert(
    { worker_id: profile.worker_id, service_id, hourly_rate, fixed_price },
    { returning: true }
  );
  const withService = await WorkerServiceOffer.findOne({
    where: { worker_id: profile.worker_id, service_id },
    include: [{ model: Service, as: 'service' }],
  });
  res.status(201).json(serializeOffer(withService || offer));
});

// @desc Set availability slots for logged-in worker
// @route POST /api/workers/me/availability
const addAvailability = asyncHandler(async (req, res) => {
  const { day_of_week, start_time, end_time } = req.body;
  const profile = await WorkerProfile.findOne({ where: { user_id: req.user.user_id } });
  if (!profile) {
    res.status(404);
    throw new Error('Worker profile not found');
  }
  const slot = await Availability.create({
    worker_id: profile.worker_id,
    day_of_week,
    start_time,
    end_time,
  });
  res.status(201).json(serializeAvailability(slot));
});

module.exports = {
  getWorkers,
  getWorkerById,
  updateMyWorkerProfile,
  upsertServiceOffer,
  addAvailability,
};
