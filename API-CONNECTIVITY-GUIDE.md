# API & Connectivity Implementation Guide

## 🚀 Quick Start

### Prerequisites
```bash
npm install ioredis bullmq socket.io socket.io-client jsonwebtoken
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dgt"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret"

# Socket.IO
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"

# External Services
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
FCM_SERVER_KEY="..."
TWILIO_ACCOUNT_SID="..."
TWILIO_AUTH_TOKEN="..."
AWS_S3_BUCKET="dgt-assets"
AWS_ACCESS_KEY="..."
AWS_SECRET_KEY="..."
```

## 📡 API Implementation Checklist

### ✅ Created Files

#### **Event System**
- [x] `src/lib/events.ts` - Event types and emitter
- [x] `src/hooks/useRealtimeEvents.ts` - User App event hooks
- [x] `admin_panel/src/hooks/useAdminEvents.ts` - Admin event hooks

#### **API Endpoints**
- [x] `src/app/api/listings/[id]/approve/route.ts`
- [x] `src/app/api/listings/[id]/reject/route.ts`
- [x] `src/app/api/wallet/refund/route.ts`
- [x] `src/app/api/admin/users/[id]/block/route.ts`
- [x] `src/app/api/settings/banners/route.ts`

#### **Middleware**
- [x] `src/lib/middleware/auth.ts` - Authentication
- [x] `src/lib/middleware/rate-limit.ts` - Rate limiting
- [x] `src/lib/middleware/audit.ts` - Audit logging

#### **Background Jobs**
- [x] `src/lib/jobs/expiry-reminder.ts`
- [x] `src/lib/jobs/payout-reconciliation.ts`

## 🔌 Integration Steps

### Step 1: Setup Prisma Schema

Add missing models to `prisma/schema.prisma`:

```prisma
model AuditLog {
  id         String   @id @default(cuid())
  action     String
  entityType String
  entityId   String
  userId     String
  reason     String?
  metadata   Json?
  ipAddress  String
  requestId  String
  createdAt  DateTime @default(now())
  
  user       User     @relation(fields: [userId], references: [id])
  
  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
}

model EventOutbox {
  id        String   @id @default(cuid())
  channel   String
  payload   Json
  timestamp DateTime
  requestId String
  status    String   @default("pending") // pending|sent|failed
  attempts  Int      @default(0)
  createdAt DateTime @default(now())
  
  @@index([status])
  @@index([createdAt])
}

model Banner {
  id        String    @id @default(cuid())
  placement String    // home|category|search
  title     String
  imageUrl  String
  link      String?
  startDate DateTime
  endDate   DateTime?
  priority  Int       @default(0)
  status    String    @default("active") // active|inactive
  createdBy String
  createdAt DateTime  @default(now())
  
  creator   User      @relation(fields: [createdBy], references: [id])
  
  @@index([placement, status])
}

model Payout {
  id          String    @id @default(cuid())
  userId      String
  amount      Float
  status      String    @default("pending") // pending|completed|failed
  gatewayId   String?
  completedAt DateTime?
  failedAt    DateTime?
  failureReason String?
  createdAt   DateTime  @default(now())
  
  user        User      @relation(fields: [userId], references: [id])
  
  @@index([userId, status])
  @@index([status, createdAt])
}

// Add to Transaction model
model Transaction {
  idempotencyKey String? @unique
  // ... existing fields
}

// Add to Listing model
model Listing {
  reminderSent3d Boolean @default(false)
  reminderSent1d Boolean @default(false)
  expiredAt     DateTime?
  // ... existing fields
}

// Add to User model
model User {
  blockedAt    DateTime?
  blockUntil   DateTime?
  blockReason  String?
  // ... existing fields
  
  auditLogs    AuditLog[]
  banners      Banner[]
  payouts      Payout[]
}
```

Run migration:
```bash
npx prisma migrate dev --name add_connectivity_models
npx prisma generate
```

### Step 2: Setup Socket.IO Server

Create `server-socket.ts`:

