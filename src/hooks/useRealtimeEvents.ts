// hooks/useRealtimeEvents.ts
// React hook for subscribing to real-time events (User App)

'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { EventChannel, EventPayload } from '@/lib/events'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

let socket: Socket | null = null

export function useRealtimeEvents() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('access_token')
        }
      })

      socket.on('connect', () => {
        console.log('[Socket] Connected')
        setConnected(true)
      })

      socket.on('disconnect', () => {
        console.log('[Socket] Disconnected')
        setConnected(false)
      })
    }

    return () => {
      // Cleanup on unmount
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [])

  return { connected, socket }
}

// Hook for specific event channel
export function useEventListener(
  channel: EventChannel,
  callback: (payload: EventPayload) => void
) {
  const { connected } = useRealtimeEvents()

  useEffect(() => {
    if (!socket || !connected) return

    const handler = (message: any) => {
      console.log(`[Event] Received: ${channel}`, message)
      callback(message.payload)
    }

    socket.on(channel, handler)

    return () => {
      socket?.off(channel, handler)
    }
  }, [channel, callback, connected])
}

// Example usage in components
export function useListingUpdates(listingId: string) {
  const [listing, setListing] = useState<any>(null)

  useEventListener(EventChannel.LISTING_UPDATE, (payload: any) => {
    if (payload.id === listingId) {
      setListing((prev: any) => ({
        ...prev,
        ...payload
      }))

      // Show toast notification
      if (payload.status === 'active') {
        showNotification('success', 'Your listing has been approved!')
      } else if (payload.status === 'rejected') {
        showNotification('error', `Listing rejected: ${payload.reason}`)
      }
    }
  })

  return listing
}

export function useWalletUpdates(userId: string) {
  const [balance, setBalance] = useState<number>(0)

  useEventListener(EventChannel.WALLET_UPDATE, (payload: any) => {
    if (payload.userId === userId) {
      setBalance(payload.balance)

      // Show notification
      if (payload.txn.type === 'refund') {
        showNotification('success', `₹${payload.txn.amount} refunded to your wallet`)
      } else if (payload.txn.type === 'payout' && payload.txn.status === 'completed') {
        showNotification('success', `Payout of ₹${payload.txn.amount} completed`)
      }
    }
  })

  return balance
}

export function useUserBlocked(userId: string, onBlocked: () => void) {
  useEventListener(EventChannel.USER_BLOCKED, (payload: any) => {
    if (payload.userId === userId) {
      // Force logout
      localStorage.clear()
      
      // Show block message
      alert(`Your account has been blocked. Reason: ${payload.reason}`)
      
      // Callback
      onBlocked()
    }
  })
}

export function useSettingsUpdates(onUpdate: (keys: string[]) => void) {
  useEventListener(EventChannel.SETTINGS_UPDATE, (payload: any) => {
    console.log('[Settings] Update received', payload.keys)
    
    // Refresh relevant data
    onUpdate(payload.keys)
    
    // Clear cache
    if (payload.keys.includes('banners')) {
      // Refetch banners
    }
    if (payload.keys.includes('categories')) {
      // Refetch categories
    }
  })
}

function showNotification(type: 'success' | 'error', message: string) {
  // Implement toast notification
  console.log(`[Notification] ${type}: ${message}`)
}
