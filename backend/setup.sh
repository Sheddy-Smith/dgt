#!/bin/bash

# DGT Marketplace Backend Setup Script
# This script sets up the backend on a fresh Ubuntu server

set -e

echo "🚀 Starting DGT Marketplace Backend Setup..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# Step 1: Update system
echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
apt update && apt upgrade -y

# Step 2: Install Node.js 18.x
echo -e "${YELLOW}Step 2: Installing Node.js 18.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
echo -e "${GREEN}Node.js version: $(node --version)${NC}"
echo -e "${GREEN}NPM version: $(npm --version)${NC}"

# Step 3: Install MySQL
echo -e "${YELLOW}Step 3: Installing MySQL...${NC}"
apt install -y mysql-server

# Start MySQL service
systemctl start mysql
systemctl enable mysql

echo -e "${GREEN}MySQL installed and started${NC}"

# Step 4: Secure MySQL installation
echo -e "${YELLOW}Step 4: Securing MySQL...${NC}"
echo "Please run 'mysql_secure_installation' manually after this script completes"

# Step 5: Install PM2
echo -e "${YELLOW}Step 5: Installing PM2 process manager...${NC}"
npm install -g pm2
echo -e "${GREEN}PM2 installed: $(pm2 --version)${NC}"

# Step 6: Install Nginx
echo -e "${YELLOW}Step 6: Installing Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}Nginx installed and started${NC}"

# Step 7: Setup firewall
echo -e "${YELLOW}Step 7: Configuring firewall...${NC}"
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable
echo -e "${GREEN}Firewall configured${NC}"

# Step 8: Create application directory
echo -e "${YELLOW}Step 8: Creating application directory...${NC}"
mkdir -p /var/www/dgt-marketplace
chown -R $SUDO_USER:$SUDO_USER /var/www/dgt-marketplace
echo -e "${GREEN}Application directory created at /var/www/dgt-marketplace${NC}"

# Step 9: Install Certbot for SSL
echo -e "${YELLOW}Step 9: Installing Certbot for SSL...${NC}"
apt install -y certbot python3-certbot-nginx
echo -e "${GREEN}Certbot installed${NC}"

echo ""
echo -e "${GREEN}=============================================="
echo -e "✅ Base setup completed successfully!"
echo -e "=============================================="
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Clone your repository to /var/www/dgt-marketplace"
echo "2. cd /var/www/dgt-marketplace/backend"
echo "3. npm install"
echo "4. Create and configure .env file"
echo "5. Run MySQL setup: mysql -u root -p"
echo "   CREATE DATABASE dgt_marketplace;"
echo "   CREATE USER 'dgt_user'@'localhost' IDENTIFIED BY 'your_password';"
echo "   GRANT ALL PRIVILEGES ON dgt_marketplace.* TO 'dgt_user'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo "6. npx prisma generate"
echo "7. npx prisma migrate deploy"
echo "8. npx prisma db seed"
echo "9. pm2 start ecosystem.config.js"
echo "10. pm2 save"
echo "11. pm2 startup"
echo ""
echo -e "${GREEN}For SSL certificate, run:${NC}"
echo "certbot --nginx -d api.yourdomain.com"
echo ""
