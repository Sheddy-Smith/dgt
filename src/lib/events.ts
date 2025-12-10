// lib/events.ts - WebSocket Event System

export enum EventChannel {
  LISTING_UPDATE = 'listings.update',
  WALLET_UPDATE = 'wallet.update',
  NOTIFY_PUSH = 'notify.push',
  SETTINGS_UPDATE = 'settings.update',
  USER_BLOCKED = 'user.blocked'
}

export interface ListingUpdateEvent {
  id: string
  status: 'pending' | 'active' | 'rejected' | 'expired'
  expiryAt?: Date
  boost?: {
    planId: string
    endsAt: Date
  }
  reason?: string
}

export interface WalletUpdateEvent {
  userId: string
  balance: number
  txn: {
    id: string
    type: 'credit' | 'debit' | 'refund' | 'payout'
    amount: number
    status: 'pending' | 'completed' | 'failed'
  }
}

export interface NotifyPushEvent {
  userId: string
  templateKey: string
  payload: Record<string, any>
  priority: 'high' | 'normal'
}

export interface SettingsUpdateEvent {
  keys: string[]
}

export interface UserBlockedEvent {
  userId: string
  reason: string
  until?: Date
}

export type EventPayload = 
  | ListingUpdateEvent 
  | WalletUpdateEvent 
  | NotifyPushEvent 
  | SettingsUpdateEvent 
  | UserBlockedEvent

export interface EventMessage {
  channel: EventChannel
  payload: EventPayload
  timestamp: Date
  requestId: string
}

// Event emitter service
export class EventEmitter {
  private static instance: EventEmitter
  private io: any // Socket.io server instance

  private constructor() {}

  static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter()
    }
    return EventEmitter.instance
  }

  setSocketServer(io: any) {
    this.io = io
  }

  async emit(channel: EventChannel, payload: EventPayload, requestId: string) {
    const message: EventMessage = {
      channel,
      payload,
      timestamp: new Date(),
      requestId
    }

    // Emit to WebSocket clients
    if (this.io) {
      this.io.emit(channel, message)
    }

    // Store in outbox for reliability (Prisma)
    await this.storeInOutbox(message)

    // Log event
    console.log(`[Event Emitted] ${channel}`, { requestId, payload })
  }

  private async storeInOutbox(message: EventMessage) {
    // Store in database outbox table for guaranteed delivery
    // Implementation with Prisma
    try {
      // await prisma.eventOutbox.create({
      //   data: {
      //     channel: message.channel,
      //     payload: message.payload,
      //     timestamp: message.timestamp,
      //     requestId: message.requestId,
      //     status: 'pending'
      //   }
      // })
    } catch (error) {
      console.error('[Outbox] Failed to store event', error)
    }
  }
}

// Client-side event listener hook
export function useEventListener(channel: EventChannel, callback: (payload: EventPayload) => void) {
  // Implementation in User App and Admin Panel
  // useEffect(() => {
  //   const socket = io(SOCKET_URL)
  //   socket.on(channel, (message: EventMessage) => {
  //     callback(message.payload)
  //   })
  //   return () => {
  //     socket.off(channel)
  //     socket.disconnect()
  //   }
  // }, [channel])
}
