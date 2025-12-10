# DGT Marketplace - System Architecture

## 🧭 High-Level Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   User App      │         │  Admin Panel    │
│   (Next.js)     │         │   (Next.js)     │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │    REST API + WebSocket   │
         └───────────┬───────────────┘
                     │
         ┌───────────▼────────────┐
         │   Backend API Layer    │
         │   (Next.js API Routes) │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   Services Layer       │
         ├────────────────────────┤
         │ • Identity & RBAC      │
         │ • Listing Service      │
         │ • Payments/Wallet      │
         │ • Promotions/Ads       │
         │ • Notifications        │
         │ • KYC                  │
         │ • Analytics            │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   Data Layer           │
         ├────────────────────────┤
         │ • PostgreSQL (Prisma)  │
         │ • Redis (Cache/Queue)  │
         │ • S3/Cloud Storage     │
         └────────────────────────┘
```

## 🔌 Connectivity Modes

### 1. Synchronous (REST/HTTP)
- **User App → API**: Listings, renew, boost purchase, wallet, KYC, search
- **Admin → API**: Approve/reject, block/unblock, refunds, payouts, banners
- **Standards**: REST JSON, pagination, ETag caching, idempotency

### 2. Asynchronous (Events + WebSocket)
- **Real-time channels**: Both apps subscribe
- **Queue workers**: Background processing with BullMQ
- **Push notifications**: FCM/WebPush for transactional events

## 🧱 Service Boundaries

### Identity & RBAC
- OTP authentication
- JWT token minting (short-lived access + refresh)
- Role-based permissions

### Listing Service
- CRUD operations
- Moderation state machine
- Expiry management
- Boost linking

### Payments/Wallet
- Ledger management
- Refunds & payouts
- Transaction invoices
- Idempotent operations

### Promotions/Ads
- Banner management
- Campaign tracking
- Coupon system

### Notifications
- Template management
- Multi-channel routing (Push/SMS/Email)
- Delivery logs

### KYC
- Provider webhooks
- Verification lifecycle
- Document management

### Analytics
- Event ingestion
- Dashboard aggregates
- Report generation

## 🗺️ Data Contracts

### Listing Schema
```typescript
interface Listing {
  id: string
  userId: string
  title: string
  price: number
  categoryId: string
  city: string
  status: 'pending' | 'active' | 'rejected' | 'expired'
  expiryAt: Date
  boostPlanId?: string
  flagsCount: number
  riskScore: number
  createdAt: Date
  updatedAt: Date
}
```

### Wallet/Transaction Schema
```typescript
interface Wallet {
  userId: string
  balance: number
  holdAmount: number
}

interface Transaction {
  id: string
  type: 'credit' | 'debit' | 'refund' | 'payout'
  amount: number
  refId: string // listing/boost reference
  gateway?: string
  status: 'pending' | 'completed' | 'failed'
  meta: Record<string, any>
}
```

### Notification Schema
```typescript
interface Notification {
  id: string
  userId: string
  templateKey: string
  payload: Record<string, any>
  channel: 'push' | 'sms' | 'email'
  status: 'sent' | 'delivered' | 'failed' | 'read'
  msgProviderId?: string
}
```

## 🔄 Key Flows

### 1. Listing Approve/Reject
```
User creates listing → status=pending
    ↓
Admin reviews → Approve/Reject
    ↓
API updates status → emit listings.update event
    ↓
User App receives event → Update UI + Push notification
    ↓
Search index refresh (async)
    ↓
Audit log created
```

### 2. Expiry & Renew
```
Nightly job scans → Mark expiring (T-3, T-1)
    ↓
Send reminder notifications
    ↓
On expiry → status=expired + listings.update event
    ↓
User renews → Extend expiryAt + Optional boost upsell
    ↓
Admin can force-extend (reason logged)
```

### 3. Boost Purchase
```
User selects plan → Wallet debit (atomic)
    ↓
Listing tagged as boosted → Priority feed
    ↓
emit listings.update + Analytics record
    ↓
On plan end → Auto unboost + event
```

### 4. Refund Flow
```
Admin issues refund → Ledger credit
    ↓
emit wallet.update event
    ↓
User App updates balance live
    ↓
Push notification + Receipt in wallet
    ↓
Finance dashboard tallies + Audit trail
```

### 5. Payout Flow
```
User requests payout → payoutRequest: pending
    ↓
