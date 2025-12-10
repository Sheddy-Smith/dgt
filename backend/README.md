# DGT Marketplace Backend

Complete backend infrastructure for DGT Marketplace - an OLX-style buy-sell platform.

## 🚀 Features

- **Authentication**: OTP-based login with JWT tokens
- **Listings Management**: Create, update, boost, and sell listings
- **Wallet System**: Integrated wallet with top-up, transactions, and balance tracking
- **Payment Integration**: Razorpay for payments, refunds, and payouts
- **Real-time Updates**: WebSocket support with Socket.IO
- **Push Notifications**: Firebase Cloud Messaging integration
- **Email Service**: Nodemailer with templating
- **SMS Integration**: Twilio for OTP delivery
- **Role-Based Access Control**: Admin, Moderator, Finance roles
- **KYC Verification**: User verification system
- **Reports & Analytics**: Comprehensive reporting system
- **Cron Jobs**: Automated tasks for expiry, reminders, analytics
- **File Management**: Image upload and storage

## 📁 Project Structure

```
backend/
├── src/
│   ├── api/              # API route handlers
│   │   ├── auth.js       # Authentication routes
│   │   ├── listings.js   # Listings management
│   │   ├── wallet.js     # Wallet operations
│   │   ├── payments.js   # Payment processing
│   │   ├── payouts.js    # Payout requests
│   │   ├── categories.js # Category management
│   │   └── notifications.js # Notifications
│   ├── config/           # Configuration files
│   │   └── database.js   # Prisma client
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── rateLimiter.js  # Rate limiting
│   ├── services/         # Business logic services
│   │   ├── razorpay.service.js # Payment gateway
│   │   ├── websocket.service.js # WebSocket
│   │   ├── push.service.js     # Push notifications
│   │   └── email.service.js    # Email service
│   ├── cron/             # Scheduled tasks
│   │   ├── expireListings.js   # Auto-expire listings
│   │   ├── expiringReminders.js # Send reminders
│   │   └── analyticsSnapshot.js # Daily analytics
│   ├── utils/            # Utility functions
│   │   └── logger.js     # Winston logger
│   └── server.js         # Express app initialization
├── prisma/
│   └── schema.prisma     # Database schema
├── .env.example          # Environment variables template
├── ecosystem.config.js   # PM2 configuration
├── package.json
└── DEPLOYMENT.md         # Deployment guide

```

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL with Prisma ORM
- **Real-time**: Socket.IO
- **Payment**: Razorpay
- **SMS**: Twilio
- **Email**: Nodemailer
- **Push**: Firebase Admin SDK
- **Process Manager**: PM2
- **Web Server**: Nginx (reverse proxy)

## 📦 Installation

### 1. Clone Repository
```bash
git clone <repo-url>
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Setup Database
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start Development Server
```bash
npm run dev
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/dgt_marketplace"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Razorpay
RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="xxx"
RAZORPAY_WEBHOOK_SECRET="xxx"

# Twilio
TWILIO_ACCOUNT_SID="xxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_NUMBER="+1234567890"

# SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="app-password"

# Firebase
FIREBASE_PROJECT_ID="your-project"
FIREBASE_PRIVATE_KEY="xxx"
FIREBASE_CLIENT_EMAIL="firebase@xxx.iam.gserviceaccount.com"

# URLs
FRONTEND_URL="http://localhost:3000"
ADMIN_URL="http://localhost:3001"

# Server
PORT=4000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `POST /api/listings/:id/review` - Approve/Reject (Admin)
- `POST /api/listings/:id/boost` - Boost listing
- `POST /api/listings/:id/sold` - Mark as sold

### Wallet
- `GET /api/wallet` - Get wallet details
- `GET /api/wallet/transactions` - Get transaction history
- `GET /api/wallet/stats` - Get wallet statistics

### Payments
- `POST /api/payments/order` - Create Razorpay order
- `POST /api/payments/verify` - Verify and credit wallet
- `POST /api/payments/refund` - Process refund (Admin)
- `POST /api/payments/webhook` - Razorpay webhook handler

### Payouts
- `POST /api/payouts/request` - Request payout
- `GET /api/payouts` - Get user payouts
- `GET /api/payouts/all` - Get all payouts (Admin)
- `POST /api/payouts/:id/process` - Process payout (Admin)
- `POST /api/payouts/:id/reject` - Reject payout (Admin)
- `POST /api/payouts/:id/cancel` - Cancel payout request

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/tree` - Get category tree

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🔄 WebSocket Events

### Client → Server
- `authenticate` - Authenticate socket connection
- `subscribe:listing` - Subscribe to listing updates
- `unsubscribe:listing` - Unsubscribe from listing

### Server → Client
- `wallet:updated` - Wallet balance updated
- `wallet:refunded` - Refund processed
- `listing:new` - New listing created
- `listing:approved` - Listing approved
- `listing:rejected` - Listing rejected
- `listing:updated` - Listing updated
- `payout:requested` - Payout requested
- `payout:processing` - Payout processing
- `payout:rejected` - Payout rejected

## ⏰ Cron Jobs

- **Expire Listings** - Every hour - Auto-expire listings past expiry date
- **Expiring Reminders** - Daily at 9 AM - Send reminders for expiring listings
- **Analytics Snapshot** - Daily at midnight - Capture daily metrics

## 🚀 Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Hostinger VPS deployment guide.

Quick start:
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Setup auto-restart
pm2 startup
pm2 save
```

## 📊 Database Schema

19 Models:
- User (with roles, KYC)
- KycProfile
- Category (hierarchical)
- Listing (with boost, expiry)
- BoostPlan
- Wallet
- WalletTransaction
- PayoutRequest
- Banner
- Notification
- Announcement
- Report
- Setting
- FeatureFlag
- AuditLog
- AnalyticsEvent
- And more...

## 🛡 Security Features

- JWT-based authentication
- Rate limiting on sensitive routes
- CORS configuration
- Helmet.js security headers
- Input validation
- SQL injection prevention (Prisma)
- XSS protection
- CSRF protection
- Secure password hashing

## 📈 Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs dgt-backend

# Health check
curl http://localhost:4000/health
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 License

MIT

## 👥 Support

For issues and questions, contact: support@yourdomain.com
