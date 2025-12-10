'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Bell, MessageSquare, RefreshCw, Zap, Activity, BarChart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function RetentionEngagement({ filters }: { filters: any }) {
  const kpis = [
    { title: 'DAU', value: '8,234', change: '+5.2%', icon: <Users className="h-4 w-4" /> },
    { title: 'WAU', value: '24,567', change: '+8.7%', icon: <Users className="h-4 w-4" /> },
    { title: 'MAU', value: '52,345', change: '+12.3%', icon: <Users className="h-4 w-4" /> },
    { title: 'Stickiness (DAU/MAU)', value: '15.7%', change: '+2.1%', icon: <Activity className="h-4 w-4" /> },
    { title: 'D30 Retention', value: '52%', change: '+3.5%', icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'D60 Retention', value: '38%', change: '+2.8%', icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'D90 Retention', value: '28%', change: '+1.9%', icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'Avg Session Length', value: '8.4m', change: '+12s', icon: <Activity className="h-4 w-4" /> },
  ]

  const engagementMetrics = [
    { title: 'Notification CTR', value: '23.5%', change: '+4.2%', icon: <Bell className="h-4 w-4" /> },
    { title: 'Messages per Listing', value: '4.8', change: '+0.6', icon: <MessageSquare className="h-4 w-4" /> },
    { title: 'Boost Renewal %', value: '42.3%', change: '+8.1%', icon: <Zap className="h-4 w-4" /> },
    { title: 'Re-list % (after expiry)', value: '34.7%', change: '+5.3%', icon: <RefreshCw className="h-4 w-4" /> },
  ]

  const cohortRetention = [
    { cohort: 'Oct 2024', users: 5234, d30: 52, d60: 38, d90: 28, ltv: '₹1,245' },
    { cohort: 'Nov 2024', users: 6123, d30: 55, d60: 41, d90: 0, ltv: '₹1,387' },
    { cohort: 'Dec 2024', users: 7456, d30: 58, d60: 0, d90: 0, ltv: '₹892' },
  ]

  const installFunnel = [
    { stage: 'App Installed', count: 21345, percentage: 100 },
    { stage: 'Account Created', count: 15234, percentage: 71.4 },
    { stage: 'Profile Completed', count: 12453, percentage: 58.3 },
    { stage: 'KYC Started', count: 8467, percentage: 39.7 },
    { stage: 'KYC Completed', count: 6234, percentage: 29.2 },
  ]

  const churnReasons = [
    { reason: 'No responses to listings', percentage: 35 },
    { reason: 'Too many spam messages', percentage: 22 },
    { reason: 'Difficulty in selling', percentage: 18 },
    { reason: 'Better alternatives', percentage: 15 },
    { reason: 'App performance issues', percentage: 10 },
  ]

  const powerUsers = [
    { segment: 'Power Sellers (>10 listings)', count: 423, ltv: '₹8,456', engagement: '95%' },
    { segment: 'Active Buyers (>5 purchases)', count: 1234, ltv: '₹3,245', engagement: '87%' },
    { segment: 'Returning Users (>3 logins/week)', count: 8467, ltv: '₹1,876', engagement: '78%' },
    { segment: 'Casual Users (1-2 logins/month)', count: 12453, ltv: '₹456', engagement: '34%' },
  ]

  return (
    <div className="space-y-6">
      {/* DAU/WAU/MAU KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <Badge variant="outline" className="mt-2">{kpi.change}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {engagementMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <Badge variant="default" className="mt-2">{metric.change}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DAU vs MAU Stickiness */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-500" />
            DAU vs MAU (Stickiness Ratio)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <p className="text-sm text-muted-foreground mb-1">Daily Active</p>
                <p className="text-3xl font-bold">8,234</p>
                <p className="text-xs text-muted-foreground mt-1">DAU</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Monthly Active</p>
                <p className="text-3xl font-bold">52,345</p>
                <p className="text-xs text-muted-foreground mt-1">MAU</p>
              </div>
              <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <p className="text-sm text-muted-foreground mb-1">Stickiness</p>
                <p className="text-3xl font-bold">15.7%</p>
                <Badge variant="default" className="mt-1">Good</Badge>
              </div>
            </div>
            <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Line Chart: DAU/MAU trend over time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cohort Retention */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Retention Cohort (by Signup Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Cohort</th>
                  <th className="text-center py-3 px-4">Users</th>
                  <th className="text-center py-3 px-4">D30</th>
                  <th className="text-center py-3 px-4">D60</th>
                  <th className="text-center py-3 px-4">D90</th>
                  <th className="text-right py-3 px-4">LTV</th>
                </tr>
              </thead>
              <tbody>
                {cohortRetention.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{row.cohort}</td>
                    <td className="text-center py-3 px-4">{row.users.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant={row.d30 >= 50 ? 'default' : 'secondary'}>{row.d30}%</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.d60 > 0 ? (
                        <Badge variant={row.d60 >= 35 ? 'default' : 'secondary'}>{row.d60}%</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.d90 > 0 ? (
                        <Badge variant={row.d90 >= 25 ? 'default' : 'secondary'}>{row.d90}%</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">{row.ltv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Install to KYC Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>📱 App Install → KYC Completion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {installFunnel.map((stage, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.count.toLocaleString()} ({stage.percentage}%)
                    </span>
                  </div>
                  <Progress value={stage.percentage} />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold">29.2%</p>
              <p className="text-xs text-muted-foreground mt-1">Install to KYC completion</p>
            </div>
          </CardContent>
        </Card>

        {/* Churn Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>❌ Churn Reasons (Survey/Inferred)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {churnReasons.map((reason, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{reason.reason}</span>
                    <span className="text-muted-foreground">{reason.percentage}%</span>
                  </div>
                  <Progress value={reason.percentage} />
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-sm font-medium">Top Action Item</p>
              <p className="text-xs text-muted-foreground mt-1">
                Improve response rates & reduce spam to decrease churn by ~57%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Push Notification Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-500" />
            Push Open → Renew Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Sent</p>
              <p className="text-2xl font-bold">24,567</p>
              <p className="text-xs text-muted-foreground mt-1">100%</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Delivered</p>
              <p className="text-2xl font-bold">22,345</p>
              <p className="text-xs text-muted-foreground mt-1">91%</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Opened</p>
              <p className="text-2xl font-bold">5,234</p>
              <Badge variant="default" className="mt-1">23.4% CTR</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-950">
              <p className="text-sm text-muted-foreground mb-2">Renewed</p>
              <p className="text-2xl font-bold">2,241</p>
              <Badge variant="default" className="mt-1 bg-green-600">42.8% CVR</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Segments & LTV */}
      <Card>
        <CardHeader>
          <CardTitle>👥 User Segments & Lifetime Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {powerUsers.map((segment, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{segment.segment}</p>
                  <Badge variant="default">{segment.count.toLocaleString()} users</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Avg LTV</p>
                    <p className="text-lg font-bold">{segment.ltv}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement Rate</p>
                    <p className="text-lg font-bold">{segment.engagement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inactivity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>🗓 Inactivity Heatmap (Days Since Last Login)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Heatmap: User segments by inactivity period</p>
              <p className="text-xs">Color intensity = user count in each inactive range</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Returning Sellers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-green-500" />
            Returning Sellers % & Seller LTV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Returning Sellers</p>
              <p className="text-3xl font-bold">42.3%</p>
              <Badge variant="default" className="mt-2">+8.1%</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Listings/Seller</p>
              <p className="text-3xl font-bold">2.8</p>
              <Badge variant="outline" className="mt-2">+0.4</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-950">
              <p className="text-sm text-muted-foreground mb-2">Seller LTV</p>
              <p className="text-3xl font-bold">₹3,456</p>
              <Badge variant="default" className="mt-2 bg-green-600">+15.2%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