Admin reviews → Approve
    ↓
Gateway API call → Status: paid/failed
    ↓
emit wallet.update event
    ↓
On failure → Auto refund to wallet
    ↓
Email receipt + Reconciliation job
```

### 6. Banner/Settings Publish
```
Content publishes banner/category change
    ↓
emit settings.update event
    ↓
User App refreshes home & forms
    ↓
Cache bust + TTL (5-10 min)
```

### 7. Block/Unblock User
```
Admin blocks user → Reason + Duration
    ↓
emit user.blocked event
    ↓
User App receives → Force logout + Banner
    ↓
Unblock reverses (reason required)
```

## 🧵 WebSocket Event Types

```typescript
// Event channels
type EventChannel = 
  | 'listings.update'
  | 'wallet.update'
  | 'notify.push'
  | 'settings.update'
  | 'user.blocked'

// Event payloads
interface ListingUpdateEvent {
  id: string
  status: string
  expiryAt?: Date
  boost?: {
    planId: string
    endsAt: Date
  }
}

interface WalletUpdateEvent {
  userId: string
  balance: number
  txn: {
    id: string
    type: string
    amount: number
    status: string
  }
}

interface NotifyPushEvent {
  userId: string
  templateKey: string
  payload: Record<string, any>
  priority: 'high' | 'normal'
}

interface SettingsUpdateEvent {
  keys: string[]
}

interface UserBlockedEvent {
  userId: string
  reason: string
  until?: Date
}
```

## 🕰️ Background Jobs

### Cron Schedule
```typescript
// Every minute
- Deliver pending events
- Queue retries with backoff

// Hourly
- Scan expiring listings (T-72, T-24)
- Send reminder push notifications

// Daily (2 AM)
- Payout reconciliation
- Search reindex
- Database backup
- Analytics aggregation

// Real-time (Webhooks)
- OTP callbacks
- Payment gateway webhooks
- KYC provider webhooks
```

## 🔐 Security & Governance

### Authentication
- Short-lived JWT access tokens (15 min)
- Refresh tokens (7 days)
- Role claims in JWT payload
- Device fingerprinting

### Authorization
- Field-level PII masking
- Unmask requires reason → Audit log
- RBAC middleware on all routes

### Rate Limiting
```typescript
// Limits per user/IP
- OTP: 5 requests / hour
- Listing create: 10 / day
- Payout: 3 / day
- API general: 100 / minute
```

### Data Protection
- Idempotency-Key for payment operations
- CSRF tokens for web admin
- CORS locked to known origins
- Secrets in environment vault
- Audit logs for all mutations

### Backups
- Nightly automated backups
- Point-in-time recovery (7 days)
- Quarterly restore drills

## 📈 Performance & Caching

### Caching Strategy
```typescript
// CDN/Edge cache (public data)
- Categories: 1 hour
- Banners: 10 minutes
- Boost plans: 1 hour

// Redis cache (dynamic data)
- User session: 15 minutes
- Listing views count: 1 minute
- Config flags: 5 minutes

// Database indexes
- (city, category, status, createdAt)
- (userId, status, expiryAt)
- (categoryId, status, price)
```

### Pagination
- Cursor-based for listings
- Limit: 20-50 items per page
- Include `nextCursor` in response

### Search
- Algolia/ElasticSearch (optional)
- Async indexing on listing changes
- Full-text + faceted search

## 🧪 Reliability & Observability

### SLAs
```typescript
// Critical events delivery
- Approve/Reject/Block/Refund: p95 < 3s

// OTP delivery
- Median < 5s
- Success rate > 98%

// Payout reconciliation
- Webhook processing < 15 min

// API uptime
- Core endpoints: 99.9%
- Push delivery: 99%
```

### Monitoring
- Request ID correlation across services
- Distributed tracing (OpenTelemetry)
- Error rate dashboards
- Queue lag monitoring
- Dead-letter queue for failed jobs

### Error Handling
```typescript
// Uniform error codes
enum ErrorCode {
  E_VALIDATION = 'VALIDATION_ERROR',
  E_AUTH = 'AUTHENTICATION_ERROR',
  E_RATE_LIMIT = 'RATE_LIMIT_EXCEEDED',
  E_GATEWAY_FAIL = 'GATEWAY_ERROR',
  E_CONFLICT = 'CONFLICT_ERROR'
}

