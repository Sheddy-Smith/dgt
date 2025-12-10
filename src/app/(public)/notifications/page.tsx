'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, Package, Zap, Wallet, MessageCircle, 
  CheckCheck, Trash2, Settings 
} from 'lucide-react'
import Link from 'next/link'

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'message',
    title: 'New message from buyer',
    body: 'Is the iPhone still available?',
    timestamp: '2025-12-10T09:30:00Z',
    read: false,
    icon: MessageCircle,
    link: '/messages/123'
  },
  {
    id: '2',
    type: 'boost',
    title: 'Boost activated successfully',
    body: 'Your ad "Royal Enfield Classic" is now boosted for 7 days',
    timestamp: '2025-12-09T14:15:00Z',
    read: false,
    icon: Zap,
    link: '/listing/2'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment received',
    body: 'You received ₹5,000 for iPhone 14 Pro',
    timestamp: '2025-12-09T10:00:00Z',
    read: true,
    icon: Wallet,
    link: '/wallet'
  },
  {
    id: '4',
    type: 'listing',
    title: 'Ad expiring soon',
    body: 'Your ad "MacBook Pro M2" will expire in 3 days',
    timestamp: '2025-12-08T16:20:00Z',
    read: true,
    icon: Package,
    link: '/listing/3'
  },
  {
    id: '5',
    type: 'system',
    title: 'KYC verification completed',
    body: 'Your account is now verified. You can now access premium features.',
    timestamp: '2025-12-07T11:45:00Z',
    read: true,
    icon: CheckCheck,
    link: '/profile'
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === activeTab)

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
    return time.toLocaleDateString()
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with your account activity
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          )}
          <Link href="/settings/notifications">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="all">
            All
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="message">
            <MessageCircle className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="boost">
            <Zap className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="payment">
            <Wallet className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon
                return (
                  <Card 
                    key={notification.id}
                    className={`${!notification.read ? 'border-primary bg-primary/5' : ''} cursor-pointer hover:bg-muted/50 transition-colors`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className={`flex-shrink-0 p-2 rounded-full ${
                          notification.type === 'message' ? 'bg-blue-100 dark:bg-blue-950' :
                          notification.type === 'boost' ? 'bg-amber-100 dark:bg-amber-950' :
                          notification.type === 'payment' ? 'bg-green-100 dark:bg-green-950' :
                          notification.type === 'listing' ? 'bg-purple-100 dark:bg-purple-950' :
                          'bg-gray-100 dark:bg-gray-950'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            notification.type === 'message' ? 'text-blue-600' :
                            notification.type === 'boost' ? 'text-amber-600' :
                            notification.type === 'payment' ? 'text-green-600' :
                            notification.type === 'listing' ? 'text-purple-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                              )}
                            </h3>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.body}
                          </p>
                          <div className="flex gap-2">
                            <Link href={notification.link}>
                              <Button variant="link" size="sm" className="h-auto p-0">
                                View
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-auto p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Push Notification Settings Card */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Enable Push Notifications
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mb-3">
                Get instant alerts for messages, offers, and important updates
              </p>
              <Button size="sm" variant="outline">
                Enable Notifications
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
