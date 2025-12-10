'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, TrendingDown, Users, Send, Eye, MousePointerClick, Zap, Clock, CheckCircle, XCircle, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react'
import { useState } from 'react'

export function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState('7days')
  const [selectedChannel, setSelectedChannel] = useState('all')

  // Mock KPI data
  const kpis = [
    {
      label: 'Total Sent',
      value: '45,892',
      change: '+12.5%',
      trend: 'up',
      icon: Send,
      color: 'text-blue-500'
    },
    {
      label: 'Delivery Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      label: 'Open Rate',
      value: '58.7%',
      change: '-3.2%',
      trend: 'down',
      icon: Eye,
      color: 'text-purple-500'
    },
    {
      label: 'Click Rate',
      value: '18.4%',
      change: '+5.8%',
      trend: 'up',
      icon: MousePointerClick,
      color: 'text-orange-500'
    },
    {
      label: 'Avg. Delivery Time',
      value: '2.3s',
      change: '-0.5s',
      trend: 'up',
      icon: Zap,
      color: 'text-yellow-500'
    },
    {
      label: 'Failure Rate',
      value: '5.8%',
      change: '-1.2%',
      trend: 'up',
      icon: XCircle,
      color: 'text-red-500'
    }
  ]

  // Channel performance
  const channelStats = [
    {
      channel: 'push',
      icon: Bell,
      sent: 28450,
      delivered: 27120,
      opened: 18345,
      clicked: 5630,
      failed: 1330,
      deliveryRate: 95.3,
      openRate: 67.6,
      clickRate: 20.8
    },
    {
      channel: 'sms',
      icon: MessageSquare,
      sent: 8920,
      delivered: 8450,
      opened: 0,
      clicked: 0,
      failed: 470,
      deliveryRate: 94.7,
      openRate: 0,
      clickRate: 0
    },
    {
      channel: 'email',
      icon: Mail,
      sent: 5340,
      delivered: 4980,
      opened: 1890,
      clicked: 420,
      failed: 360,
      deliveryRate: 93.3,
      openRate: 38.0,
      clickRate: 8.4
    },
    {
      channel: 'in-app',
      icon: Smartphone,
      sent: 3182,
      delivered: 3182,
      opened: 2105,
      clicked: 578,
      failed: 0,
      deliveryRate: 100,
      openRate: 66.2,
      clickRate: 18.2
    }
  ]

  // Top performing campaigns
  const topCampaigns = [
    {
      name: 'Renew Expiring Listings - Delhi Mobiles',
      sent: 1247,
      openRate: 68.5,
      clickRate: 24.3,
      conversions: 203,
      revenue: '₹1,52,250'
    },
    {
      name: 'Boost Plan Promotion - Power Sellers',
      sent: 892,
      openRate: 72.1,
      clickRate: 28.4,
      conversions: 178,
      revenue: '₹2,13,600'
    },
    {
      name: 'KYC Completion Reminder',
      sent: 2156,
      openRate: 54.2,
      clickRate: 19.8,
      conversions: 387,
      revenue: '—'
    },
    {
      name: 'Win-back Inactive Users',
      sent: 5634,
      openRate: 31.5,
      clickRate: 8.2,
      conversions: 142,
      revenue: '₹42,800'
    }
  ]

  // Segment performance
  const segmentStats = [
    { segment: 'Power Sellers', sent: 892, openRate: 72.1, clickRate: 28.4, conversionRate: 19.9 },
    { segment: 'New Users (<7d)', sent: 3420, openRate: 45.8, clickRate: 12.3, conversionRate: 8.1 },
    { segment: 'High-Value Buyers', sent: 421, openRate: 81.2, clickRate: 34.7, conversionRate: 22.5 },
    { segment: 'At Risk - Inactive 14d', sent: 5634, openRate: 31.5, clickRate: 8.2, conversionRate: 2.5 }
  ]

  // A/B test results
  const abTests = [
    {
      name: 'Listing Expiry - Emoji vs No Emoji',
      variantA: { name: 'With Emoji 🎉', sent: 624, openRate: 71.2, clickRate: 25.8 },
      variantB: { name: 'No Emoji', sent: 623, openRate: 65.8, clickRate: 22.8 },
      winner: 'A',
      significant: true
    },
    {
      name: 'Boost Plan - Discount % in Title',
      variantA: { name: '20% Off in Title', sent: 446, openRate: 68.4, clickRate: 24.2 },
      variantB: { name: 'Generic Title', sent: 446, openRate: 66.1, clickRate: 23.1 },
      winner: 'A',
      significant: false
    }
  ]

  // Transactional SLAs
  const transactionalSLAs = [
    { event: 'OTP Sent', avgLatency: '1.2s', p95Latency: '2.1s', successRate: 98.5, failureRate: 1.5, slaTarget: '<3s, >95%', status: 'pass' },
    { event: 'Listing Approved', avgLatency: '3.5s', p95Latency: '8.2s', successRate: 96.2, failureRate: 3.8, slaTarget: '<10s, >90%', status: 'pass' },
    { event: 'Payout Success', avgLatency: '4.1s', p95Latency: '9.8s', successRate: 97.8, failureRate: 2.2, slaTarget: '<10s, >95%', status: 'pass' },
    { event: 'Security Alert', avgLatency: '1.8s', p95Latency: '3.2s', successRate: 99.1, failureRate: 0.9, slaTarget: '<5s, >98%', status: 'pass' }
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-40">
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
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown
          return (
            <Card key={kpi.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendIcon className="h-4 w-4" />
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                  <Icon className={`h-12 w-12 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="channels">Channel Performance</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="segments">Segment Performance</TabsTrigger>
          <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
          <TabsTrigger value="transactional">Transactional SLAs</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Channel</CardTitle>
              <CardDescription>Delivery and engagement metrics across all channels</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Opened</TableHead>
                    <TableHead>Clicked</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead>Delivery Rate</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <TableRow key={stat.channel}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span className="font-medium capitalize">{stat.channel}</span>
                          </div>
                        </TableCell>
                        <TableCell>{stat.sent.toLocaleString()}</TableCell>
                        <TableCell>{stat.delivered.toLocaleString()}</TableCell>
                        <TableCell>{stat.opened > 0 ? stat.opened.toLocaleString() : '—'}</TableCell>
                        <TableCell>{stat.clicked > 0 ? stat.clicked.toLocaleString() : '—'}</TableCell>
                        <TableCell className="text-red-600">{stat.failed.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={stat.deliveryRate >= 95 ? 'default' : 'secondary'} className={stat.deliveryRate >= 95 ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}>
                            {stat.deliveryRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>{stat.openRate > 0 ? `${stat.openRate}%` : '—'}</TableCell>
                        <TableCell>{stat.clickRate > 0 ? `${stat.clickRate}%` : '—'}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>Campaigns ranked by engagement and conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCampaigns.map((campaign, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.sent.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.openRate >= 60 ? 'default' : campaign.openRate >= 40 ? 'default' : 'secondary'} className={campaign.openRate >= 60 ? 'bg-green-500 text-white' : campaign.openRate >= 40 ? '' : ''}>
                          {campaign.openRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={campaign.clickRate >= 20 ? 'default' : campaign.clickRate >= 10 ? 'default' : 'secondary'} className={campaign.clickRate >= 20 ? 'bg-green-500 text-white' : campaign.clickRate >= 10 ? '' : ''}>
                          {campaign.clickRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.conversions}</TableCell>
                      <TableCell className="font-semibold">{campaign.revenue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campaign Revenue Attribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Revenue</span>
                  <span className="text-xl font-bold">₹4,08,650</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Avg. Revenue per Campaign</span>
                  <span className="font-medium">₹1,36,217</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">ROI</span>
                  <span className="font-medium text-green-600">342%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Sent</span>
                    <span className="font-medium">45,892 (100%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Delivered</span>
                    <span className="font-medium">43,250 (94.2%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '94.2%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Opened</span>
                    <span className="font-medium">25,388 (58.7%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '58.7%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Clicked</span>
                    <span className="font-medium">7,960 (18.4%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '18.4%' }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Converted</span>
                    <span className="font-medium">910 (2.1%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '2.1%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segment Performance</CardTitle>
              <CardDescription>Engagement metrics by audience segment</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>Messages Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {segmentStats.map((stat, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{stat.segment}</TableCell>
                      <TableCell>{stat.sent.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-20">
                            <div className="h-full bg-purple-500" style={{ width: `${stat.openRate}%` }} />
                          </div>
                          <span className="text-sm font-medium">{stat.openRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-20">
                            <div className="h-full bg-orange-500" style={{ width: `${stat.clickRate}%` }} />
                          </div>
                          <span className="text-sm font-medium">{stat.clickRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stat.conversionRate >= 15 ? 'default' : stat.conversionRate >= 5 ? 'default' : 'secondary'} className={stat.conversionRate >= 15 ? 'bg-green-500 text-white' : stat.conversionRate >= 5 ? '' : ''}>
                          {stat.conversionRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abtests" className="space-y-4">
          {abTests.map((test, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  {test.name}
                  {test.significant && (
                    <Badge variant="default" className="bg-green-500 text-white">Statistically Significant</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border-2 ${test.winner === 'A' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Variant A: {test.variantA.name}</h4>
                      {test.winner === 'A' && <Badge variant="default" className="bg-green-500 text-white">Winner</Badge>}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sent:</span>
                        <span className="font-medium">{test.variantA.sent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Open Rate:</span>
                        <span className="font-medium">{test.variantA.openRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Click Rate:</span>
                        <span className="font-medium">{test.variantA.clickRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${test.winner === 'B' ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Variant B: {test.variantB.name}</h4>
                      {test.winner === 'B' && <Badge variant="default" className="bg-green-500 text-white">Winner</Badge>}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sent:</span>
                        <span className="font-medium">{test.variantB.sent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Open Rate:</span>
                        <span className="font-medium">{test.variantB.openRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Click Rate:</span>
                        <span className="font-medium">{test.variantB.clickRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="transactional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactional Event SLAs</CardTitle>
              <CardDescription>Performance metrics for critical system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Avg Latency</TableHead>
                    <TableHead>P95 Latency</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Failure Rate</TableHead>
                    <TableHead>SLA Target</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionalSLAs.map((sla, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{sla.event}</TableCell>
                      <TableCell>{sla.avgLatency}</TableCell>
                      <TableCell>{sla.p95Latency}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500 text-white">{sla.successRate}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={sla.failureRate <= 5 ? 'secondary' : 'destructive'}>
                          {sla.failureRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sla.slaTarget}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {sla.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">OTP Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-lg font-bold text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Median Latency</span>
                  <span className="text-lg font-bold">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Sent (7d)</span>
                  <span className="text-lg font-bold">8,920</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compliance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Opt-out Rate</span>
                  <span className="text-lg font-bold">0.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DND Hits (SMS)</span>
                  <span className="text-lg font-bold">312</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email Bounce Rate</span>
                  <span className="text-lg font-bold">3.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
