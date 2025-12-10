# 🚀 Quick Start Guide - DGT Marketplace

## ⚡ Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env file - Minimum required for local development:
DATABASE_URL="mysql://root:password@localhost:3306/dgt_marketplace"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_REFRESH_SECRET="another-secret-key-min-32-chars"
NODE_ENV=development
PORT=4000
FRONTEND_URL="http://localhost:3000"
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"
```

### Step 3: Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### Step 4: Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start at: **http://localhost:4000**

### Step 5: Test API
```bash
# Health check
curl http://localhost:4000/health

# Send OTP (requires Twilio credentials)
curl -X POST http://localhost:4000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'
```

---

## 📋 Optional: Full Integration Setup

### 1. Razorpay (Payments)
```bash
# Sign up at https://dashboard.razorpay.com/
# Get your API keys
# Add to .env:
RAZORPAY_KEY_ID="rzp_test_xxx"
RAZORPAY_KEY_SECRET="your_secret"
RAZORPAY_WEBHOOK_SECRET="webhook_secret"
```

### 2. Twilio (SMS/OTP)
```bash
# Sign up at https://www.twilio.com/console
# Get credentials
# Add to .env:
TWILIO_ACCOUNT_SID="ACxxx"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### 3. Gmail (Email)
```bash
# Generate App Password in Google Account settings
# Add to .env:
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="app-password"
SMTP_FROM="DGT <noreply@yourdomain.com>"
```

### 4. Firebase (Push Notifications)
```bash
# Create project in Firebase Console
# Download service account JSON
# Add to .env:
FIREBASE_PROJECT_ID="your-project"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@xxx.iam.gserviceaccount.com"
```

---

## 🧪 Testing Without Integrations

You can test most features without external services:

**Working without credentials:**
✅ Listings CRUD  
✅ Categories API  
✅ Wallet balance tracking  
✅ Database operations  

**Requires credentials:**
❌ OTP sending (Twilio)  
❌ Payment processing (Razorpay)  
❌ Email notifications (SMTP)  
❌ Push notifications (Firebase)  

**Workaround:** Use the verification bypass in development mode (implement in code).

---

## 📊 Database Overview

**19 Models Created:**
- User, KycProfile, Category, Listing
- BoostPlan, Wallet, WalletTransaction
- PayoutRequest, Banner, Notification
- Announcement, Report, Setting
- FeatureFlag, AuditLog, AnalyticsEvent

**View in Prisma Studio:**
```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## 🔍 Useful Commands

### Database
```bash
# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Format schema
npx prisma format
```

### Development
```bash
# Start with nodemon (auto-reload)
npm run dev

# Check for errors
npm run lint

# Format code
npm run format
```

### Production
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs dgt-backend

# Restart
pm2 restart dgt-backend

# Stop
pm2 stop dgt-backend
```

---

## 📁 Project Structure
```
backend/
├── src/
│   ├── api/          # Route handlers
│   ├── services/     # Business logic
│   ├── middleware/   # Auth, errors, rate limits
│   ├── cron/         # Scheduled tasks
│   ├── config/       # Database connection
│   └── utils/        # Helpers (logger)
├── prisma/
│   └── schema.prisma # Database models
└── logs/             # Application logs (auto-created)
```

---

## 🐛 Common Issues & Solutions

### Issue: Can't connect to MySQL
```bash
# Check MySQL is running
mysql -u root -p

# Create database manually
CREATE DATABASE dgt_marketplace;
```

### Issue: Prisma errors
```bash
# Regenerate client
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

### Issue: Port already in use
```bash
# Change PORT in .env
PORT=5000

# Or kill process on port 4000
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:4000 | xargs kill -9
```

### Issue: JWT errors
```bash
# Ensure secrets are at least 32 characters
# Generate strong secrets:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📖 Next Steps

1. **Read Documentation**
   - `README.md` - Project overview
   - `API_DOCUMENTATION.md` - API reference
   - `DEPLOYMENT.md` - Production deployment

2. **Customize**
   - Modify Prisma schema for your needs
   - Add custom API routes in `src/api/`
   - Create custom services in `src/services/`

3. **Test APIs**
   - Use Postman/Insomnia
   - Import collection (create one from API docs)
   - Test WebSocket with Socket.IO client

4. **Deploy**
   - Follow `DEPLOYMENT.md` for Hostinger
   - Setup domain & SSL
   - Configure PM2 & Nginx

---

## 🎯 Essential URLs

**Local Development:**
- API: http://localhost:4000
- Health: http://localhost:4000/health
- Prisma Studio: http://localhost:5555
- WebSocket: ws://localhost:4000

**API Endpoints:**
- Auth: `/api/auth/*`
- Listings: `/api/listings/*`
- Wallet: `/api/wallet/*`
- Payments: `/api/payments/*`
- See `API_DOCUMENTATION.md` for complete list

---

## 💡 Pro Tips

1. **Use Prisma Studio** for database inspection
2. **Check logs** in `logs/` folder for debugging
3. **Use PM2** even in development for process management
4. **Enable ENABLE_CRON_JOBS=true** to test scheduled tasks
5. **Test webhooks** with ngrok for local development
6. **Monitor with pm2 monit** for real-time metrics

---

## 🆘 Getting Help

**Check these first:**
1. View server logs: `pm2 logs` or `tail -f logs/app.log`
2. Check database: `npx prisma studio`
3. Test health: `curl http://localhost:4000/health`
4. Verify .env file has all required variables

**Common Checks:**
- ✅ MySQL running?
- ✅ .env file configured?
- ✅ Dependencies installed?
- ✅ Prisma generated?
- ✅ Migrations applied?

---

**Ready to build! 🚀**

Start the server and begin testing your marketplace backend!