```typescript
import { createServer } from 'http'
import { Server } from 'socket.io'
import { parse } from 'url'
import next from 'next'
import { verify } from 'jsonwebtoken'
import { EventEmitter } from './src/lib/events'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3001

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  // Attach to event emitter
  EventEmitter.getInstance().setSocketServer(io)

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    
    if (!token) {
      return next(new Error('Authentication required'))
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!)
      socket.data.user = decoded
      next()
    } catch (error) {
      next(new Error('Invalid token'))
    }
  })

  // Connection handler
  io.on('connection', (socket) => {
    const userId = socket.data.user.sub
    console.log(`[Socket] User connected: ${userId}`)

    // Join user-specific room
    socket.join(`user:${userId}`)

    // Admin joins admin room
    if (['admin', 'moderator'].includes(socket.data.user.role)) {
      socket.join('admin')
    }

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${userId}`)
    })
  })

  server.listen(port, () => {
    console.log(`> Socket.IO server ready on http://localhost:${port}`)
  })
})
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "node server-socket.ts",
    "dev:app": "next dev",
    "dev:socket": "nodemon server-socket.ts"
  }
}
```

### Step 3: Setup BullMQ Queues

Create `src/lib/queues.ts`:

```typescript
import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'

const connection = new Redis(process.env.REDIS_URL!)

// Notification Queue
export const notificationQueue = new Queue('notifications', { connection })

const notificationWorker = new Worker(
  'notifications',
  async (job) => {
    const { userId, templateKey, payload, channel, priority } = job.data
    
    console.log('[Worker] Sending notification', { userId, templateKey })
    
    // Send push notification via FCM
    if (channel === 'push') {
      await sendPushNotification(userId, templateKey, payload)
    }
    
    // Send SMS via Twilio
    if (channel === 'sms') {
      await sendSMS(userId, payload)
    }
    
    // Send email via SendGrid
    if (channel === 'email') {
      await sendEmail(userId, templateKey, payload)
    }
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 100,
      duration: 1000 // 100 per second
    }
  }
)

// Search Index Queue
export const searchQueue = new Queue('search', { connection })

const searchWorker = new Worker(
  'search',
  async (job) => {
    const { listingId, action } = job.data
    
    if (action === 'upsert') {
      // Update Algolia/ElasticSearch
      console.log('[Worker] Indexing listing', listingId)
    } else if (action === 'delete') {
      // Remove from index
      console.log('[Worker] Removing from index', listingId)
    }
  },
  { connection }
)

// Analytics Queue
export const analyticsQueue = new Queue('analytics', { connection })

const analyticsWorker = new Worker(
  'analytics',
  async (job) => {
    const { events } = job.data
    
    // Batch insert to analytics DB
    console.log('[Worker] Processing analytics batch', events.length)
  },
  { connection }
)

// Helpers
async function sendPushNotification(userId: string, templateKey: string, payload: any) {
  // FCM implementation
}

async function sendSMS(userId: string, payload: any) {
  // Twilio implementation
}

async function sendEmail(userId: string, templateKey: string, payload: any) {
  // SendGrid implementation
}
```

### Step 4: Setup Cron Jobs

Create `src/lib/cron.ts`:

```typescript
import cron from 'node-cron'
import { expiryReminderJob } from './jobs/expiry-reminder'
import { payoutReconciliationJob } from './jobs/payout-reconciliation'

export function startCronJobs() {
  // Hourly: Expiry reminders
  cron.schedule('0 * * * *', expiryReminderJob)
  
  // Daily at 2 AM: Payout reconciliation
  cron.schedule('0 2 * * *', payoutReconciliationJob)
  
  // Every 5 minutes: Process event outbox
  cron.schedule('*/5 * * * *', processEventOutbox)
  
  // Daily at 3 AM: Database backup
  cron.schedule('0 3 * * *', backupDatabase)
  
  console.log('[Cron] All jobs scheduled')
}

async function processEventOutbox() {
  // Retry failed events from outbox
}

async function backupDatabase() {
  // Trigger backup
}
```

Add to `server-socket.ts`:
```typescript
import { startCronJobs } from './src/lib/cron'

app.prepare().then(() => {
  // ... existing code
  
  startCronJobs()
  
  server.listen(port, () => {
    console.log(`> Ready with cron jobs`)
  })
})
```

### Step 5: User App Integration

Update `src/app/listings/[id]/page.tsx`:

```typescript
'use client'

import { useListingUpdates } from '@/hooks/useRealtimeEvents'

