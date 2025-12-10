'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, Package, DollarSign, MessageSquare, Clock, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface KPICardProps {
  title: string
  value: string | number
  change: number
  changeLabel: string
  icon: React.ReactNode
  trend?: 'up' | 'down'
}

function KPICard({ title, value, change, changeLabel, icon, trend = 'up' }: KPICardProps) {
  const isPositive = change > 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={isPositive ? 'default' : 'destructive'} className="flex items-center gap-1">
            <TrendIcon className="h-3 w-3" />
            {Math.abs(change)}%
          </Badge>
          <span className="text-xs text-muted-foreground">{changeLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function MarketplaceOverview({ filters }: { filters: any }) {
  // Mock data - replace with actual API calls
  const kpis = [
    { title: 'Active Listings', value: '12,453', change: 12.5, changeLabel: 'vs last week', icon: <Package className="h-4 w-4" /> },
    { title: 'New Listings Today', value: '234', change: 8.2, changeLabel: 'vs yesterday', icon: <Package className="h-4 w-4" /> },
    { title: 'Unique Sellers', value: '5,678', change: 15.3, changeLabel: 'vs last week', icon: <Users className="h-4 w-4" /> },
    { title: 'Active Buyers', value: '18,924', change: 22.1, changeLabel: 'vs last week', icon: <Users className="h-4 w-4" /> },
    { title: 'GMV', value: '₹45.2L', change: 18.7, changeLabel: 'vs last week', icon: <DollarSign className="h-4 w-4" /> },
    { title: 'Transactions', value: '1,234', change: 9.4, changeLabel: 'vs last week', icon: <Activity className="h-4 w-4" /> },
    { title: 'Avg Time-to-Sell', value: '4.2 days', change: -12.3, changeLabel: 'improvement', icon: <Clock className="h-4 w-4" /> },
    { title: 'DAU / MAU', value: '42.3%', change: 5.8, changeLabel: 'vs last week', icon: <Activity className="h-4 w-4" /> },
  ]

  const topCities = [
    { name: 'Mumbai', listings: 3245, sales: 892, gmv: '₹12.4L' },
    { name: 'Delhi', listings: 2876, sales: 743, gmv: '₹9.8L' },
    { name: 'Bangalore', listings: 2543, sales: 678, gmv: '₹11.2L' },
    { name: 'Hyderabad', listings: 1987, sales: 534, gmv: '₹6.7L' },
    { name: 'Chennai', listings: 1654, sales: 456, gmv: '₹5.4L' },
  ]

  const categoryMix = [
    { name: 'Cars', percentage: 28, color: 'bg-blue-500' },
    { name: 'Bikes', percentage: 22, color: 'bg-green-500' },
    { name: 'Electronics', percentage: 18, color: 'bg-purple-500' },
    { name: 'Furniture', percentage: 15, color: 'bg-orange-500' },
    { name: 'Real Estate', percentage: 10, color: 'bg-red-500' },
    { name: 'Others', percentage: 7, color: 'bg-gray-500' },
  ]

  const revenueSplit = [
    { source: 'Boosts', amount: '₹18.5L', percentage: 45 },
    { source: 'Ads', amount: '₹12.3L', percentage: 30 },
    { source: 'Commissions', amount: '₹8.2L', percentage: 20 },
    { source: 'Others', amount: '₹2.1L', percentage: 5 },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings Growth Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Listings Growth (Daily Trend)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Line Chart: Daily Listings</p>
                <p className="text-xs">Integrate recharts or Chart.js</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>💬 Message Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Listing Posted</span>
                  <span className="font-medium">100% (12,453)</span>
                </div>
                <Progress value={100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Messages Received</span>
                  <span className="font-medium">68% (8,468)</span>
                </div>
                <Progress value={68} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Negotiations Started</span>
                  <span className="font-medium">42% (5,230)</span>
                </div>
                <Progress value={42} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sales Completed</span>
                  <span className="font-medium">18% (2,241)</span>
                </div>
                <Progress value={18} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Cities */}
        <Card>
          <CardHeader>
            <CardTitle>🌆 Top 10 Cities (by Listings & Sales)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{city.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {city.listings} listings · {city.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{city.gmv}</p>
                    <p className="text-xs text-muted-foreground">GMV</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Mix */}
        <Card>
          <CardHeader>
            <CardTitle>🏷 Category Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryMix.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`${category.color} h-2 rounded-full`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Split */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Revenue Split: Boosts | Ads | Commissions | Others</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {revenueSplit.map((item, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{item.source}</p>
                <p className="text-2xl font-bold mb-1">{item.amount}</p>
                <Badge variant="outline">{item.percentage}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Average Listing Age */}
      <Card>
        <CardHeader>
          <CardTitle>🕒 Average Listing Age Before Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Bar Chart: Category vs Days to Sell</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
