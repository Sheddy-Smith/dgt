/**
 * BullMQ Queue Configuration
 * 
 * Handles background job processing for:
 * - Push notifications
 * - Search indexing
 * - Analytics processing
 * - Email/SMS delivery
 */

import { Queue, Worker, type Job } from 'bullmq'
import Redis from 'ioredis'

// Redis connection
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
})

// ============================================
// 1. Notification Queue
// ============================================

export const notificationQueue = new Queue('notifications', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000 // 2s, 4s, 8s
    },
    removeOnComplete: {
      count: 1000 // Keep last 1000 completed
    },
    removeOnFail: {
      count: 5000 // Keep last 5000 failed for debugging
    }
  }
})

interface NotificationJob {
  userId: string
  templateKey: string
  payload: Record<string, any>
  channel: 'push' | 'sms' | 'email' | 'in-app'
  priority: 'high' | 'medium' | 'low'
}

export const notificationWorker = new Worker<NotificationJob>(
  'notifications',
  async (job: Job<NotificationJob>) => {
    const { userId, templateKey, payload, channel } = job.data
    
    console.log(`[Notification Worker] Processing ${channel} for ${userId}`)
    
    try {
      if (channel === 'push') {
        await sendPushNotification(userId, templateKey, payload)
      } else if (channel === 'sms') {
        await sendSMS(userId, payload)
      } else if (channel === 'email') {
        await sendEmail(userId, templateKey, payload)
      } else if (channel === 'in-app') {
        await createInAppNotification(userId, templateKey, payload)
      }
      
      return { success: true, sentAt: new Date().toISOString() }
    } catch (error) {
      console.error('[Notification Worker] Error:', error)
      throw error // Will trigger retry
    }
  },
  {
    connection,
    concurrency: 10, // Process 10 notifications simultaneously
    limiter: {
      max: 100,
      duration: 1000 // Max 100 per second
    }
  }
)

// ============================================
// 2. Search Indexing Queue
// ============================================

export const searchQueue = new Queue('search', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  }
})

interface SearchJob {
  listingId: string
  action: 'upsert' | 'delete'
  data?: Record<string, any>
}

export const searchWorker = new Worker<SearchJob>(
  'search',
  async (job: Job<SearchJob>) => {
    const { listingId, action, data } = job.data
    
    console.log(`[Search Worker] ${action} listing ${listingId}`)
    
    try {
      if (action === 'upsert') {
        // Update search index (Algolia, ElasticSearch, etc.)
        await updateSearchIndex(listingId, data!)
      } else if (action === 'delete') {
        await removeFromSearchIndex(listingId)
      }
      
      return { success: true }
    } catch (error) {
      console.error('[Search Worker] Error:', error)
      throw error
    }
  },
  {
    connection,
    concurrency: 5
  }
)

// ============================================
// 3. Analytics Queue
// ============================================

export const analyticsQueue = new Queue('analytics', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'fixed',
      delay: 10000
    }
  }
})

interface AnalyticsJob {
  events: Array<{
    userId: string
    eventType: string
    timestamp: string
    metadata: Record<string, any>
  }>
}

export const analyticsWorker = new Worker<AnalyticsJob>(
  'analytics',
  async (job: Job<AnalyticsJob>) => {
    const { events } = job.data
    
    console.log(`[Analytics Worker] Processing ${events.length} events`)
    
    try {
      // Batch insert to analytics database or send to external service
      await batchInsertAnalytics(events)
      
      return { processed: events.length }
    } catch (error) {
      console.error('[Analytics Worker] Error:', error)
      throw error
    }
  },
  {
    connection,
    concurrency: 3
  }
)

// ============================================
// Helper Functions
// ============================================

async function sendPushNotification(userId: string, templateKey: string, payload: any) {
  // TODO: Implement FCM integration
  // const admin = require('firebase-admin')
  // const token = await getUserFCMToken(userId)
  // await admin.messaging().send({ token, notification: { ... } })
  
  console.log(`[FCM] Sent ${templateKey} to ${userId}`, payload)
}

async function sendSMS(userId: string, payload: any) {
  // TODO: Implement Twilio integration
  // const twilio = require('twilio')
  // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
  // await client.messages.create({ to: userPhone, body: payload.message })
  
  console.log(`[SMS] Sent to ${userId}`, payload)
}

async function sendEmail(userId: string, templateKey: string, payload: any) {
  // TODO: Implement SendGrid/SES integration
  // const sgMail = require('@sendgrid/mail')
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  // await sgMail.send({ to: userEmail, templateId: templateKey, ... })
  
  console.log(`[Email] Sent ${templateKey} to ${userId}`, payload)
}

async function createInAppNotification(userId: string, templateKey: string, payload: any) {
  // Create notification record in database
  const { prisma } = await import('@/lib/db')
  
  await prisma.notification.create({
    data: {
      userId,
      title: payload.title,
      message: payload.message,
      type: templateKey,
      metadata: payload,
      read: false
    }
  })
}

async function updateSearchIndex(listingId: string, data: Record<string, any>) {
  // TODO: Implement Algolia/ElasticSearch update
  console.log(`[Search] Indexed listing ${listingId}`)
}

async function removeFromSearchIndex(listingId: string) {
  // TODO: Implement Algolia/ElasticSearch delete
  console.log(`[Search] Removed listing ${listingId}`)
}

async function batchInsertAnalytics(events: any[]) {
  // TODO: Insert into analytics database or send to external service
  // e.g., Google Analytics, Mixpanel, custom ClickHouse DB
  console.log(`[Analytics] Inserted ${events.length} events`)
}

// ============================================
// Queue Event Listeners
// ============================================

notificationWorker.on('completed', (job) => {
  console.log(`[Notification] Job ${job.id} completed`)
})

notificationWorker.on('failed', (job, err) => {
  console.error(`[Notification] Job ${job?.id} failed:`, err)
})

searchWorker.on('completed', (job) => {
  console.log(`[Search] Job ${job.id} completed`)
})

analyticsWorker.on('completed', (job) => {
  console.log(`[Analytics] Job ${job.id} completed`)
})

// ============================================
// Queue Health Check
// ============================================

export async function getQueueStats() {
  const [notifCounts, searchCounts, analyticsCounts] = await Promise.all([
    notificationQueue.getJobCounts(),
    searchQueue.getJobCounts(),
    analyticsQueue.getJobCounts()
  ])
  
  return {
    notifications: notifCounts,
    search: searchCounts,
    analytics: analyticsCounts
  }
}
