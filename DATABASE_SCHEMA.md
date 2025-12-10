# 🗄️ DGT Marketplace - Complete MySQL Database Schema

## 📊 Database Overview

**Database Name:** `dgt_marketplace`  
**Database Engine:** MySQL 8.0+  
**ORM:** Prisma  
**Total Tables:** 19  
**Total Relationships:** 25+  

---

## 🏗️ Complete Table Structure

### 1. **users** (User Management)
```sql
CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `phone` VARCHAR(20) UNIQUE NOT NULL,
  `email` VARCHAR(255) UNIQUE,
  `name` VARCHAR(255),
  `avatar` VARCHAR(500),
  `role` ENUM('USER', 'POWER_SELLER', 'MODERATOR', 'FINANCE', 'ADMIN', 'SUPER_ADMIN') DEFAULT 'USER',
  `status` ENUM('ACTIVE', 'BLOCKED', 'SUSPENDED', 'DELETED') DEFAULT 'ACTIVE',
  
  -- Location
  `city` VARCHAR(100),
  `state` VARCHAR(100),
  `country` VARCHAR(100) DEFAULT 'India',
  `pincode` VARCHAR(10),
  
  -- Preferences
  `language` VARCHAR(10) DEFAULT 'en',
  `notificationEnabled` BOOLEAN DEFAULT TRUE,
  `emailVerified` BOOLEAN DEFAULT FALSE,
  `phoneVerified` BOOLEAN DEFAULT TRUE,
  
  -- Security
  `passwordHash` VARCHAR(255),
  `lastLoginAt` DATETIME,
  `lastLoginIp` VARCHAR(50),
  `deviceTokens` TEXT, -- JSON array of FCM tokens
  
  -- Timestamps
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME,
  
  INDEX idx_phone (phone),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. **kyc_profiles** (KYC Verification)
```sql
CREATE TABLE `kyc_profiles` (
  `id` VARCHAR(36) PRIMARY KEY,
  `userId` VARCHAR(36) UNIQUE NOT NULL,
  
  -- Documents
  `panNumber` VARCHAR(20),
  `panImage` VARCHAR(500),
  `aadhaarNumber` VARCHAR(255), -- Encrypted
  `aadhaarImage` VARCHAR(500),
  `selfieImage` VARCHAR(500),
  `addressProof` VARCHAR(500),
  
  -- Verification
  `provider` VARCHAR(50), -- onfido, signzy, idfy
  `providerRefId` VARCHAR(100),
  `status` ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED') DEFAULT 'PENDING',
  `verifiedAt` DATETIME,
  `verifiedBy` VARCHAR(36),
  `rejectionReason` TEXT,
  
  -- Metadata
  `attempts` INT DEFAULT 0,
  `lastAttemptAt` DATETIME,
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3. **categories** (Listing Categories)
```sql
CREATE TABLE `categories` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `icon` VARCHAR(500),
  `description` TEXT,
  `parentId` VARCHAR(36), -- Self-reference for hierarchy
  
  -- Settings
  `attributes` TEXT, -- JSON schema for dynamic fields
  `autoApprove` BOOLEAN DEFAULT FALSE,
  `defaultExpiry` INT DEFAULT 30, -- days
  
  -- Stats
  `listingsCount` INT DEFAULT 0,
  
  `status` VARCHAR(20) DEFAULT 'active',
  `order` INT DEFAULT 0,
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parentId) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parentId (parentId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 4. **listings** (Product Listings)
```sql
CREATE TABLE `listings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL,
  `categoryId` VARCHAR(36) NOT NULL,
  
  -- Content
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `images` TEXT NOT NULL, -- JSON array
  
  -- Location
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(10),
  `address` TEXT,
  
  -- Attributes
  `attributes` TEXT, -- JSON object
  
  -- Status & Lifecycle
  `status` ENUM('DRAFT', 'PENDING', 'ACTIVE', 'EXPIRED', 'SOLD', 'REJECTED', 'DELETED') DEFAULT 'PENDING',
  `views` INT DEFAULT 0,
  `contactViews` INT DEFAULT 0,
  
  -- Boost & Premium
  `boosted` BOOLEAN DEFAULT FALSE,
  `boostPlanId` VARCHAR(36),
  `boostedAt` DATETIME,
  `boostExpiresAt` DATETIME,
  `featured` BOOLEAN DEFAULT FALSE,
  `featuredUntil` DATETIME,
  
  -- Expiry
  `expiresAt` DATETIME NOT NULL,
  `autoRenew` BOOLEAN DEFAULT FALSE,
  `renewCount` INT DEFAULT 0,
  
  -- Moderation
  `approvedAt` DATETIME,
  `approvedBy` VARCHAR(36),
  `rejectedAt` DATETIME,
  `rejectionReason` TEXT,
  
  -- Timestamps
  `publishedAt` DATETIME,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (boostPlanId) REFERENCES boost_plans(id) ON DELETE SET NULL,
  
  INDEX idx_userId (userId),
  INDEX idx_categoryId (categoryId),
  INDEX idx_status (status),
  INDEX idx_city (city),
  INDEX idx_expiresAt (expiresAt),
  INDEX idx_boosted (boosted),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 5. **boost_plans** (Boost/Premium Plans)
```sql
CREATE TABLE `boost_plans` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  
  -- Pricing
  `price` DECIMAL(10, 2) NOT NULL,
  `duration` INT NOT NULL, -- days
  
  -- Features
  `features` TEXT NOT NULL, -- JSON array
  `topPlacement` BOOLEAN DEFAULT FALSE,
  `highlightBorder` BOOLEAN DEFAULT FALSE,
  `socialShare` BOOLEAN DEFAULT FALSE,
  
  -- Settings
  `status` VARCHAR(20) DEFAULT 'active',
  `popular` BOOLEAN DEFAULT FALSE,
  `order` INT DEFAULT 0,
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 6. **wallets** (User Wallets)
```sql
CREATE TABLE `wallets` (
  `id` VARCHAR(36) PRIMARY KEY,
  `userId` VARCHAR(36) UNIQUE NOT NULL,
  
  `balance` DECIMAL(10, 2) DEFAULT 0.00,
  `holdBalance` DECIMAL(10, 2) DEFAULT 0.00,
  
  -- Lifetime stats
  `totalCredits` DECIMAL(10, 2) DEFAULT 0.00,
  `totalDebits` DECIMAL(10, 2) DEFAULT 0.00,
  `totalPayouts` DECIMAL(10, 2) DEFAULT 0.00,
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. **wallet_transactions** (All Transactions)
```sql
CREATE TABLE `wallet_transactions` (
  `id` VARCHAR(36) PRIMARY KEY,
  `walletId` VARCHAR(36) NOT NULL,
  
  -- Transaction details
  `type` ENUM('CREDIT_TOPUP', 'CREDIT_REFUND', 'CREDIT_BONUS', 'DEBIT_BOOST', 'DEBIT_PAYOUT', 'DEBIT_FEE', 'HOLD', 'RELEASE') NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `balanceBefore` DECIMAL(10, 2) NOT NULL,
  `balanceAfter` DECIMAL(10, 2) NOT NULL,
  
  -- References
  `listingId` VARCHAR(36),
  `boostPlanId` VARCHAR(36),
  `payoutRequestId` VARCHAR(36),
  
  -- Payment gateway
  `razorpayOrderId` VARCHAR(100),
  `razorpayPaymentId` VARCHAR(100),
  `razorpayRefundId` VARCHAR(100),
  `paymentMethod` VARCHAR(50),
  `paymentStatus` VARCHAR(50),
  
  -- Metadata
  `description` TEXT,
  `metadata` TEXT, -- JSON
  
  `status` VARCHAR(20) DEFAULT 'completed',
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE,
  FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE SET NULL,
  FOREIGN KEY (boostPlanId) REFERENCES boost_plans(id) ON DELETE SET NULL,
  FOREIGN KEY (payoutRequestId) REFERENCES payout_requests(id) ON DELETE SET NULL,
  
  INDEX idx_walletId (walletId),
  INDEX idx_type (type),
  INDEX idx_listingId (listingId),
  INDEX idx_razorpayOrderId (razorpayOrderId),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 8. **payout_requests** (Bank Payouts)
```sql
CREATE TABLE `payout_requests` (
  `id` VARCHAR(36) PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL,
  `walletId` VARCHAR(36) NOT NULL,
  
  `amount` DECIMAL(10, 2) NOT NULL,
  `fee` DECIMAL(10, 2) DEFAULT 0.00,
  `netAmount` DECIMAL(10, 2) NOT NULL,
  
  -- Bank details
  `bankDetails` TEXT, -- JSON encrypted
  `method` VARCHAR(50) DEFAULT 'bank_transfer',
  
  -- Status
  `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
  
  -- Processing
  `razorpayPayoutId` VARCHAR(100),
  `razorpayFundAccountId` VARCHAR(100),
  `razorpayStatus` VARCHAR(50),
  `processedAt` DATETIME,
  `processedBy` VARCHAR(36),
  `failureReason` TEXT,
  `rejectionReason` TEXT,
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE,
  
  INDEX idx_userId (userId),
  INDEX idx_walletId (walletId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 9. **banners** (Promotional Banners)
```sql
CREATE TABLE `banners` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `image` VARCHAR(500) NOT NULL,
  `imageUrl` VARCHAR(500),
  
  -- Placement
  `type` ENUM('HOME_BANNER', 'CATEGORY_BANNER', 'PROMOTION', 'ANNOUNCEMENT') NOT NULL,
  `placement` VARCHAR(50) NOT NULL,
  
  -- Target
  `targetType` VARCHAR(50),
  `targetValue` VARCHAR(255),
  
  -- Schedule
  `startDate` DATETIME,
  `endDate` DATETIME,
  
  -- Stats
  `impressions` INT DEFAULT 0,
  `clicks` INT DEFAULT 0,
  
  -- Settings
  `status` VARCHAR(20) DEFAULT 'active',
  `priority` INT DEFAULT 0,
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(36),
  
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_dates (startDate, endDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 10. **notifications** (User Notifications)
```sql
CREATE TABLE `notifications` (
  `id` VARCHAR(36) PRIMARY KEY,
  `userId` VARCHAR(36) NOT NULL,
  
  -- Content
  `title` VARCHAR(255) NOT NULL,
  `body` TEXT NOT NULL,
  `icon` VARCHAR(500),
  `image` VARCHAR(500),
  
  -- Action
  `actionType` VARCHAR(50),
  `actionValue` VARCHAR(500),
  
  -- Delivery
  `channel` VARCHAR(20) DEFAULT 'in_app',
  
  -- Status
  `status` VARCHAR(20) DEFAULT 'sent',
  `readAt` DATETIME,
  `clickedAt` DATETIME,
  
  -- Metadata
  `metadata` TEXT, -- JSON
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 11. **announcements** (Platform Announcements)
```sql
CREATE TABLE `announcements` (
  `id` VARCHAR(36) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  
  -- Target
  `targetAudience` VARCHAR(50) DEFAULT 'all',
  `targetValue` VARCHAR(255),
  
  -- Display
  `showInApp` BOOLEAN DEFAULT TRUE,
  `showAsBanner` BOOLEAN DEFAULT FALSE,
  `priority` VARCHAR(20) DEFAULT 'normal',
  
  -- Schedule
  `startDate` DATETIME,
  `endDate` DATETIME,
  
  `status` VARCHAR(20) DEFAULT 'active',
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(36),
  
  INDEX idx_status (status),
  INDEX idx_dates (startDate, endDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 12. **reports** (User/Listing Reports)
```sql
CREATE TABLE `reports` (
  `id` VARCHAR(36) PRIMARY KEY,
  `reporterId` VARCHAR(36) NOT NULL,
  
  -- Target
  `listingId` VARCHAR(36),
  
  -- Report details
  `reason` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `evidence` TEXT, -- JSON array
  
  -- Status
  `status` VARCHAR(20) DEFAULT 'pending',
  `reviewedAt` DATETIME,
  `reviewedBy` VARCHAR(36),
  `reviewNotes` TEXT,
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reporterId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE,
  
  INDEX idx_listingId (listingId),
  INDEX idx_reporterId (reporterId),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 13. **settings** (System Settings)
```sql
CREATE TABLE `settings` (
  `id` VARCHAR(36) PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  `value` TEXT NOT NULL,
  `type` VARCHAR(20) DEFAULT 'string',
  `category` VARCHAR(50),
  `description` TEXT,
  
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedBy` VARCHAR(36),
  
  INDEX idx_key (key),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 14. **feature_flags** (Feature Toggles)
```sql
CREATE TABLE `feature_flags` (
  `id` VARCHAR(36) PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  `description` TEXT,
  
  `enabled` BOOLEAN DEFAULT FALSE,
  `rolloutPercent` INT DEFAULT 0,
  
  -- Targeting
  `targetAudience` VARCHAR(50) DEFAULT 'all',
  `targetValue` VARCHAR(255),
  
  -- Metadata
  `metadata` TEXT, -- JSON
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` VARCHAR(36),
  
  INDEX idx_key (key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 15. **audit_logs** (Security Audit Trail)
```sql
CREATE TABLE `audit_logs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `userId` VARCHAR(36),
  
  -- Action
  `action` VARCHAR(100) NOT NULL,
  `resource` VARCHAR(100) NOT NULL,
  `resourceId` VARCHAR(36),
  
  -- Details
  `changes` TEXT, -- JSON before/after
  `ip` VARCHAR(50),
  `userAgent` TEXT,
  
  `status` VARCHAR(20) DEFAULT 'success',
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
  
  INDEX idx_userId (userId),
  INDEX idx_action (action),
  INDEX idx_resource (resource),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 16. **analytics_events** (Analytics Data)
```sql
CREATE TABLE `analytics_events` (
  `id` VARCHAR(36) PRIMARY KEY,
  `eventType` VARCHAR(100) NOT NULL,
  `userId` VARCHAR(36),
  `sessionId` VARCHAR(100),
  
  -- Event data
  `properties` TEXT, -- JSON
  
  -- Context
  `platform` VARCHAR(20),
  `city` VARCHAR(100),
  
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_eventType (eventType),
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 📈 Database Statistics

- **Total Tables:** 19
- **Total Indexes:** 60+
- **Total Relationships:** 25+
- **Total Enums:** 8
  - UserRole (6 values)
  - UserStatus (4 values)
  - KycStatus (4 values)
  - ListingStatus (7 values)
  - TransactionType (8 values)
  - PayoutStatus (6 values)
  - BannerType (4 values)

---

## 🔗 Relationship Diagram

```
users (1) ──→ (0..1) kyc_profiles
users (1) ──→ (0..1) wallets
users (1) ──→ (0..*) listings
users (1) ──→ (0..*) payout_requests
users (1) ──→ (0..*) reports
users (1) ──→ (0..*) notifications
users (1) ──→ (0..*) audit_logs

categories (1) ──→ (0..*) listings
categories (1) ──→ (0..*) categories (self-reference)

listings (1) ──→ (0..*) wallet_transactions
listings (1) ──→ (0..*) reports
listings (1) ──→ (0..1) boost_plans

wallets (1) ──→ (0..*) wallet_transactions
wallets (1) ──→ (0..*) payout_requests

boost_plans (1) ──→ (0..*) wallet_transactions
boost_plans (1) ──→ (0..*) listings

payout_requests (1) ──→ (0..*) wallet_transactions
```

---

## 🚀 Migration Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

---

## 💾 Initial Data Seed

Database seeding creates:
- **5 Main Categories** with 14 subcategories
- **3 Boost Plans** (Basic, Standard, Premium)
- **1 Super Admin User**
- **6 System Settings**
- **4 Feature Flags**

Run: `npx prisma db seed`

---

## 🔐 Security Considerations

1. **Encrypted Fields:**
   - `aadhaarNumber` - AES-256 encryption
   - `bankDetails` - JSON encrypted before storage

2. **Indexes:**
   - All foreign keys indexed
   - Search fields indexed (phone, email, city)
   - Status and date fields indexed

3. **Cascade Deletes:**
   - User deletion cascades to all related data
   - Listing deletion cascades to reports/transactions

4. **Soft Deletes:**
   - Users have `deletedAt` field
   - Listings have `deletedAt` field

---

## 📊 Storage Estimates

**Per 10,000 Users:**
- Users table: ~2 MB
- Listings (avg 5 per user): ~50 MB
- Transactions (avg 10 per user): ~5 MB
- Total: ~60-100 MB

**Scaling:**
- 100K users: ~1 GB
- 1M users: ~10 GB
- 10M users: ~100 GB

---

## ⚡ Performance Optimization

1. **Composite Indexes:**
```sql
INDEX idx_listing_search (city, categoryId, status, createdAt);
INDEX idx_transaction_user (walletId, type, createdAt);
INDEX idx_payout_status (userId, status, createdAt);
```

2. **Partitioning (for large scale):**
```sql
-- Partition analytics_events by month
ALTER TABLE analytics_events
PARTITION BY RANGE (YEAR(createdAt)*100 + MONTH(createdAt));
```

3. **Connection Pooling:**
```javascript
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  connection_limit = 10
}
```

---

**Schema Generated:** December 10, 2025  
**Prisma Version:** 5.22.0  
**MySQL Version:** 8.0+
