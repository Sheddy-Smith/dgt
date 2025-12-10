# 📁 DGT Marketplace - Production Deployment Structure

## 🚀 Complete Project File & Folder Structure

```
/var/www/dgt-marketplace/
│
├── 📦 node_modules/                 # Dependencies (auto-generated)
│
├── 📁 backend/                      # Node.js Backend API
│   ├── 📁 src/
│   │   ├── 📁 api/                  # REST API Routes
│   │   │   ├── auth.js              # Authentication (OTP, JWT)
│   │   │   ├── listings.js          # Listings CRUD + Boost
│   │   │   ├── users.js             # User Management (Admin)
│   │   │   ├── wallet.js            # Wallet Operations
│   │   │   ├── payments.js          # Razorpay Integration
│   │   │   ├── payouts.js           # Bank Payouts
│   │   │   ├── categories.js        # Category Tree
│   │   │   ├── banners.js           # Banner Management
│   │   │   ├── notifications.js     # User Notifications
│   │   │   ├── reports.js           # Report Moderation
│   │   │   ├── settings.js          # System Settings
│   │   │   └── analytics.js         # Dashboard Analytics
│   │   │
│   │   ├── 📁 services/             # Business Logic
│   │   │   ├── razorpay.service.js  # Payment Gateway
│   │   │   ├── websocket.service.js # Real-time Updates
│   │   │   ├── push.service.js      # Firebase FCM
│   │   │   └── email.service.js     # Nodemailer SMTP
│   │   │
│   │   ├── 📁 middleware/           # Express Middleware
│   │   │   ├── auth.js              # JWT + RBAC
│   │   │   ├── errorHandler.js      # Global Error Handler
│   │   │   └── rateLimiter.js       # Rate Limiting
│   │   │
│   │   ├── 📁 cron/                 # Background Jobs
│   │   │   ├── index.js             # Cron Manager
│   │   │   ├── expireListings.js    # Auto-expire Listings
│   │   │   ├── expiringReminders.js # Email Reminders
│   │   │   └── analyticsSnapshot.js # Daily Metrics
│   │   │
│   │   ├── 📁 config/               # Configuration
│   │   │   └── database.js          # Prisma Client
│   │   │
│   │   ├── 📁 utils/                # Utilities
│   │   │   └── logger.js            # Winston Logger
│   │   │
│   │   └── server.js                # Main Express App
│   │
│   ├── 📁 prisma/                   # Database ORM
│   │   ├── schema.prisma            # 19 Database Models
│   │   └── seed.js                  # Initial Data Seeder
│   │
│   ├── 📁 logs/                     # Application Logs
│   │   ├── combined.log             # All logs
│   │   ├── error.log                # Error logs only
│   │   └── access.log               # HTTP access logs
│   │
│   ├── 📁 uploads/                  # User Uploads
│   │   ├── 📁 listings/             # Listing images
│   │   ├── 📁 kyc/                  # KYC documents
│   │   └── 📁 avatars/              # User avatars
│   │
│   ├── 📄 .env                      # Environment Variables
│   ├── 📄 .env.example              # Environment Template
│   ├── 📄 package.json              # Backend Dependencies
│   ├── 📄 package-lock.json         # Locked Dependencies
│   ├── 📄 ecosystem.config.js       # PM2 Configuration
│   ├── 📄 setup.sh                  # Automated Setup Script
│   ├── 📄 README.md                 # Backend Documentation
│   ├── 📄 API_DOCUMENTATION.md      # API Reference
│   ├── 📄 DEPLOYMENT.md             # Deployment Guide
│   └── 📄 INSTALLATION.md           # Installation Steps
│
├── 📁 admin_panel/                  # Admin Dashboard (Next.js)
│   ├── 📁 src/
│   │   ├── 📁 app/                  # Next.js 15 App Router
│   │   │   ├── 📁 dashboard/        # Main Dashboard
│   │   │   ├── 📁 listings/         # Listing Management
│   │   │   ├── 📁 users/            # User Management
│   │   │   ├── 📁 wallet/           # Finance Management
│   │   │   ├── 📁 ads/              # Boost/Ads Management
│   │   │   ├── 📁 announcements/    # Announcements
│   │   │   ├── 📁 reports/          # Report Queue
│   │   │   ├── 📁 settings/         # 8-Tab Settings
│   │   │   └── 📁 login/            # Admin Login
│   │   │
│   │   ├── 📁 components/           # React Components
│   │   │   ├── admin-layout.tsx     # Admin Shell
│   │   │   ├── sidebar.tsx          # Navigation
│   │   │   └── 📁 ui/               # Shadcn Components
│   │   │
│   │   └── 📁 lib/                  # Utilities
│   │       └── utils.ts             # Helper Functions
│   │
│   ├── 📁 public/                   # Static Assets
│   ├── 📄 next.config.ts            # Next.js Config (basePath: /admin)
│   ├── 📄 tailwind.config.ts        # Tailwind CSS
│   ├── 📄 package.json              # Admin Dependencies
│   └── 📄 .env.local                # Admin Environment
│
├── 📁 src/                          # User App (Next.js)
│   ├── 📁 app/                      # App Router
│   │   ├── page.tsx                 # Homepage
│   │   ├── 📁 listing/[id]/         # Listing Detail
│   │   ├── 📁 listings/             # Listing Search
│   │   ├── 📁 category/[name]/      # Category Pages
│   │   ├── 📁 profile/              # User Profile
│   │   ├── 📁 login/                # User Login
│   │   └── 📁 api/                  # API Routes (Optional)
│   │
│   ├── 📁 components/               # React Components
│   │   ├── 📁 layout/               # Layout Components
│   │   └── 📁 ui/                   # UI Components
│   │
│   └── 📁 lib/                      # Shared Libraries
│       ├── api.ts                   # API Client
│       ├── auth.ts                  # Auth Helpers
│       └── socket.ts                # WebSocket Client
│
├── 📁 prisma/                       # Main App Prisma (SQLite for demo)
│   └── schema.prisma                # Demo Database
│
├── 📁 .next/                        # Next.js Build Output
├── 📁 node_modules/                 # Root Dependencies
│
├── 📄 unified-server.js             # 🔥 Unified Server (User + Admin + Backend)
├── 📄 server.ts                     # Original User App Server
├── 📄 .env                          # Root Environment
├── 📄 package.json                  # Root Dependencies
├── 📄 next.config.ts                # User App Config
├── 📄 tailwind.config.ts            # Tailwind Config
├── 📄 tsconfig.json                 # TypeScript Config
│
├── 📄 DATABASE_SCHEMA.md            # Complete MySQL Schema
├── 📄 DEPLOYMENT_STRUCTURE.md       # This file
├── 📄 COMPLETION_REPORT.md          # Project Completion Summary
├── 📄 PROJECT_SUMMARY.md            # Complete Overview
├── 📄 IMPLEMENTATION_CHECKLIST.md   # Feature Checklist
├── 📄 QUICKSTART.md                 # Quick Start Guide
├── 📄 ARCHITECTURE.md               # System Architecture
└── 📄 README.md                     # Main Documentation
```

