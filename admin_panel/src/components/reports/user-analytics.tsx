'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, Shield, TrendingUp, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function UserAnalytics({ filters }: { filters: any }) {
  const kpis = [
    { title: 'New Users', value: '1,234', change: '+18%', icon: <Users className="h-4 w-4" /> },
    { title: 'Verified KYC %', value: '67.8%', change: '+5.2%', icon: <UserCheck className="h-4 w-4" /> },
    { title: 'Returning Users %', value: '42.3%', change: '+3.1%', icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'Blocked/Flagged', value: '87', change: '-12%', icon: <UserX className="h-4 w-4" /> },
    { title: 'Churn Rate', value: '8.2%', change: '-2.3%', icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'Avg Listings/Seller', value: '2.8', change: '+0.4', icon: <Users className="h-4 w-4" /> },
    { title: 'Power Sellers (>10)', value: '423', change: '+34', icon: <Shield className="h-4 w-4" /> },
    { title: 'Reports/100 Users', value: '1.2', change: '-0.3', icon: <UserX className="h-4 w-4" /> },
  ]

  const deviceSplit = [
    { platform: 'Android', users: 12453, percentage: 58 },
    { platform: 'iOS', users: 5678, percentage: 27 },
    { platform: 'Web', users: 3214, percentage: 15 },
  ]

  const cohortData = [
    { month: 'Oct 2024', d30: 45, d60: 32, d90: 28 },
    { month: 'Nov 2024', d30: 48, d60: 35, d90: 0 },
    { month: 'Dec 2024', d30: 52, d60: 0, d90: 0 },
  ]

  const ratingDistribution = [
    { stars: 5, count: 4523, percentage: 65 },
    { stars: 4, count: 1876, percentage: 27 },
    { stars: 3, count: 432, percentage: 6 },
    { stars: 2, count: 98, percentage: 1.4 },
    { stars: 1, count: 45, percentage: 0.6 },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signup Trend */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Signup Trend (New vs Returning)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Line Chart: Daily Signups</p>
                <p className="text-xs">New (green) vs Returning (blue)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Split */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Split: Android / iOS / Web
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceSplit.map((device, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{device.platform}</span>
                    <span className="text-muted-foreground">
                      {device.users.toLocaleString()} ({device.percentage}%)
                    </span>
                  </div>
                  <Progress value={device.percentage} />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Dominant Platform</p>
              <p className="text-2xl font-bold">Android</p>
              <p className="text-xs text-muted-foreground mt-1">58% of total users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 User Funnel: Register → Post Listing → Get Message → Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
              <p className="text-sm text-muted-foreground mb-2">Registered</p>
              <p className="text-3xl font-bold">21,345</p>
              <p className="text-xs text-muted-foreground mt-1">100%</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-green-50 dark:bg-green-950">
              <p className="text-sm text-muted-foreground mb-2">Posted Listing</p>
              <p className="text-3xl font-bold">12,453</p>
              <p className="text-xs text-muted-foreground mt-1">58.3%</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
              <p className="text-sm text-muted-foreground mb-2">Got Messages</p>
              <p className="text-3xl font-bold">8,467</p>
              <p className="text-xs text-muted-foreground mt-1">39.7%</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-purple-50 dark:bg-purple-950">
              <p className="text-sm text-muted-foreground mb-2">Completed Sale</p>
              <p className="text-3xl font-bold">2,241</p>
              <p className="text-xs text-muted-foreground mt-1">10.5%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>📅 Cohort Analysis (Retention by Signup Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Signup Month</th>
                    <th className="text-center py-2 px-4">Day 30</th>
                    <th className="text-center py-2 px-4">Day 60</th>
                    <th className="text-center py-2 px-4">Day 90</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4 font-medium">{row.month}</td>
                      <td className="text-center py-2 px-4">
                        {row.d30 > 0 ? (
                          <Badge variant={row.d30 > 45 ? 'default' : 'secondary'}>{row.d30}%</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="text-center py-2 px-4">
                        {row.d60 > 0 ? (
                          <Badge variant={row.d60 > 30 ? 'default' : 'secondary'}>{row.d60}%</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="text-center py-2 px-4">
                        {row.d90 > 0 ? (
                          <Badge variant={row.d90 > 25 ? 'default' : 'secondary'}>{row.d90}%</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>⭐ Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map((rating, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-16 flex items-center gap-1">
                    <span className="font-medium">{rating.stars}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${rating.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm">
                    <span className="font-medium">{rating.count}</span>
                    <span className="text-muted-foreground ml-1">({rating.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Rating</span>
                <span className="text-xl font-bold">4.5 ⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* City Map Heat */}
      <Card>
        <CardHeader>
          <CardTitle>🗺 City Map Heat (Active Users per Region)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Interactive India Map with Heat Zones</p>
              <p className="text-xs">Integrate Leaflet or Google Maps</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
