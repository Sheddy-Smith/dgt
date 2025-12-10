'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CheckCircle, XCircle, Clock, Eye, EyeOff, Filter, Download, RefreshCw, AlertCircle, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface DeliveryLogsTabProps {
  searchQuery: string
}

interface DeliveryLog {
  id: string
  userId: string
  userName: string
  userPhone: string
  userEmail: string
  channel: 'push' | 'sms' | 'email' | 'in-app'
  templateKey: string
  campaignId?: string
  campaignName?: string
  sentTime: string
  deliveredTime?: string
  openedTime?: string
  clickedTime?: string
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed' | 'blocked'
  providerId: string
  providerMsgId: string
  errorCode?: string
  errorMessage?: string
}

export function DeliveryLogsTab({ searchQuery }: DeliveryLogsTabProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLog, setSelectedLog] = useState<DeliveryLog | null>(null)
  const [maskedFields, setMaskedFields] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    channel: 'all',
    status: 'all',
    provider: 'all',
    dateRange: 'today'
  })

  const logs: DeliveryLog[] = [
    {
      id: '1',
      userId: 'usr_001',
      userName: 'Rahul Kumar',
      userPhone: '+91-9876543210',
      userEmail: 'rahul.k@email.com',
      channel: 'push',
      templateKey: 'listing_approved',
      campaignId: undefined,
      sentTime: '2025-12-10 14:35:22',
      deliveredTime: '2025-12-10 14:35:24',
      openedTime: '2025-12-10 14:42:11',
      clickedTime: '2025-12-10 14:42:45',
      status: 'clicked',
      providerId: 'FCM',
      providerMsgId: 'fcm_msg_12345'
    },
    {
      id: '2',
      userId: 'usr_002',
      userName: 'Priya Sharma',
      userPhone: '+91-9876543211',
      userEmail: 'priya.s@email.com',
      channel: 'sms',
      templateKey: 'otp_send',
      sentTime: '2025-12-10 14:30:15',
      deliveredTime: '2025-12-10 14:30:17',
      status: 'delivered',
      providerId: 'Gupshup',
      providerMsgId: 'gup_msg_67890'
    },
    {
      id: '3',
      userId: 'usr_003',
      userName: 'Amit Patel',
      userPhone: '+91-9876543212',
      userEmail: 'amit.p@email.com',
      channel: 'push',
      templateKey: 'listing_expiring_3d',
      campaignId: 'camp_001',
      campaignName: 'Renew Expiring Listings - Delhi Mobiles',
      sentTime: '2025-12-10 14:25:00',
      deliveredTime: '2025-12-10 14:25:02',
      openedTime: '2025-12-10 15:10:22',
      status: 'opened',
      providerId: 'FCM',
      providerMsgId: 'fcm_msg_12346'
    },
    {
      id: '4',
      userId: 'usr_004',
      userName: 'Sneha Reddy',
      userPhone: '+91-9876543213',
      userEmail: 'sneha.r@email.com',
      channel: 'email',
      templateKey: 'payout_success',
      sentTime: '2025-12-10 14:20:00',
      deliveredTime: '2025-12-10 14:20:05',
      openedTime: '2025-12-10 16:30:12',
      status: 'opened',
      providerId: 'SES',
      providerMsgId: 'ses_msg_abc123'
    },
    {
      id: '5',
      userId: 'usr_005',
      userName: 'Vikram Singh',
      userPhone: '+91-9876543214',
      userEmail: 'vikram.s@email.com',
      channel: 'sms',
      templateKey: 'listing_rejected',
      sentTime: '2025-12-10 14:15:00',
      status: 'failed',
      providerId: 'Gupshup',
      providerMsgId: 'gup_msg_67891',
      errorCode: 'DND',
      errorMessage: 'User is on DND (Do Not Disturb) list'
    },
    {
      id: '6',
      userId: 'usr_006',
      userName: 'Anjali Mehta',
      userPhone: '+91-9876543215',
      userEmail: 'anjali.m@email.com',
      channel: 'email',
      templateKey: 'kyc_rejected',
      sentTime: '2025-12-10 14:10:00',
      status: 'bounced',
      providerId: 'SES',
      providerMsgId: 'ses_msg_abc124',
      errorCode: 'INVALID_EMAIL',
      errorMessage: 'Email address does not exist'
    },
    {
      id: '7',
      userId: 'usr_007',
      userName: 'Karan Joshi',
      userPhone: '+91-9876543216',
      userEmail: 'karan.j@email.com',
      channel: 'in-app',
      templateKey: 'safety_tip_new_seller',
      campaignId: 'camp_003',
      campaignName: 'Safety Tips for New Sellers',
      sentTime: '2025-12-10 14:05:00',
      deliveredTime: '2025-12-10 14:05:01',
      status: 'delivered',
      providerId: 'InApp',
      providerMsgId: 'inapp_msg_999'
    },
    {
      id: '8',
      userId: 'usr_008',
      userName: 'Divya Iyer',
      userPhone: '+91-9876543217',
      userEmail: 'divya.i@email.com',
      channel: 'push',
      templateKey: 'wallet_credit',
      sentTime: '2025-12-10 14:00:00',
      status: 'blocked',
      providerId: 'FCM',
      providerMsgId: 'fcm_msg_12347',
      errorCode: 'USER_OPT_OUT',
      errorMessage: 'User has opted out of push notifications'
    }
  ]

  const getStatusBadge = (status: DeliveryLog['status']) => {
    const variants: Record<DeliveryLog['status'], { variant: any; icon: any; color: string }> = {
      sent: { variant: 'secondary', icon: Clock, color: 'text-gray-500' },
      delivered: { variant: 'default', icon: CheckCircle, color: 'text-blue-500' },
      opened: { variant: 'default', icon: Eye, color: 'text-green-500' },
      clicked: { variant: 'success', icon: CheckCircle, color: 'text-emerald-500' },
      bounced: { variant: 'warning', icon: AlertCircle, color: 'text-amber-500' },
      failed: { variant: 'destructive', icon: XCircle, color: 'text-red-500' },
      blocked: { variant: 'destructive', icon: XCircle, color: 'text-red-600' }
    }
    const { variant, icon: Icon, color } = variants[status]
    return (
      <Badge variant={variant as any} className="flex items-center gap-1 w-fit">
        <Icon className={`h-3 w-3 ${color}`} />
        {status}
      </Badge>
    )
  }

  const getChannelIcon = (channel: string) => {
    const icons: Record<string, any> = {
      push: Bell,
      sms: MessageSquare,
      email: Mail,
      'in-app': Smartphone
    }
    const Icon = icons[channel]
    return Icon ? <Icon className="h-4 w-4" /> : null
  }

  const maskData = (data: string, type: 'phone' | 'email') => {
    if (type === 'phone') {
      return data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
    return data.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  }

  const unmaskField = (logId: string, reason: string) => {
    console.log(`Unmasking log ${logId} for reason: ${reason}`)
    setMaskedFields(prev => {
      const newSet = new Set(prev)
      newSet.delete(logId)
      return newSet
    })
  }

  const filteredLogs = logs.filter(log => {
    if (filters.channel !== 'all' && log.channel !== filters.channel) return false
    if (filters.status !== 'all' && log.status !== filters.status) return false
    if (filters.provider !== 'all' && log.providerId !== filters.provider) return false
    if (searchQuery) {
      const search = searchQuery.toLowerCase()
      if (!log.userName.toLowerCase().includes(search) &&
          !log.userPhone.includes(search) &&
          !log.userEmail.toLowerCase().includes(search) &&
          !log.templateKey.includes(search)) {
        return false
      }
    }
    return true
  })

  const exportLogs = () => {
    console.log('Exporting delivery logs...', filteredLogs)
    // Implement CSV export
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          {Object.values(filters).filter(v => v !== 'all' && v !== 'today').length > 0 && (
            <Badge variant="secondary">
              {Object.values(filters).filter(v => v !== 'all' && v !== 'today').length} active
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Filter delivery logs</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Channel</Label>
              <Select value={filters.channel} onValueChange={(value) => setFilters(prev => ({ ...prev, channel: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="in-app">In-App</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="opened">Opened</SelectItem>
                  <SelectItem value="clicked">Clicked</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={filters.provider} onValueChange={(value) => setFilters(prev => ({ ...prev, provider: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="FCM">FCM (Push)</SelectItem>
                  <SelectItem value="Gupshup">Gupshup (SMS)</SelectItem>
                  <SelectItem value="Twilio">Twilio (SMS)</SelectItem>
                  <SelectItem value="SES">AWS SES (Email)</SelectItem>
                  <SelectItem value="SendGrid">SendGrid (Email)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setFilters({ channel: 'all', status: 'all', provider: 'all', dateRange: 'today' })}
            >
              Clear All
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Logs</CardTitle>
          <CardDescription>Track notification delivery status and errors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Sent Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const isMasked = !maskedFields.has(log.id)
                return (
                  <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLog(log)}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-xs text-muted-foreground">
                          {isMasked ? maskData(log.userPhone, 'phone') : log.userPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getChannelIcon(log.channel)}
                        {log.channel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">{log.templateKey}</code>
                    </TableCell>
                    <TableCell>
                      {log.campaignName ? (
                        <div className="text-sm">{log.campaignName}</div>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{log.sentTime}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{log.providerId}</div>
                        <div className="text-xs text-muted-foreground">{log.providerMsgId}</div>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {isMasked ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Unmask PII Data</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for unmasking this user's personal information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <Textarea placeholder="Enter reason for unmasking..." rows={3} />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={() => unmaskField(log.id, 'Support investigation')}>
                                  Unmask & Log
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {(log.status === 'failed' || log.status === 'bounced') && (
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Log Detail Sheet */}
      {selectedLog && (
        <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <SheetContent className="w-full sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Delivery Log Details</SheetTitle>
              <SheetDescription>Message ID: {selectedLog.providerMsgId}</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="font-semibold mb-3">User Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{selectedLog.userName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">
                      {maskedFields.has(selectedLog.id) ? selectedLog.userPhone : maskData(selectedLog.userPhone, 'phone')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">
                      {maskedFields.has(selectedLog.id) ? selectedLog.userEmail : maskData(selectedLog.userEmail, 'email')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Message Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Channel:</span>
                    <Badge variant="outline">{selectedLog.channel}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Template:</span>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{selectedLog.templateKey}</code>
                  </div>
                  {selectedLog.campaignName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Campaign:</span>
                      <span>{selectedLog.campaignName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Delivery Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Sent</div>
                      <div className="text-xs text-muted-foreground">{selectedLog.sentTime}</div>
                    </div>
                  </div>
                  {selectedLog.deliveredTime && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Delivered</div>
                        <div className="text-xs text-muted-foreground">{selectedLog.deliveredTime}</div>
                      </div>
                    </div>
                  )}
                  {selectedLog.openedTime && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-purple-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Opened</div>
                        <div className="text-xs text-muted-foreground">{selectedLog.openedTime}</div>
                      </div>
                    </div>
                  )}
                  {selectedLog.clickedTime && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">Clicked</div>
                        <div className="text-xs text-muted-foreground">{selectedLog.clickedTime}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Provider Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="font-medium">{selectedLog.providerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Message ID:</span>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{selectedLog.providerMsgId}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(selectedLog.status)}
                  </div>
                </div>
              </div>

              {selectedLog.errorCode && (
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Error Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Error Code:</span>
                      <code className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">{selectedLog.errorCode}</code>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Message:</span>
                      <p className="mt-1 text-red-600">{selectedLog.errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Sent</div>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Delivered</div>
            <div className="text-2xl font-bold text-green-600">
              {logs.filter(l => l.status === 'delivered' || l.status === 'opened' || l.status === 'clicked').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Failed</div>
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(l => l.status === 'failed' || l.status === 'bounced' || l.status === 'blocked').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Open Rate</div>
            <div className="text-2xl font-bold text-purple-600">
              {((logs.filter(l => l.status === 'opened' || l.status === 'clicked').length / logs.length) * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