export default function ListingPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState(null)
  
  // Real-time updates
  const realtimeListing = useListingUpdates(params.id)
  
  useEffect(() => {
    if (realtimeListing) {
      setListing((prev) => ({ ...prev, ...realtimeListing }))
    }
  }, [realtimeListing])
  
  // ... rest of component
}
```

Update `src/app/wallet/page.tsx`:

```typescript
'use client'

import { useWalletUpdates } from '@/hooks/useRealtimeEvents'

export default function WalletPage() {
  const userId = 'current-user-id'
  const balance = useWalletUpdates(userId)
  
  return (
    <div>
      <h1>Wallet Balance: ₹{balance}</h1>
      {/* Real-time updates automatically */}
    </div>
  )
}
```

### Step 6: Admin Panel Integration

Update `admin_panel/src/app/dashboard/page.tsx`:

```typescript
'use client'

import { useAdminEvents, useAdminAlerts } from '@/hooks/useAdminEvents'

export default function AdminDashboard() {
  const { connected, stats } = useAdminEvents()
  const { alerts, dismissAlert } = useAdminAlerts()
  
  return (
    <div>
      <div>Status: {connected ? 'Connected' : 'Disconnected'}</div>
      
      {/* Real-time alerts */}
      {alerts.map((alert) => (
        <Alert key={alert.id} onDismiss={() => dismissAlert(alert.id)}>
          {alert.message}
        </Alert>
      ))}
      
      {/* Real-time stats */}
      <Stats data={stats} />
    </div>
  )
}
```

## 🧪 Testing the Integration

### Test 1: Approve Listing Flow

```bash
# Terminal 1: Start server with Socket.IO
npm run dev

# Terminal 2: Test API
curl -X POST http://localhost:3000/api/listings/123/approve \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Quality listing", "expiryDays": 30}'

# Expected:
# - Database updated
# - Socket event emitted
# - User App receives update
# - Push notification sent
# - Audit log created
```

### Test 2: Refund Flow

```bash
curl -X POST http://localhost:3000/api/wallet/refund \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Idempotency-Key: unique-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "amount": 500,
    "reason": "Listing removed by admin",
    "refId": "listing-456"
  }'

# Expected:
# - Wallet credited
# - Transaction created
# - Socket event → User sees balance update
# - Push notification
# - Finance dashboard updated
```

### Test 3: Real-time Events

Open browser console in User App:
```javascript
// Should see:
// [Socket] Connected
// [Event] Received: listings.update { id, status, ... }
// [Notification] success: Your listing has been approved!
```

## 📊 Monitoring & Debugging

### Check Event Delivery
```typescript
// In Prisma Studio or SQL
SELECT * FROM EventOutbox WHERE status = 'failed' ORDER BY createdAt DESC;
```

### Check Queue Status
```typescript
// Add queue monitoring endpoint
app.get('/api/admin/queues', async (req, res) => {
  const counts = await notificationQueue.getJobCounts()
  res.json(counts) // { waiting, active, completed, failed }
})
```

### Check Audit Logs
```sql
SELECT action, entityType, COUNT(*) 
FROM AuditLog 
WHERE createdAt > NOW() - INTERVAL '24 hours'
GROUP BY action, entityType;
```

## 🔒 Security Checklist

- [x] JWT validation on all protected routes
- [x] Rate limiting on sensitive endpoints
- [x] Idempotency for payment operations
- [x] Audit logging for admin actions
- [x] PII masking in logs
- [x] CORS configuration
- [x] Input validation
- [x] SQL injection protection (Prisma)
- [ ] Implement CSRF tokens
- [ ] Setup mTLS for external services
- [ ] Regular security audits

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] Environment variables secured
- [ ] Database migrations tested
- [ ] Redis cluster configured
- [ ] Socket.IO scaled (sticky sessions)
- [ ] Queue workers scaled
- [ ] Cron jobs configured
- [ ] Monitoring alerts setup
- [ ] Backup strategy verified
- [ ] Load testing completed
- [ ] Security audit done

### Scaling Considerations
- Use Redis Cluster for high availability
- Run multiple Socket.IO instances with Redis adapter
- Scale queue workers horizontally
- Use read replicas for analytics queries
- CDN for static assets
- Connection pooling for database

---

**Ready for Production**: Follow all steps above and complete the checklist.  
**Questions?** Check ARCHITECTURE.md for detailed system design.
