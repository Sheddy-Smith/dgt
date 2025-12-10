'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, Wallet, CreditCard, Zap, RefreshCw, PieChart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function MonetizationReports({ filters }: { filters: any }) {
  const kpis = [
    { title: 'Total Revenue (Today)', value: '₹2.4L', change: '+18.5%', icon: <DollarSign className="h-4 w-4" /> },
    { title: 'This Week', value: '₹14.8L', change: '+15.2%', icon: <DollarSign className="h-4 w-4" /> },
    { title: 'This Month', value: '₹52.3L', change: '+22.7%', icon: <DollarSign className="h-4 w-4" /> },
    { title: 'Boost Plan Sales', value: '₹18.5L', change: '+25.3%', icon: <Zap className="h-4 w-4" /> },
    { title: 'Ad Revenue', value: '₹12.3L', change: '+12.8%', icon: <TrendingUp className="h-4 w-4" /> },
    { title: 'Wallet Top-ups', value: '₹8.7L', change: '+8.2%', icon: <Wallet className="h-4 w-4" /> },
    { title: 'Refunds', value: '₹1.2L', change: '-5.3%', icon: <RefreshCw className="h-4 w-4" /> },
    { title: 'ARPU', value: '₹245', change: '+6.4%', icon: <TrendingUp className="h-4 w-4" /> },
  ]

  const revenueBreakdown = [
    { product: 'Boost Plans', revenue: '₹18.5L', count: 4523, percentage: 45 },
    { product: 'Ad Campaigns', revenue: '₹12.3L', count: 287, percentage: 30 },
    { product: 'Commissions', revenue: '₹8.2L', count: 1234, percentage: 20 },
    { product: 'Subscriptions', revenue: '₹1.5L', count: 456, percentage: 3.7 },
    { product: 'Others', revenue: '₹0.6L', count: 123, percentage: 1.3 },
  ]

  const boostPlans = [
    { plan: 'Basic Boost (7 days)', sales: 2345, revenue: '₹4.7L', avgROI: '3.2x' },
    { plan: 'Premium Boost (14 days)', sales: 1234, revenue: '₹7.4L', avgROI: '4.1x' },
    { plan: 'Super Boost (30 days)', sales: 944, revenue: '₹6.4L', avgROI: '5.3x' },
  ]

  const paymentMethods = [
    { method: 'UPI', transactions: 8234, amount: '₹28.4L', percentage: 54 },
    { method: 'Cards', transactions: 3456, amount: '₹14.2L', percentage: 27 },
    { method: 'Net Banking', transactions: 2876, amount: '₹7.8L', percentage: 15 },
    { method: 'Wallet', transactions: 1234, amount: '₹1.9L', percentage: 4 },
  ]

  const topSpenders = [
    { name: 'Rajesh Motors', spent: '₹45,600', boosts: 23, revenue: '₹1.8L' },
    { name: 'Tech Hub', spent: '₹38,400', boosts: 19, revenue: '₹1.5L' },
    { name: 'Auto Expert', spent: '₹32,800', boosts: 16, revenue: '₹1.3L' },
    { name: 'Home Decor Pro', spent: '₹28,500', boosts: 14, revenue: '₹1.1L' },
    { name: 'Furniture World', spent: '₹24,200', boosts: 12, revenue: '₹0.9L' },
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
              <Badge variant={kpi.change.startsWith('+') ? 'default' : 'destructive'} className="mt-2">
                {kpi.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Revenue Trend Line (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Line Chart: Daily Revenue Trend</p>
              <p className="text-xs">Multiple lines: Boosts, Ads, Commissions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Revenue Split by Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="text-center p-4 border rounded-lg hover:bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">{item.product}</p>
                <p className="text-2xl font-bold">{item.revenue}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.count} transactions</p>
                <div className="mt-3">
                  <Progress value={item.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Boost Plans Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Boost Plan ROI (Views → Messages → Conversions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {boostPlans.map((plan, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{plan.plan}</p>
                    <Badge variant="default" className="bg-green-500">{plan.avgROI} ROI</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sales</p>
                      <p className="font-medium">{plan.sales}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium">{plan.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{method.method}</span>
                    <span className="text-muted-foreground">
                      {method.amount} ({method.percentage}%)
                    </span>
                  </div>
                  <Progress value={method.percentage} />
                  <p className="text-xs text-muted-foreground mt-1">
                    {method.transactions.toLocaleString()} transactions
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Spenders */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 Top Spending Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Rank</th>
                  <th className="text-left py-3 px-4">Seller</th>
                  <th className="text-center py-3 px-4">Total Spent</th>
                  <th className="text-center py-3 px-4">Boosts Purchased</th>
                  <th className="text-right py-3 px-4">Generated Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSpenders.map((seller, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{seller.name}</td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="default">{seller.spent}</Badge>
                    </td>
                    <td className="text-center py-3 px-4">{seller.boosts}</td>
                    <td className="text-right py-3 px-4 font-medium text-green-600">{seller.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Refund Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-red-500" />
              Refund Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Refunds</p>
                  <p className="text-xl font-bold">₹1.2L</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Count</p>
                  <p className="text-xl font-bold">234</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="text-xl font-bold">2.3%</p>
                </div>
              </div>
              <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">Refund trend chart (7-day view)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500" />
              Payout Volume Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">₹38.4L</p>
                  <Badge variant="default" className="mt-1">94.5%</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-xl font-bold">₹1.8L</p>
                  <Badge variant="outline" className="mt-1">4.4%</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-xl font-bold">₹0.4L</p>
                  <Badge variant="destructive" className="mt-1">1.1%</Badge>
                </div>
              </div>
              <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">Payout success rate chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Fees */}
      <Card>
        <CardHeader>
          <CardTitle>💵 Platform Fees Collected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground mb-1">Transaction Fees</p>
              <p className="text-2xl font-bold">₹3.2L</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground mb-1">Commission (5%)</p>
              <p className="text-2xl font-bold">₹8.2L</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-primary/5">
              <p className="text-sm text-muted-foreground mb-1">Service Charges</p>
              <p className="text-2xl font-bold">₹1.8L</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-green-100 dark:bg-green-950">
              <p className="text-sm text-muted-foreground mb-1">Total Fees</p>
              <p className="text-2xl font-bold text-green-600">₹13.2L</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
