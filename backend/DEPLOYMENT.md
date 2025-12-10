# DGT Marketplace - Backend Deployment Guide (Hostinger VPS)

## Prerequisites
- Hostinger VPS with Ubuntu 20.04/22.04
- Root or sudo access
- Domain name (optional but recommended)

## Step 1: Server Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should be 18.x or higher
```

### 1.3 Install MySQL
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### 1.4 Create Database and User
```bash
sudo mysql
```

```sql
CREATE DATABASE dgt_marketplace;
CREATE USER 'dgt_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';
GRANT ALL PRIVILEGES ON dgt_marketplace.* TO 'dgt_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.5 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

### 1.6 Install Nginx (Reverse Proxy)
```bash
sudo apt install nginx -y
```

## Step 2: Deploy Application

### 2.1 Clone Repository
```bash
cd /var/www
sudo git clone <your-repo-url> dgt-marketplace
cd dgt-marketplace/backend
sudo chown -R $USER:$USER /var/www/dgt-marketplace
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Configure Environment
```bash
cp .env.example .env
nano .env
```

Update the following values in `.env`:
```env
# Database
DATABASE_URL="mysql://dgt_user:your_strong_password_here@localhost:3306/dgt_marketplace"

# JWT
JWT_SECRET="generate_random_32_char_string"
JWT_REFRESH_SECRET="generate_another_random_32_char_string"

# Razorpay (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID="your_key_id"
RAZORPAY_KEY_SECRET="your_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Twilio (SMS - Get from https://www.twilio.com/console)
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

# SMTP (Email)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASSWORD="your_app_password"
SMTP_FROM="DGT Marketplace <noreply@yourdomain.com>"

# Firebase (Push Notifications - Get from Firebase Console)
FIREBASE_PROJECT_ID="your_project_id"
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL="your_client_email"

# Frontend URL
FRONTEND_URL="https://yourdomain.com"
ADMIN_URL="https://admin.yourdomain.com"

# Server
PORT=4000
NODE_ENV=production
CORS_ORIGIN="https://yourdomain.com,https://admin.yourdomain.com"

# Cron Jobs
ENABLE_CRON_JOBS=true
```

### 2.4 Run Database Migrations
```bash
npx prisma generate
npx prisma migrate deploy
```

### 2.5 Seed Database (Optional)
```bash
npx prisma db seed
```

## Step 3: Configure PM2

### 3.1 Start Application
```bash
pm2 start ecosystem.config.js
```

### 3.2 Setup PM2 Startup
```bash
pm2 startup systemd
# Copy and run the command it outputs
pm2 save
```

### 3.3 Monitor Application
```bash
pm2 status
pm2 logs dgt-backend
pm2 monit
```

## Step 4: Configure Nginx

### 4.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/dgt-api
```

Paste the following configuration:
```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name api.yourdomain.com;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.yourdomain.com;

    # SSL certificates (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Proxy settings
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
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

    # File uploads
    client_max_body_size 10M;

    # Logs
    access_log /var/log/nginx/dgt-api-access.log;
    error_log /var/log/nginx/dgt-api-error.log;
}
```

### 4.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/dgt-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: SSL Certificate (HTTPS)

### 5.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d api.yourdomain.com
```

### 5.3 Auto-renewal
```bash
sudo certbot renew --dry-run
```

## Step 6: Firewall Configuration

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

## Step 7: Setup Monitoring & Logging

### 7.1 View Logs
```bash
# PM2 Logs
pm2 logs dgt-backend

# Nginx Logs
sudo tail -f /var/log/nginx/dgt-api-access.log
sudo tail -f /var/log/nginx/dgt-api-error.log

# Application Logs
tail -f /var/www/dgt-marketplace/backend/logs/app.log
```

### 7.2 PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Step 8: Database Backup

### 8.1 Manual Backup
```bash
mysqldump -u dgt_user -p dgt_marketplace > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 8.2 Automated Daily Backup (Cron)
```bash
crontab -e
```

Add this line:
```bash
0 2 * * * mysqldump -u dgt_user -p'your_password' dgt_marketplace > /var/backups/mysql/dgt_$(date +\%Y\%m\%d).sql
```

## Step 9: Performance Optimization

### 9.1 Enable MySQL Query Cache
```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Add:
```ini
[mysqld]
query_cache_type = 1
query_cache_size = 128M
query_cache_limit = 2M
```

### 9.2 Install Redis (Optional - for caching)
```bash
sudo apt install redis-server -y
sudo systemctl enable redis-server
```

## Step 10: Deployment Commands

### Update Application
```bash
cd /var/www/dgt-marketplace/backend
git pull origin main
npm install
npx prisma migrate deploy
pm2 restart dgt-backend
```

### Rollback
```bash
git reset --hard HEAD~1
npm install
npx prisma migrate deploy
pm2 restart dgt-backend
```

## Troubleshooting

### Check Application Status
```bash
pm2 status
pm2 describe dgt-backend
```

### Check Logs
```bash
pm2 logs dgt-backend --lines 100
```

### Restart Services
```bash
pm2 restart dgt-backend
sudo systemctl restart nginx
sudo systemctl restart mysql
```

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u dgt_user -p -h localhost dgt_marketplace
```

## Environment-Specific URLs

- **API**: https://api.yourdomain.com
- **Admin Panel**: https://admin.yourdomain.com
- **User App**: https://yourdomain.com
- **WebSocket**: wss://api.yourdomain.com/socket.io

## Security Checklist

- ✅ Strong database passwords
- ✅ JWT secrets rotated regularly
- ✅ SSL/HTTPS enabled
- ✅ Firewall configured
- ✅ Environment variables secured
- ✅ Regular backups automated
- ✅ PM2 process monitoring
- ✅ Nginx rate limiting (optional)
- ✅ Fail2ban installed (optional)
- ✅ Regular security updates

## Support & Monitoring

### Health Check
```bash
curl https://api.yourdomain.com/health
```

### Performance Metrics
```bash
pm2 monit
```

### Server Resources
```bash
htop  # Install with: sudo apt install htop
```

---

**Deployment completed! 🚀**

Your DGT Marketplace backend is now live on Hostinger VPS.
