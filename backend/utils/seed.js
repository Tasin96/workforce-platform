require('dotenv').config();
const {
  sequelize,
  User,
  WorkerProfile,
  Service,
  WorkerServiceOffer,
  Availability,
  Booking,
  Payment,
  Review,
  Dispute,
  Notification,
} = require('../models');

const seedDatabase = async ({ force = false } = {}) => {
  await sequelize.authenticate();
  if (force) {
    console.log('Syncing tables (force: true — drops and recreates them)...');
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
  }

  console.log('Seeding services...');
  const services = await Service.bulkCreate([
    { service_name: 'Electrician', type: 'Electrical', icon: 'zap', description: 'Wiring, fan/light installation, panel repair.' },
    { service_name: 'Painter', type: 'Home Improvement', icon: 'paint', description: 'Interior & exterior painting.' },
    { service_name: 'Plumber', type: 'Plumbing', icon: 'droplet', description: 'Leak repair, pipe fitting, installations.' },
    { service_name: 'Gardener', type: 'Landscaping', icon: 'leaf', description: 'Lawn care, planting, trimming.' },
    { service_name: 'Carpenter', type: 'Construction', icon: 'hammer', description: 'Furniture, fittings, repairs.' },
    { service_name: 'Cleaner', type: 'Home Services', icon: 'sparkles', description: 'Deep cleaning, move-in/out cleaning.' },
    { service_name: 'Appliance Repair', type: 'Electronics', icon: 'tool', description: 'AC, refrigerator, microwave & washing machine repair.' },
    { service_name: 'Mason / Construction', type: 'Construction', icon: 'cube', description: 'Brickwork, plastering, tile work, masonry repair.' },
  ], { returning: true });

  console.log('Seeding founder & admin (Tasin Islam)...');
  const admin = await User.create({
    name: 'Tasin Islam',
    email: 'admin@workforce.app',
    phone: '+8801717408075',
    password: 'admin123',
    role: 'admin',
    location: 'Dhaka, Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });

  console.log('Seeding customer (Tasin Islam)...');
  const customer = await User.create({
    name: 'Tasin Islam',
    email: 'customer@workforce.app',
    phone: '+8801700000001',
    password: 'customer123',
    role: 'customer',
    location: 'Dhaka, Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  });

  console.log('Seeding co-founder & customer (Ahosan Habib)...');
  const habib = await User.create({
    name: 'Ahosan Habib',
    email: 'habib@gmail.com',
    phone: '+8801700000002',
    password: 'password123',
    role: 'customer',
    location: 'Dhaka, Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  });

  console.log('Seeding co-founder & admin (Farhan Ahmed)...');
  const farhan = await User.create({
    name: 'Farhan Ahmed',
    email: 'farhan@workforce.app',
    phone: '+8801700000003',
    password: 'password123',
    role: 'admin',
    location: 'Dhaka, Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  });

  const workersData = [
    { name: 'Karim Sheikh', email: 'karim.electrician@workforce.app', phone: '+8801222222222', service_type: 'Electrician', experience: '5-8 years', rating: 4.8, rating_count: 34, bio: 'Licensed electrician specializing in residential wiring & emergency repairs.', is_verified: true, skills: ['Wiring', 'Fan Installation', 'Panel Repair'], completed_jobs: 128, location: 'Dhaka, Bangladesh', service: 'Electrician', hourly_rate: 350, avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Nasrin Akter', email: 'nasrin.painter@workforce.app', phone: '+8801333333333', service_type: 'Painter', experience: '3-5 years', rating: 4.6, rating_count: 21, bio: 'Detail-oriented painter for interior and exterior projects.', is_verified: true, skills: ['Interior Paint', 'Texture Wall', 'Waterproofing'], completed_jobs: 76, location: 'Dhaka, Bangladesh', service: 'Painter', fixed_price: 4500, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Jahangir Alam', email: 'jahangir.plumber@workforce.app', phone: '+8801444444444', service_type: 'Plumber', experience: '8+ years', rating: 4.9, rating_count: 58, bio: 'Master plumber, 8+ years fixing leaks and installing fixtures fast.', is_verified: true, skills: ['Leak Repair', 'Pipe Fitting'], completed_jobs: 210, location: 'Dhaka, Bangladesh', service: 'Plumber', hourly_rate: 300, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Salma Begum', email: 'salma.gardener@workforce.app', phone: '+8801555555555', service_type: 'Gardener', experience: '2-4 years', rating: 4.5, rating_count: 15, bio: 'Passionate gardener helping homes bloom, big or small.', is_verified: false, skills: ['Lawn Care', 'Planting'], completed_jobs: 42, location: 'Gazipur, Bangladesh', service: 'Gardener', hourly_rate: 200, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
    { name: 'Rafiq Islam', email: 'rafiq.carpenter@workforce.app', phone: '+8801666666666', service_type: 'Carpenter', experience: '5-8 years', rating: 4.7, rating_count: 29, bio: 'Custom furniture and quick fix-it carpentry services.', is_verified: true, skills: ['Furniture', 'Door Repair'], completed_jobs: 95, location: 'Dhaka, Bangladesh', service: 'Carpenter', fixed_price: 2500, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
    { name: 'Moushumi Rani', email: 'moushumi.cleaner@workforce.app', phone: '+8801777777777', service_type: 'Cleaner', experience: '1-3 years', rating: 4.4, rating_count: 12, bio: 'Reliable and thorough home cleaning, on your schedule.', is_verified: false, skills: ['Deep Clean', 'Move-out Clean'], completed_jobs: 33, location: 'Dhaka, Bangladesh', service: 'Cleaner', hourly_rate: 250, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
  ];

  console.log('Seeding workers...');
  const createdProfiles = [];
  for (const w of workersData) {
    const user = await User.create({
      name: w.name,
      email: w.email,
      phone: w.phone,
      password: 'worker123',
      role: 'worker',
      location: w.location,
      avatar: w.avatar,
    });
    const profile = await WorkerProfile.create({
      user_id: user.user_id,
      service_type: w.service_type,
      experience: w.experience,
      rating: w.rating,
      rating_count: w.rating_count,
      bio: w.bio,
      is_verified: w.is_verified,
      skills: w.skills,
      completed_jobs: w.completed_jobs,
    });
    createdProfiles.push({ profile, user, serviceName: w.service });

    const service = services.find((s) => s.service_name === w.service);
    await WorkerServiceOffer.create({
      worker_id: profile.worker_id,
      service_id: service.service_id,
      hourly_rate: w.hourly_rate || null,
      fixed_price: w.fixed_price || null,
    });
    await Availability.create({
      worker_id: profile.worker_id,
      day_of_week: 'Monday',
      start_time: '09:00',
      end_time: '18:00',
    });
    await Availability.create({
      worker_id: profile.worker_id,
      day_of_week: 'Wednesday',
      start_time: '09:00',
      end_time: '18:00',
    });
    await Availability.create({
      worker_id: profile.worker_id,
      day_of_week: 'Friday',
      start_time: '09:00',
      end_time: '18:00',
    });
  }

  console.log('Seeding demo bookings, payments, reviews, disputes, and notifications...');
  // 1. Completed booking with payment & review
  const electrician = createdProfiles.find((p) => p.serviceName === 'Electrician');
  const elecService = services.find((s) => s.service_name === 'Electrician');

  const booking1 = await Booking.create({
    customer_id: customer.user_id,
    worker_id: electrician.profile.worker_id,
    service_id: elecService.service_id,
    date_time: new Date(Date.now() - 3 * 86400000),
    status: 'completed',
    address: 'Dhanmondi 27, Dhaka',
    notes: 'Switchboard sparking and ceiling fan regulator replacement',
    estimated_cost: 700.00,
    accepted_at: new Date(Date.now() - 3 * 86400000 + 15 * 60000),
    started_at: new Date(Date.now() - 3 * 86400000 + 45 * 60000),
    completed_at: new Date(Date.now() - 3 * 86400000 + 120 * 60000),
  });

  await Payment.create({
    booking_id: booking1.booking_id,
    amount: 700.00,
    method: 'mobile_banking',
    status: 'paid',
    transaction_id: `TXN-BKASH-${Date.now()}`,
    paid_at: new Date(Date.now() - 3 * 86400000 + 125 * 60000),
  });

  const review1 = await Review.create({
    booking_id: booking1.booking_id,
    customer_id: customer.user_id,
    worker_id: electrician.profile.worker_id,
    rating: 5.0,
    comment: 'Exceptional work by Karim! Fixed the sparking issue in 20 minutes and ensured everything was safe.',
  });

  // 2. Active booking in_progress
  const plumber = createdProfiles.find((p) => p.serviceName === 'Plumber');
  const plumbService = services.find((s) => s.service_name === 'Plumber');

  const booking2 = await Booking.create({
    customer_id: customer.user_id,
    worker_id: plumber.profile.worker_id,
    service_id: plumbService.service_id,
    date_time: new Date(Date.now() + 86400000),
    status: 'in_progress',
    address: 'Gulshan 2, Road 71, Dhaka',
    notes: 'Kitchen sink pipe blockage and valve replacement',
    estimated_cost: 600.00,
    accepted_at: new Date(Date.now() - 2 * 3600000),
    started_at: new Date(Date.now() - 30 * 60000),
  });

  // 3. Demo dispute on a past completed job
  const carpenter = createdProfiles.find((p) => p.serviceName === 'Carpenter');
  const carpService = services.find((s) => s.service_name === 'Carpenter');

  const booking3 = await Booking.create({
    customer_id: customer.user_id,
    worker_id: carpenter.profile.worker_id,
    service_id: carpService.service_id,
    date_time: new Date(Date.now() - 7 * 86400000),
    status: 'completed',
    address: 'Uttara Sector 4, Dhaka',
    notes: 'Door lock and hinge adjustment',
    estimated_cost: 500.00,
    accepted_at: new Date(Date.now() - 7 * 86400000 + 10 * 60000),
    started_at: new Date(Date.now() - 7 * 86400000 + 30 * 60000),
    completed_at: new Date(Date.now() - 7 * 86400000 + 90 * 60000),
  });

  await Payment.create({
    booking_id: booking3.booking_id,
    amount: 500.00,
    method: 'cash',
    status: 'paid',
    transaction_id: `TXN-CASH-${Date.now()}`,
    paid_at: new Date(Date.now() - 7 * 86400000 + 95 * 60000),
  });

  await Dispute.create({
    booking_id: booking3.booking_id,
    review_id: null,
    raised_by: customer.user_id,
    reason: 'Hinge became loose again next day. Requesting worker to revisit.',
    status: 'under_review',
  });

  // 4. Notifications
  await Notification.create({
    user_id: customer.user_id,
    type: 'booking_accepted',
    message: 'Jahangir Alam accepted your plumbing job for Gulshan 2.',
    is_read: false,
    link: '/bookings',
  });

  await Notification.create({
    user_id: customer.user_id,
    type: 'payment_received',
    message: 'Payment of ৳700 for electrical repair was confirmed via bKash.',
    is_read: true,
    link: '/bookings',
  });

  await Notification.create({
    user_id: admin.user_id,
    type: 'system_alert',
    message: 'Welcome Tasin Islam. System operational with PostgreSQL connected.',
    is_read: false,
    link: '/dashboard',
  });

  console.log('Seed complete!');
  console.log('Demo logins:');
  console.log(' - Founder & Admin: admin@workforce.app / admin123 (Tasin Islam, +8801717408075)');
  console.log(' - Client: customer@workforce.app / customer123 (Tasin Islam)');
  console.log(' - Co-Founder & Client: habib@gmail.com / password123 (Ahosan Habib)');
  console.log(' - Co-Founder & Admin: farhan@workforce.app / password123 (Farhan Ahmed)');
  console.log(' - Worker (Electrician): karim.electrician@workforce.app / worker123');
  console.log(' - Worker (Plumber): jahangir.plumber@workforce.app / worker123');
};

if (require.main === module) {
  seedDatabase({ force: true })
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
