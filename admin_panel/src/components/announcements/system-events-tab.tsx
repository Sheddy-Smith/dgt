'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Bell, Wallet, Shield, MessageSquare, FileText, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SystemEventsTabProps {
  searchQuery: string
}

interface SystemEvent {
  id: string
  type: string
  category: 'auth' | 'listings' | 'wallet' | 'kyc' | 'disputes' | 'security'
  enabled: boolean
  priority: 'high' | 'medium' | 'low'
  channels: {
    primary: string
    fallback: string[]
  }
  template: string
  rateLimit: number
  retries: number
  errorPolicy: 'retry' | 'fallback' | 'drop'
}

export function SystemEventsTab({ searchQuery }: SystemEventsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [editingEvent, setEditingEvent] = useState<SystemEvent | null>(null)

  const events: SystemEvent[] = [
    {
      id: '1',
      type: 'OTP Sent',
      category: 'auth',
      enabled: true,
      priority: 'high',
      channels: { primary: 'sms', fallback: ['in-app'] },
      template: 'otp_send',
      rateLimit: 1,
      retries: 3,
      errorPolicy: 'retry'
    },
    {
      id: '2',
      type: 'Listing Approved',
      category: 'listings',
      enabled: true,
      priority: 'medium',
      channels: { primary: 'push', fallback: ['in-app', 'email'] },
      template: 'listing_approved',
      rateLimit: 10,
      retries: 2,
      errorPolicy: 'fallback'
    },
    {
      id: '3',
      type: 'Listing Rejected',
      category: 'listings',
      enabled: true,
      priority: 'high',
      channels: { primary: 'push', fallback: ['in-app', 'sms'] },
      template: 'listing_rejected',
      rateLimit: 10,
      retries: 2,
      errorPolicy: 'fallback'
    },
    {
      id: '4',
      type: 'Listing Expiring (T-3)',
      category: 'listings',
      enabled: true,
      priority: 'medium',
      channels: { primary: 'push', fallback: ['in-app'] },
      template: 'listing_expiring_3d',
      rateLimit: 100,
      retries: 1,
      errorPolicy: 'fallback'
    },
    {
      id: '5',
      type: 'Wallet Credit',
      category: 'wallet',
      enabled: true,
      priority: 'high',
      channels: { primary: 'push', fallback: ['sms', 'email'] },
      template: 'wallet_credit',
      rateLimit: 5,
      retries: 3,
      errorPolicy: 'retry'
    },
    {
      id: '6',
      type: 'Payout Success',
      category: 'wallet',
      enabled: true,
      priority: 'high',
      channels: { primary: 'push', fallback: ['email', 'sms'] },
      template: 'payout_success',
      rateLimit: 5,
      retries: 3,
      errorPolicy: 'retry'
    },
    {
      id: '7',
      type: 'Payout Failed',
      category: 'wallet',
      enabled: true,
      priority: 'high',
      channels: { primary: 'sms', fallback: ['push', 'email'] },
      template: 'payout_failed',
      rateLimit: 5,
      retries: 3,
      errorPolicy: 'retry'
    },
    {
      id: '8',
      type: 'KYC Pending',
      category: 'kyc',
      enabled: true,
      priority: 'medium',
      channels: { primary: 'in-app', fallback: ['push'] },
      template: 'kyc_pending',
      rateLimit: 10,
      retries: 1,
      errorPolicy: 'fallback'
    },
    {
      id: '9',
      type: 'KYC Approved',
      category: 'kyc',
      enabled: true,
      priority: 'medium',
      channels: { primary: 'push', fallback: ['in-app', 'email'] },
      template: 'kyc_approved',
      rateLimit: 10,
      retries: 2,
      errorPolicy: 'fallback'
    },
    {
      id: '10',
      type: 'KYC Rejected',
      category: 'kyc',
      enabled: true,
      priority: 'high',
      channels: { primary: 'push', fallback: ['sms', 'in-app'] },
      template: 'kyc_rejected',
      rateLimit: 10,
      retries: 2,
      errorPolicy: 'fallback'
    },
    {
      id: '11',
      type: 'Dispute Created',
      category: 'disputes',
      enabled: true,
      priority: 'high',
      channels: { primary: 'push', fallback: ['email', 'sms'] },
      template: 'dispute_created',
      rateLimit: 5,
      retries: 3,
      errorPolicy: 'retry'
    },
    {
      id: '12',
      type: 'Dispute Resolved',
      category: 'disputes',
      enabled: true,
      priority: 'high',
      channels: { primary: 'push', fallback: ['email'] },
      template: 'dispute_resolved',
      rateLimit: 5,
      retries: 2,
      errorPolicy: 'fallback'
    },
    {
      id: '13',
      type: 'Password Changed',
      category: 'security',
      enabled: true,
      priority: 'high',
      channels: { primary: 'email', fallback: ['sms', 'push'] },
      template: 'password_changed',
      rateLimit: 1,
      retries: 3,
      errorPolicy: 'retry'
    },
    {
      id: '14',
      type: 'New Device Login',
      category: 'security',
      enabled: true,
      priority: 'high',
      channels: { primary: 'push', fallback: ['email', 'sms'] },
      template: 'new_device_login',
      rateLimit: 1,
      retries: 3,
      errorPolicy: 'retry'
    },
    {
      id: '15',
      type: 'Account Blocked',
      category: 'security',
      enabled: true,
      priority: 'high',
      channels: { primary: 'sms', fallback: ['email', 'push'] },
      template: 'account_blocked',
      rateLimit: 1,
      retries: 3,
      errorPolicy: 'retry'
    }
  ]

  const getCategoryIcon = (category: SystemEvent['category']) => {
    const icons = {
      auth: Bell,
      listings: FileText,
      wallet: Wallet,
      kyc: Shield,
      disputes: MessageSquare,
      security: AlertTriangle
    }
    return icons[category]
  }

  const getCategoryColor = (category: SystemEvent['category']) => {
    const colors = {
      auth: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      listings: 'bg-green-500/10 text-green-700 dark:text-green-400',
      wallet: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      kyc: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
      disputes: 'bg-red-500/10 text-red-700 dark:text-red-400',
      security: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
    }
    return colors[category]
  }

  const getPriorityBadge = (priority: SystemEvent['priority']) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    }
    return <Badge variant={variants[priority] as any}>{priority}</Badge>
  }

  const filteredEvents = events.filter(event => {
    if (selectedCategory !== 'all' && event.category !== selectedCategory) {
      return false
    }
    if (searchQuery && !event.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const categories = [
    { value: 'all', label: 'All Categories', count: events.length },
    { value: 'auth', label: 'Authentication', count: events.filter(e => e.category === 'auth').length },
    { value: 'listings', label: 'Listings', count: events.filter(e => e.category === 'listings').length },
    { value: 'wallet', label: 'Wallet', count: events.filter(e => e.category === 'wallet').length },
    { value: 'kyc', label: 'KYC', count: events.filter(e => e.category === 'kyc').length },
    { value: 'disputes', label: 'Disputes', count: events.filter(e => e.category === 'disputes').length },
    { value: 'security', label: 'Security', count: events.filter(e => e.category === 'security').length }
  ]

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7">
          {categories.map(cat => (
            <TabsTrigger key={cat.value} value={cat.value} className="text-xs">
              {cat.label}
              <Badge variant="secondary" className="ml-1 text-xs">{cat.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>System Event Configuration</CardTitle>
          <CardDescription>
            Automated transactional notifications triggered by system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Rate Limit</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => {
                const Icon = getCategoryIcon(event.category)
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryColor(event.category)}>
                        <Icon className="h-3 w-3 mr-1" />
                        {event.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getPriorityBadge(event.priority)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{event.channels.primary.toUpperCase()}</div>
                        <div className="text-muted-foreground text-xs">
                          Fallback: {event.channels.fallback.join(', ')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{event.template}</code>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {event.rateLimit}/min
                        <div className="text-xs text-muted-foreground">
                          {event.retries} retries
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={event.enabled} />
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingEvent(event)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Configure Event: {event.type}</DialogTitle>
                            <DialogDescription>
                              Set routing rules, templates, and error policies
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Priority</Label>
                              <Select value={event.priority}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Primary Channel</Label>
                              <Select value={event.channels.primary}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="push">Push</SelectItem>
                                  <SelectItem value="sms">SMS</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="in-app">In-App</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Template Key</Label>
                              <Input value={event.template} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Rate Limit (per minute)</Label>
                                <Input type="number" value={event.rateLimit} />
                              </div>
                              <div className="space-y-2">
                                <Label>Max Retries</Label>
                                <Input type="number" value={event.retries} />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Error Policy</Label>
                              <Select value={event.errorPolicy}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="retry">Retry with backoff</SelectItem>
                                  <SelectItem value="fallback">Fallback to next channel</SelectItem>
                                  <SelectItem value="drop">Drop (log only)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label>Enabled</Label>
                                <p className="text-sm text-muted-foreground">
                                  Enable or disable this event notification
                                </p>
                              </div>
                              <Switch checked={event.enabled} />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Events</p>
                <p className="text-2xl font-bold">{events.filter(e => e.enabled).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disabled Events</p>
                <p className="text-2xl font-bold">{events.filter(e => !e.enabled).length}</p>
              </div>
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{events.filter(e => e.priority === 'high').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