---

## 🌐 Server Architecture

### **Option 1: Unified Server (Recommended)** ✅

**Single Node.js process serving all three apps on port 3000:**

```javascript
// unified-server.js
Express Server (Port 3000)
├── /              → User App (Next.js)
├── /admin/*       → Admin Panel (Next.js with basePath)
├── /api/*         → Backend API (Express)
├── /socket.io     → WebSocket Server
└── /health        → Health Check
```

**Advantages:**
- ✅ Single deployment
- ✅ Shared session/authentication
- ✅ Easy local development
- ✅ Lower resource usage
- ✅ Simplified SSL/domain setup

**Run Command:**
```bash
npm run dev:unified     # Development
npm start               # Production
```

---

### **Option 2: Separate Servers**

**Three independent processes:**

```bash
# User App (Port 3000)
cd /var/www/dgt-marketplace
npm run dev

# Admin Panel (Port 3002)
cd /var/www/dgt-marketplace/admin_panel
npm run dev

# Backend API (Port 5000)
cd /var/www/dgt-marketplace/backend
npm run dev
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name dgtmarketplace.com;

    # User App
    location / {
        proxy_pass http://localhost:3000;
    }

    # Admin Panel
    location /admin {
        proxy_pass http://localhost:3002;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 🗄️ Database Setup

### **MySQL Database Structure**

```
MySQL Server (localhost:3306)
└── dgt_marketplace (Database)
    ├── users                    (User accounts)
    ├── kyc_profiles             (KYC verification)
    ├── categories               (Listing categories)
    ├── listings                 (Product listings)
    ├── boost_plans              (Boost packages)
    ├── wallets                  (User wallets)
    ├── wallet_transactions      (All transactions)
    ├── payout_requests          (Bank payouts)
    ├── banners                  (Promotional banners)
    ├── notifications            (User notifications)
    ├── announcements            (Platform announcements)
    ├── reports                  (User/listing reports)
    ├── settings                 (System settings)
    ├── feature_flags            (Feature toggles)
    ├── audit_logs               (Security audit)
    └── analytics_events         (Analytics data)
```

**Creation:**
```sql
CREATE DATABASE dgt_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dgt_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON dgt_marketplace.* TO 'dgt_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📦 Deployment Structure on Hostinger VPS

### **Directory Layout:**
```
/var/www/dgt-marketplace/
├── Current deployment (from Git)
├── .env files (not in Git)
├── uploads/ (user-generated content)
└── logs/ (application logs)

/etc/nginx/sites-available/
└── dgt-marketplace (Nginx config)

/etc/systemd/system/
└── dgt-marketplace.service (PM2 startup)

/var/log/
├── nginx/
│   ├── dgt-access.log
│   └── dgt-error.log
└── pm2/
    └── dgt-backend-*.log
```

