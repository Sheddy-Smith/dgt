# DGT Marketplace Backend - Complete Installation Guide

## 🎯 Prerequisites

- Ubuntu 20.04 or 22.04 LTS
- Root or sudo access
- Domain name (optional for development)
- Minimum 2GB RAM, 2 CPU cores
- 20GB storage

## 📋 Installation Steps

### 1️⃣ Automated Setup (Recommended)

Run the setup script:
```bash
# Make script executable
chmod +x setup.sh

# Run as root
sudo ./setup.sh
```

This will install:
- Node.js 18.x
- MySQL 8.0
- PM2 (Process Manager)
- Nginx (Web Server)
- Certbot (SSL Certificates)

### 2️⃣ Manual Setup

#### Step 1: Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 2: Install Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should be v18.x.x
```

#### Step 3: Install MySQL
```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
sudo mysql_secure_installation
```

#### Step 4: Create Database
```bash
sudo mysql
```

```sql
CREATE DATABASE dgt_marketplace;
CREATE USER 'dgt_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON dgt_marketplace.* TO 'dgt_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 5: Install PM2
```bash
sudo npm install -g pm2
```

#### Step 6: Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 🚀 Application Setup

### 1. Clone/Upload Project
```bash
cd /var/www
sudo mkdir dgt-marketplace
sudo chown -R $USER:$USER dgt-marketplace
cd dgt-marketplace

# If using git
git clone <your-repo-url> .

# If uploading manually, use SCP/FTP to upload backend folder
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
nano .env
```

**Minimum Required Configuration:**
```env
# Database
DATABASE_URL="mysql://dgt_user:your_strong_password@localhost:3306/dgt_marketplace"

# JWT Secrets (generate with: openssl rand -hex 32)
JWT_SECRET="your-32-char-secret-key-here"
JWT_REFRESH_SECRET="another-32-char-secret-key"

# Server
PORT=4000
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
ADMIN_URL="https://admin.yourdomain.com"
CORS_ORIGIN="https://yourdomain.com,https://admin.yourdomain.com"

# Razorpay (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID="rzp_live_xxxxx"
RAZORPAY_KEY_SECRET="your_secret"
RAZORPAY_WEBHOOK_SECRET="webhook_secret"

# Twilio (SMS/OTP - Get from https://www.twilio.com/console)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_PHONE_NUMBER="+1234567890"

# SMTP (Email)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="DGT Marketplace <noreply@yourdomain.com>"

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@xxx.iam.gserviceaccount.com"

# Cron Jobs
ENABLE_CRON_JOBS=true
```

### 4. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

### 5. Test Locally
```bash
npm run dev
```

Visit: http://localhost:4000/health

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 1.234,
  "environment": "production"
}
```

## 🔧 Production Deployment

### 1. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Run the command it outputs
```

### 2. Configure Nginx

Create config file:
```bash
sudo nano /etc/nginx/sites-available/dgt-api
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/dgt-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Setup SSL (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

Follow the prompts. Certbot will auto-renew.

### 4. Configure Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

## ✅ Verification

### Check Services
```bash
# PM2 Status
pm2 status

# Nginx Status
sudo systemctl status nginx

# MySQL Status
sudo systemctl status mysql

# Application Logs
pm2 logs dgt-backend
```

### Test API
```bash
# Health Check
curl https://api.yourdomain.com/health

# Send OTP (if Twilio configured)
curl -X POST https://api.yourdomain.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'
```

## 🔄 Updates & Maintenance

### Update Application
```bash
cd /var/www/dgt-marketplace/backend
git pull origin main  # or upload new files
npm install
npx prisma migrate deploy
pm2 restart dgt-backend
```

### View Logs
```bash
# PM2 logs
pm2 logs dgt-backend

# Application logs
tail -f logs/app.log
tail -f logs/error.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
# Manual backup
mysqldump -u dgt_user -p dgt_marketplace > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backup (add to crontab)
crontab -e
```

Add:
```bash
0 2 * * * mysqldump -u dgt_user -p'your_password' dgt_marketplace > /var/backups/mysql/dgt_$(date +\%Y\%m\%d).sql
```

### Restore Database
```bash
mysql -u dgt_user -p dgt_marketplace < backup_file.sql
```

## 🐛 Troubleshooting

### PM2 Not Starting
```bash
pm2 logs dgt-backend --err
pm2 describe dgt-backend
```

### Database Connection Issues
```bash
# Test connection
mysql -u dgt_user -p dgt_marketplace

# Check Prisma
npx prisma db pull
```

### Port Already in Use
```bash
# Find process on port 4000
sudo lsof -i :4000
# Kill it
sudo kill -9 <PID>
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
pm2 status

# Check nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## 📊 Monitoring

### Setup Monitoring Dashboard
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### View Metrics
```bash
pm2 monit
```

## 🔐 Security Checklist

- [ ] Strong database passwords
- [ ] JWT secrets are random and secure
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured
- [ ] Environment variables not exposed
- [ ] Regular backups automated
- [ ] PM2 startup enabled
- [ ] Fail2ban installed (optional)
- [ ] Regular security updates

## 📞 Support

For issues:
1. Check logs: `pm2 logs dgt-backend`
2. Verify config: `.env` file
3. Test database: `mysql -u dgt_user -p`
4. Check firewall: `sudo ufw status`
5. Verify domain DNS settings

## 🎉 Success!

Your DGT Marketplace backend is now live!

**URLs:**
- API: https://api.yourdomain.com
- Health: https://api.yourdomain.com/health
- Admin Panel: https://admin.yourdomain.com
- User App: https://yourdomain.com

**Admin Credentials (from seed):**
- Phone: +919999999999
- Name: Super Admin
