const path = require('path');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { sequelize, Service } = require('./models');
const { seedDatabase } = require('./utils/seed');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
);
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

let isDbInitialized = false;
let dbInitPromise = null;

const ensureDb = async () => {
  if (isDbInitialized) return;
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      await connectDB();
      await sequelize.sync();
      await sequelize.query('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 1;').catch(() => {});
      try {
        const count = await Service.count();
        if (count === 0) {
          console.log('Database is empty. Automatically initializing demo data...');
          await seedDatabase({ force: false });
        } else {
          const { User } = require('./models');
          const seedAvatars = [
            { email: 'admin@workforce.app', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
            { email: 'customer@workforce.app', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
            { email: 'habib@gmail.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
            { email: 'farhan@workforce.app', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
            { email: 'karim.electrician@workforce.app', avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80' },
            { email: 'nasrin.painter@workforce.app', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
            { email: 'jahangir.plumber@workforce.app', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
            { email: 'salma.gardener@workforce.app', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
            { email: 'rafiq.carpenter@workforce.app', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
            { email: 'moushumi.cleaner@workforce.app', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
          ];
          for (const item of seedAvatars) {
            await User.update({ avatar: item.avatar }, { where: { email: item.email, avatar: ['', null] } }).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Auto-seed check warning:', err.message);
      }
      isDbInitialized = true;
    })();
  }
  return dbInitPromise;
};

// Database connection readiness middleware for serverless invocations
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await ensureDb();
    } catch (err) {
      console.warn('DB readiness warning:', err.message);
    }
  }
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'workforce-backend' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/disputes', require('./routes/disputes'));
app.use('/api/notifications', require('./routes/notifications'));

// Serve frontend dist if available (Production / Render unified deployment)
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// On regular servers (local / Render), start listening on PORT
if (!process.env.VERCEL) {
  const start = async () => {
    await ensureDb();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  };
  start();
}

module.exports = app;
