# WorkForce — On-Demand Workforce Management System

**Developed by:** Tasin Islam  
**Phone:** [+8801717408075](tel:+8801717408075)  
**Facebook:** [Tasin Islam Riju](https://www.facebook.com/tasinislam.riju)  
**WhatsApp:** [Chat on WhatsApp](https://wa.me/qr/HFFRHGPGCI6PL1)  

A complete, production-grade full-stack local worker hiring platform connecting customers with verified local tradespeople (Electricians, Plumbers, Painters, Carpenters, Gardeners, Cleaners). Built directly from the official 10-table Database ER Diagram and integrated end-to-end with PostgreSQL 18.

---

## 🚀 Live Tech Stack
- **Database:** PostgreSQL 18 (Sequelize ORM, UUID PKs, ENUM types, Foreign Keys & Constraints)
- **Backend API:** Node.js, Express.js, JWT Authentication, bcrypt, CORS, Helmet
- **Frontend UI:** React 18, Vite, Tailwind CSS, Framer Motion, React Icons, Axios, React Router 6, react-hot-toast

---

## 📊 Database Architecture (10 ER Diagram Tables)
Fully implemented in PostgreSQL (`workforce_platform` database) matching the ER diagram specifications:
1. `users` — UUID PK, Name, Email (UNIQUE), Phone (UNIQUE), Password (bcrypt), Role (`customer`, `worker`, `admin`), Location
2. `worker_profiles` — UUID PK, User ID (FK UNIQUE), Service Type, Experience, Rating (0.00-5.00), Skills, Completed Jobs
3. `availabilities` — UUID PK, Worker ID (FK), Day of Week (VARCHAR 20), Start Time, End Time
4. `services` — UUID PK, Service Name (UNIQUE), Type, Description, Icon
5. `worker_service_offers` — Worker ID (PK/FK), Service ID (PK/FK), Hourly Rate, Fixed Price
6. `bookings` — UUID PK, Customer ID (FK), Worker ID (FK), Service ID (FK), Date Time, Status (`pending`, `accepted`, `in_progress`, `completed`, `cancelled`), Notes, Address, Cost
7. `payments` — UUID PK, Booking ID (FK UNIQUE), Amount, Method (`mobile_banking`, `card`, `cash`), Status (`pending`, `paid`, `failed`, `refunded`), Transaction ID (UNIQUE), Paid At
8. `reviews` — UUID PK, Booking ID (FK UNIQUE), Customer ID (FK), Worker ID (FK), Rating (1.0-5.0), Comment
9. `disputes` — UUID PK, Booking ID (FK), Review ID (FK Nullable), Raised By (FK), Reason, Status (`open`, `under_review`, `resolved`, `rejected`), Created At, Resolved At
10. `notifications` — UUID PK, User ID (FK), Type, Message, Is Read, Sent At

---

## ⚡ Quick Start

### 1. Database Configuration
PostgreSQL is running locally on port `5432` with database `workforce_platform`.
Configuration in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://postgres:Tasin12345@localhost:5432/workforce_platform
PGHOST=localhost
PGPORT=5432
PGDATABASE=workforce_platform
PGUSER=postgres
PGPASSWORD=Tasin12345
PG_SSL=false
JWT_SECRET=tasin_workforce_platform_jwt_secret_key_2026_super_secure
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 2. Seed Database
```bash
cd backend
npm run seed
```
Creates all 10 tables in PostgreSQL and populates them with demo users, workers, services, active & completed bookings, settled payments, customer reviews, and disputes.

### 3. Run Backend API
```bash
cd backend
npm run dev # Or: node server.js (starts on http://localhost:5000)
```

### 4. Run Frontend UI
```bash
cd frontend
npm run dev # Starts Vite server on http://localhost:5173 (proxies /api -> :5000)
```

---

## 🔑 Demo Login Accounts

| Role | Name | Email | Password | Phone |
|---|---|---|---|---|
| **Admin** | Tasin Islam | `admin@workforce.app` | `admin123` | `+8801717408075` |
| **Customer** | Tasin Islam | `customer@workforce.app` | `customer123` | `+8801700000001` |
| **Worker (Electrician)** | Karim Sheikh | `karim.electrician@workforce.app` | `worker123` | `+8801222222222` |
| **Worker (Plumber)** | Jahangir Alam | `jahangir.plumber@workforce.app` | `worker123` | `+8801444444444` |

---

## 💡 Key Features Implemented
- **Full Auth System:** JWT authentication, role guards (Customer, Worker, Admin), bcrypt password hashing.
- **Worker Search & Profiles:** Filter workers by trade, rating, price, and view verified badges and past reviews.
- **Job Ticket Dispatch System:** Booking requests, status progression (`pending` → `accepted` → `in_progress` → `completed`), and cancellation logic.
- **Payments Management:** Payment settlement via Mobile Banking (bKash/Nagad), Card, or Cash with transaction ID receipts stored in Postgres.
- **Dispute Resolution System:** Customers and workers can raise disputes on jobs; administrators can review, resolve, or reject disputes.
- **Real-Time Notifications:** Dynamic alerts for booking updates, received payments, and dispute resolutions.
- **Tasin Islam Contact Integration:** Direct phone calling (`+8801717408075`), Facebook link, WhatsApp chat link, and floating WhatsApp support widget.
