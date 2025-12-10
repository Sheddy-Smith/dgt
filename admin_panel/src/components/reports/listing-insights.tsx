'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, CheckCircle, XCircle, Clock, TrendingUp, Flag, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

export function ListingInsights({ filters }: { filters: any }) {
  const kpis = [
    { title: 'Total Listings', value: '24,567', change: '+12.3%', icon: <Package className="h-4 w-4" /> },
    { title: 'Active', value: '12,453', change: '+8.7%', icon: <CheckCircle className="h-4 w-4" /> },
    { title: 'Expired', value: '8,234', change: '+5.2%', icon: <XCircle className="h-4 w-4" /> },
    { title: 'Pending Approval', value: '567', change: '-3.1%', icon: <Clock className="h-4 w-4" /> },
    { title: 'Avg Price', value: '₹45,230', change: '+2.8%', icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'Boosted %', value: '18.5%', change: '+4.2%', icon: <Zap className="h-4 w-4" /> },
    { title: 'Reported', value: '234', change: '-8.4%', icon: <Flag className="h-4 w-4" /> },
    { title: 'Approval Rate', value: '94.2%', change: '+1.3%', icon: <CheckCircle className="h-4 w-4" /> },
  ]

  const categoryVolumes = [
    { category: 'Cars', count: 6892, active: 3421, expired: 2543, pending: 928, avgPrice: '₹4.2L' },
    { category: 'Bikes', count: 5401, active: 2876, expired: 1987, pending: 538, avgPrice: '₹45K' },
    { category: 'Electronics', count: 4423, active: 2234, expired: 1876, pending: 313, avgPrice: '₹18K' },
    { category: 'Furniture', count: 3684, active: 1987, expired: 1432, pending: 265, avgPrice: '₹12K' },
    { category: 'Real Estate', count: 2456, active: 1234, expired: 987, pending: 235, avgPrice: '₹35L' },
  ]

  const topSellers = [
    { name: 'Rajesh Motors', listings: 234, sales: 187, rating: 4.8, city: 'Mumbai' },
    { name: 'Tech Hub', listings: 198, sales: 156, rating: 4.7, city: 'Bangalore' },
    { name: 'Home Decor Pro', listings: 176, sales: 143, rating: 4.6, city: 'Delhi' },
    { name: 'Auto Expert', listings: 154, sales: 132, rating: 4.9, city: 'Hyderabad' },
    { name: 'Furniture World', listings: 142, sales: 118, rating: 4.5, city: 'Chennai' },
  ]

  const qualityScoreDistribution = [
    { score: '90-100', count: 8234, percentage: 33.5, color: 'bg-green-500' },
    { score: '70-89', count: 10234, percentage: 41.7, color: 'bg-blue-500' },
    { score: '50-69', count: 4567, percentage: 18.6, color: 'bg-yellow-500' },
    { score: 'Below 50', count: 1532, percentage: 6.2, color: 'bg-red-500' },
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

      {/* Category-wise Listing Volume */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>📊 Category-wise Listing Volume</CardTitle>
            <Button variant="outline" size="sm">View Details</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-center py-3 px-4">Total</th>
                  <th className="text-center py-3 px-4">Active</th>
                  <th className="text-center py-3 px-4">Expired</th>
                  <th className="text-center py-3 px-4">Pending</th>
                  <th className="text-right py-3 px-4">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {categoryVolumes.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{row.category}</td>
                    <td className="text-center py-3 px-4">{row.count.toLocaleString()}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="default">{row.active.toLocaleString()}</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">{row.expired.toLocaleString()}</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline">{row.pending.toLocaleString()}</Badge>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">{row.avgPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listing Lifecycle Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Listing Lifecycle Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Posted</span>
                  <span className="font-medium">100% (24,567)</span>
                </div>
                <Progress value={100} className="bg-blue-200" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Approved</span>
                  <span className="font-medium">94.2% (23,142)</span>
                </div>
                <Progress value={94.2} className="bg-green-200" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active (Non-Expired)</span>
                  <span className="font-medium">50.7% (12,453)</span>
                </div>
                <Progress value={50.7} className="bg-yellow-200" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sold/Closed</span>
                  <span className="font-medium">18.2% (4,467)</span>
                </div>
                <Progress value={18.2} className="bg-purple-200" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boost Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Boost Performance (vs Organic)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950">
                  <p className="text-sm text-muted-foreground mb-1">Boosted Listings</p>
                  <p className="text-2xl font-bold">4,545</p>
                  <p className="text-xs text-muted-foreground mt-1">18.5% of total</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Organic Listings</p>
                  <p className="text-2xl font-bold">20,022</p>
                  <p className="text-xs text-muted-foreground mt-1">81.5% of total</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg Views (Boosted)</span>
                  <span className="font-medium">342</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Views (Organic)</span>
                  <span className="font-medium">87</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="font-medium">Boost Multiplier</span>
                  <Badge variant="default" className="bg-green-500">3.9x</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sellers */}
        <Card>
          <CardHeader>
            <CardTitle>🏆 Top Sellers by Listing Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{seller.listings} listings</Badge>
                      <Badge variant="default">{seller.sales} sales</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">⭐ {seller.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>✅ Listing Quality Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityScoreDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.score}</span>
                    <span className="text-muted-foreground">
                      {item.count.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Average Quality Score</p>
              <p className="text-2xl font-bold">76.3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Price Heatmap per Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Heatmap Chart: Category vs Price Range</p>
              <p className="text-xs">Color intensity = listing density</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiry Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Expiry Patterns (Weekday Trend)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Bar Chart: Expirations by Day of Week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
