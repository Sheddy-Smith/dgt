// admin_panel/src/hooks/useAdminEvents.ts
// React hook for Admin Panel real-time events

'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { EventChannel, EventPayload } from '@/lib/events'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

let socket: Socket | null = null

export function useAdminEvents() {
  const [connected, setConnected] = useState(false)
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    activeUsers: 0,
    revenueToday: 0
  })

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('admin_token')
        }
      })

      socket.on('connect', () => {
        console.log('[Admin Socket] Connected')
        setConnected(true)
      })

      socket.on('disconnect', () => {
        console.log('[Admin Socket] Disconnected')
        setConnected(false)
      })

      // Subscribe to all event channels for monitoring
      socket.on(EventChannel.LISTING_UPDATE, (message: any) => {
        console.log('[Admin] Listing updated', message)
        // Update dashboard stats
        refreshDashboard()
      })

      socket.on(EventChannel.WALLET_UPDATE, (message: any) => {
        console.log('[Admin] Wallet updated', message)
        refreshFinanceMetrics()
      })

      socket.on(EventChannel.USER_BLOCKED, (message: any) => {
        console.log('[Admin] User blocked', message)
        refreshUserStats()
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [])

  const refreshDashboard = async () => {
    // Fetch updated dashboard data
    // const data = await fetch('/api/admin/dashboard/stats')
    // setStats(data)
  }

  const refreshFinanceMetrics = async () => {
    // Fetch updated finance data
  }

  const refreshUserStats = async () => {
    // Fetch updated user data
  }

  return { connected, stats }
}

// Hook for monitoring specific metric
export function useMetricMonitor(metric: string) {
  const [value, setValue] = useState<number>(0)
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable')

  useEffect(() => {
    const interval = setInterval(async () => {
      // Fetch metric value
      // const data = await fetch(`/api/admin/metrics/${metric}`)
      // setValue(data.value)
      // setTrend(data.trend)
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [metric])

  return { value, trend }
}

// Hook for real-time alerts
export function useAdminAlerts() {
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    if (!socket) return

    socket.on('admin.alert', (alert: any) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 10)) // Keep last 10

      // Show desktop notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(alert.title, {
          body: alert.message,
          icon: '/admin-icon.png'
        })
      }
    })

    return () => {
      socket?.off('admin.alert')
    }
  }, [])

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  return { alerts, dismissAlert }
}
