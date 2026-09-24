// These helpers reshape Sequelize (PostgreSQL) model instances into the exact
// JSON shape the React frontend expects (which mirrors how the
// original Mongoose/MongoDB version populated referenced documents).
// Numeric Postgres types (DECIMAL) are returned as strings by the driver,
// so we cast them back to JS numbers here.

const num = (v) => (v === null || v === undefined ? v : parseFloat(v));

const serializeUser = (u) => {
  if (!u) return null;
  return {
    id: u.user_id,
    _id: u.user_id,
    user_id: u.user_id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    location: u.location,
    avatar: u.avatar,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
};

const serializeService = (s) => {
  if (!s) return null;
  return {
    id: s.service_id,
    _id: s.service_id,
    service_id: s.service_id,
    service_name: s.service_name,
    type: s.type,
    icon: s.icon,
    description: s.description,
  };
};

const serializeOffer = (o) => {
  if (!o) return null;
  const compositeId = `${o.worker_id}:${o.service_id}`;
  return {
    id: compositeId,
    _id: compositeId,
    worker_id: o.worker_id,
    service_id: o.service ? serializeService(o.service) : o.service_id,
    service: o.service ? serializeService(o.service) : undefined,
    hourly_rate: num(o.hourly_rate),
    fixed_price: num(o.fixed_price),
  };
};

const serializeAvailability = (a) => {
  if (!a) return null;
  return {
    id: a.availability_id,
    _id: a.availability_id,
    availability_id: a.availability_id,
    worker_id: a.worker_id,
    day_of_week: a.day_of_week,
    start_time: a.start_time,
    end_time: a.end_time,
  };
};

const serializeWorkerProfile = (wp, { includeUser = true } = {}) => {
  if (!wp) return null;
  const userObj = includeUser && wp.user ? serializeUser(wp.user) : null;
  return {
    id: wp.worker_id,
    _id: wp.worker_id,
    worker_id: wp.worker_id,
    user_id: userObj || wp.user_id,
    user: userObj,
    service_type: wp.service_type,
    experience: wp.experience,
    rating: num(wp.rating) || 0,
    rating_count: wp.rating_count || 0,
    ratingCount: wp.rating_count || 0,
    bio: wp.bio,
    is_verified: wp.is_verified,
    isVerified: wp.is_verified,
    skills: wp.skills || [],
    completed_jobs: wp.completed_jobs || 0,
    completedJobs: wp.completed_jobs || 0,
  };
};

const serializePayment = (p) => {
  if (!p) return null;
  return {
    id: p.payment_id,
    _id: p.payment_id,
    payment_id: p.payment_id,
    booking_id: p.booking_id,
    amount: num(p.amount),
    method: p.method,
    status: p.status,
    transaction_id: p.transaction_id,
    paid_at: p.paid_at,
    createdAt: p.createdAt,
    booking: p.booking ? serializeBooking(p.booking, { includeRelations: false }) : undefined,
  };
};

const serializeReview = (r) => {
  if (!r) return null;
  const customerObj = r.customer ? serializeUser(r.customer) : null;
  return {
    id: r.review_id,
    _id: r.review_id,
    review_id: r.review_id,
    booking_id: r.booking_id,
    customer_id: customerObj || r.customer_id,
    customer: customerObj,
    worker_id: r.worker_id,
    rating: num(r.rating) || 0,
    comment: r.comment,
    createdAt: r.createdAt,
  };
};

const serializeDispute = (d) => {
  if (!d) return null;
  const raiserObj = d.raiser ? serializeUser(d.raiser) : null;
  return {
    id: d.dispute_id,
    _id: d.dispute_id,
    dispute_id: d.dispute_id,
    booking_id: d.booking ? serializeBooking(d.booking, { includeRelations: false }) : d.booking_id,
    review_id: d.review_id,
    raised_by: raiserObj || d.raised_by,
    raiser: raiserObj,
    reason: d.reason,
    status: d.status,
    created_at: d.created_at,
    resolved_at: d.resolved_at,
  };
};

const serializeBooking = (b, { includeRelations = true } = {}) => {
  if (!b) return null;
  const customerObj = b.customer ? serializeUser(b.customer) : null;
  const workerObj = b.worker ? serializeWorkerProfile(b.worker) : null;
  const serviceObj = b.service ? serializeService(b.service) : null;
  return {
    id: b.booking_id,
    _id: b.booking_id,
    booking_id: b.booking_id,
    customer_id: customerObj || b.customer_id,
    customer: customerObj,
    worker_id: workerObj || b.worker_id,
    worker: workerObj,
    service_id: serviceObj || b.service_id,
    service: serviceObj,
    date_time: b.date_time,
    status: b.status,
    address: b.address,
    notes: b.notes,
    duration_hours: parseInt(b.duration_hours, 10) || 1,
    durationHours: parseInt(b.duration_hours, 10) || 1,
    estimatedCost: num(b.estimated_cost) || 0,
    estimated_cost: num(b.estimated_cost) || 0,
    accepted_at: b.accepted_at,
    started_at: b.started_at,
    completed_at: b.completed_at,
    cancelled_by: b.cancelled_by,
    cancellation_reason: b.cancellation_reason,
    createdAt: b.createdAt,
    payment: includeRelations && b.payment ? serializePayment(b.payment) : null,
    review: includeRelations && b.review ? serializeReview(b.review) : null,
    disputes: includeRelations && Array.isArray(b.disputes) ? b.disputes.map(serializeDispute) : [],
  };
};

const serializeNotification = (n) => {
  if (!n) return null;
  return {
    id: n.notification_id,
    _id: n.notification_id,
    notification_id: n.notification_id,
    user_id: n.user_id,
    type: n.type,
    message: n.message,
    is_read: n.is_read,
    sent_at: n.sent_at,
    link: n.link,
  };
};

module.exports = {
  serializeUser,
  serializeService,
  serializeOffer,
  serializeAvailability,
  serializeWorkerProfile,
  serializeBooking,
  serializeReview,
  serializeDispute,
  serializeNotification,
  serializePayment,
};