### **PM2 Process Management:**
```
PM2 Processes:
├── dgt-unified (Port 3000) - Unified Server
│   ├── Worker 1 (CPU Core 1)
│   ├── Worker 2 (CPU Core 2)
│   └── Worker 3 (CPU Core 3)
└── Auto-restart on crash
```

---

## 🔐 Environment Variables Structure

### **Root .env** (Unified Server)
```bash
# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL="mysql://dgt_user:password@localhost:3306/dgt_marketplace"

# JWT
JWT_SECRET="64-char-secret"
REFRESH_TOKEN_SECRET="64-char-secret"

# Razorpay
RAZORPAY_KEY_ID="rzp_live_xxx"
RAZORPAY_KEY_SECRET="secret_xxx"

# Twilio
TWILIO_ACCOUNT_SID="ACxxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_NUMBER="+1234567890"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="noreply@dgtmarketplace.com"
SMTP_PASS="app_password"

# Firebase
FIREBASE_PROJECT_ID="dgt-marketplace"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@dgt.iam.gserviceaccount.com"

# Storage
STORAGE_PATH="/var/www/dgt-marketplace/uploads"

# Cron
ENABLE_CRON_JOBS=true
```

### **backend/.env** (If running separately)
```bash
NODE_ENV=production
PORT=5000
# ... same as above
```

---

## 🚀 Deployment Workflow

### **1. Initial Setup**
```bash
# Clone repository
git clone <repo-url> /var/www/dgt-marketplace
cd /var/www/dgt-marketplace

# Install dependencies
npm install
cd backend && npm install
cd ../admin_panel && npm install
cd ..

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Setup database
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### **2. Build Applications**
```bash
# Build User App
npm run build:user

# Build Admin Panel
npm run build:admin

# Backend (no build needed, runs directly)
```

### **3. Start with PM2**
```bash
# Start unified server
pm2 start unified-server.js --name dgt-unified -i max

# Or start separately
pm2 start backend/src/server.js --name dgt-backend -i 3
pm2 start npm --name dgt-user -- start
pm2 start npm --name dgt-admin -- run start --prefix admin_panel

# Save PM2 config
pm2 save
pm2 startup
```

### **4. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/dgt-marketplace
sudo ln -s /etc/nginx/sites-available/dgt-marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **5. SSL Certificate**
```bash
sudo certbot --nginx -d dgtmarketplace.com -d www.dgtmarketplace.com
```

---

## 🔄 CI/CD Pipeline (Optional)

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/dgt-marketplace
            git pull origin main
            npm install
            npm run build
            pm2 restart dgt-unified
```

---

## 📊 Resource Requirements

### **Minimum (100-1K users):**
- CPU: 2 cores
- RAM: 4 GB
- Storage: 20 GB SSD
- Bandwidth: 1 TB/month

### **Recommended (1K-10K users):**
- CPU: 4 cores
- RAM: 8 GB
- Storage: 50 GB SSD
- Bandwidth: 3 TB/month

### **Large Scale (10K-100K users):**
- CPU: 8 cores
- RAM: 16 GB
- Storage: 100 GB SSD
- Bandwidth: 10 TB/month
- Load Balancer
- Read Replicas (MySQL)
- Redis Cache

---

## 🛡️ Security Checklist

- [x] Firewall configured (UFW)
- [x] SSL/TLS enabled (Let's Encrypt)
- [x] Environment variables secured
- [x] Database user with limited privileges
- [x] File upload validation
- [x] Rate limiting enabled
- [x] CORS properly configured
- [x] Helmet.js security headers
- [x] Regular backups configured
- [x] Fail2ban for SSH protection

---

## 📁 Backup Strategy

### **Daily Automated Backups:**
```bash
# Database Backup
0 2 * * * mysqldump -u dgt_user -p'password' dgt_marketplace | gzip > /backup/db_$(date +\%Y\%m\%d).sql.gz

# Uploads Backup
0 3 * * * tar -czf /backup/uploads_$(date +\%Y\%m\%d).tar.gz /var/www/dgt-marketplace/uploads

# Keep last 7 days
0 4 * * * find /backup -name "*.gz" -mtime +7 -delete
```

---

## 📈 Monitoring

### **Health Checks:**
```bash
# Application Health
curl http://localhost:3000/health

# PM2 Status
pm2 status

# Database Connection
mysql -u dgt_user -p -e "SELECT 1"

# Disk Usage
df -h

# Memory Usage
free -m
```

### **Log Monitoring:**
```bash
# PM2 Logs
pm2 logs dgt-unified --lines 100

# Nginx Access Logs
tail -f /var/log/nginx/dgt-access.log

# Nginx Error Logs
tail -f /var/log/nginx/dgt-error.log

# Application Logs
tail -f backend/logs/combined.log
```

---

**Structure Version:** 1.0  
**Last Updated:** December 10, 2025  
**Deployment Target:** Ubuntu 22.04 LTS on Hostinger VPS