// Error response format
interface ErrorResponse {
  code: ErrorCode
  message: string
  details?: Record<string, any>
  requestId: string
}
```

## 🧩 API Endpoints

### Listings
```
POST   /api/listings              - Create listing
GET    /api/listings              - List with filters
GET    /api/listings/:id          - Get details
PUT    /api/listings/:id          - Update listing
POST   /api/listings/:id/approve  - Admin approve
POST   /api/listings/:id/reject   - Admin reject
POST   /api/listings/:id/renew    - User renew
POST   /api/listings/:id/boost    - Purchase boost
DELETE /api/listings/:id          - Soft delete
```

### Wallet
```
GET    /api/wallet                - Get balance
GET    /api/wallet/transactions   - Transaction history
POST   /api/wallet/payout         - Request payout
POST   /api/wallet/refund         - Admin refund (admin only)
```

### KYC
```
GET    /api/kyc                   - Get KYC status
POST   /api/kyc                   - Submit KYC
POST   /api/kyc/webhook           - Provider webhook
PUT    /api/kyc/verify            - Admin verify (admin only)
```

### Promotions
```
GET    /api/ads/banners           - Get banners by placement
POST   /api/ads/banners           - Create banner (admin only)
GET    /api/boost/plans           - Get boost plans
POST   /api/boost/purchase        - Purchase boost
```

### Settings
```
GET    /api/settings/categories   - Get categories
GET    /api/settings/flags        - Get feature flags
POST   /api/settings/*            - Update settings (admin only)
```

### Auth
```
POST   /api/auth/send-otp         - Send OTP
POST   /api/auth/verify-otp       - Verify & login
POST   /api/auth/refresh          - Refresh token
POST   /api/auth/logout           - Logout
```

### Analytics
```
POST   /api/analytics/events      - Batch event ingestion
GET    /api/analytics/reports     - Get report data (admin only)
```

## 🧰 Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js 14 (API Routes)
- **ORM**: Prisma
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Queue**: BullMQ
- **WebSocket**: Socket.io

### External Services
- **Storage**: AWS S3 / Cloudinary
- **CDN**: CloudFront / Cloudflare
- **Push**: FCM (Firebase Cloud Messaging)
- **SMS**: Twilio / SNS
- **Email**: SendGrid / SES
- **Payments**: Razorpay / Stripe
- **KYC**: Aadhaar API / DigiLocker

### DevOps
- **Container**: Docker
- **Orchestration**: Docker Compose / Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Prometheus + Grafana
- **Logging**: Winston + ELK Stack

## 🧪 Test Matrix

### Connectivity Tests
- ✅ Approve → User badge update (<3s)
- ✅ Reject → Push reason + state hidden
- ✅ Expire → Hidden from search; renew works
- ✅ Refund → Wallet credit + receipt; event fires
- ✅ Payout approve/fail → Status + wallet adjust
- ✅ Banner publish → Home refresh (event + cache bust)
- ✅ Block → Force logout; unblock restores access

### Load Tests
- 1000 concurrent users
- 10,000 listings
- 100 events/second
- Response time p95 < 500ms

## 🧷 Governance

### Change Management
- Two-person approval for high-impact changes
- Feature flags for gradual rollouts
- Blue-green deployments
- Event payload versioning

### Data Access
- PII access requires reason prompt
- Default masked view
- Audit trail for all access
- GDPR/DPDP compliance

### Retention Policy
- Transactions: 7 years
- Disputes: 3 years
- Audit logs: 5 years
- Analytics: 2 years (aggregated)
- User data: Until account deletion + 30 days

## 🧲 Consistency Guarantees

### Strong Consistency
- Read-your-writes (same node/transaction)
- Single-item operations
- Critical financial transactions

### Eventual Consistency
- Search indexes
- Analytics dashboards
- Cached data
- Cross-region replication

### Outbox Pattern
- Reliable event emission on DB commit
- Ensures events never lost
- Exactly-once processing with idempotency

## 📊 Deployment Environments

### Development
- Local PostgreSQL
- Redis local
- Mock payment gateway
- Debug logging enabled

### Staging
- Sandbox payment gateway
- Test notifications
- Performance profiling
- Integration testing

### Production
- HA database cluster
- Redis cluster
- Real payment gateway
- Minimal logging
- Monitoring alerts

---

**Version**: 1.0  
**Last Updated**: December 10, 2025  
**Owner**: DGT Tech Team
