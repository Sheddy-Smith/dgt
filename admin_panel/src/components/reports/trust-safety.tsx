'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertTriangle, Flag, Ban, TrendingDown, Activity, Bot, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function TrustSafety({ filters }: { filters: any }) {
  const kpis = [
    { title: 'Reports per 1k Listings', value: '1.2', change: '-0.3', trend: 'down', icon: <Flag className="h-4 w-4" /> },
    { title: 'Auto-flag % (AI)', value: '34.5%', change: '+2.1%', trend: 'up', icon: <Bot className="h-4 w-4" /> },
    { title: 'Manual Moderation Rate', value: '65.5%', change: '-2.1%', trend: 'down', icon: <Eye className="h-4 w-4" /> },
    { title: 'Blocked Users', value: '234', change: '+12', trend: 'up', icon: <Ban className="h-4 w-4" /> },
    { title: 'Repeat Offender %', value: '8.7%', change: '-1.2%', trend: 'down', icon: <AlertTriangle className="h-4 w-4" /> },
    { title: 'Refund due to Fraud', value: '₹45,600', change: '-₹8,200', trend: 'down', icon: <TrendingDown className="h-4 w-4" /> },
    { title: 'Scam Phrase Frequency', value: '87', change: '+5', trend: 'up', icon: <Activity className="h-4 w-4" /> },
    { title: 'AI Flag Accuracy', value: '87.3%', change: '+3.4%', trend: 'up', icon: <Shield className="h-4 w-4" /> },
  ]

  const alerts = [
    { 
      severity: 'high', 
      message: 'Spike in Off-platform Payment Attempts', 
      count: 45, 
      change: '+230%',
      category: 'Electronics' 
    },
    { 
      severity: 'medium', 
      message: 'High Fraud Reports in Cars > ₹5L Segment', 
      count: 23, 
      change: '+85%',
      category: 'Cars' 
    },
    { 
      severity: 'low', 
      message: 'Duplicate Listing Detection Rate Improved', 
      count: 12, 
      change: '+15%',
      category: 'All' 
    },
  ]

  const reportReasons = [
    { reason: 'Scam/Fraud', count: 145, percentage: 42, trend: '+12%' },
    { reason: 'Fake Product', count: 98, percentage: 28, trend: '+8%' },
    { reason: 'Abusive Content', count: 67, percentage: 19, trend: '-5%' },
    { reason: 'Counterfeit', count: 28, percentage: 8, trend: '+3%' },
    { reason: 'Other', count: 10, percentage: 3, trend: '0%' },
  ]

  const fraudByCategory = [
    { category: 'Electronics', reports: 87, rate: '2.8%', color: 'bg-red-500' },
    { category: 'Cars', reports: 64, rate: '1.9%', color: 'bg-orange-500' },
    { category: 'Real Estate', reports: 42, rate: '3.2%', color: 'bg-red-600' },
    { category: 'Bikes', reports: 28, rate: '1.2%', color: 'bg-yellow-500' },
    { category: 'Furniture', reports: 13, rate: '0.8%', color: 'bg-green-500' },
  ]

  const moderationStats = [
    { action: 'Listings Approved', count: 8234, avgTime: '8m' },
    { action: 'Listings Rejected', count: 487, avgTime: '12m' },
    { action: 'Users Warned', count: 234, avgTime: '15m' },
    { action: 'Users Blocked', count: 87, avgTime: '25m' },
  ]

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <Alert 
            key={index} 
            variant={alert.severity === 'high' ? 'destructive' : 'default'}
            className={
              alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-950' :
              alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' :
              'border-green-500 bg-green-50 dark:bg-green-950'
            }
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <span className="font-medium">{alert.message}</span>
                <span className="text-xs ml-2">
                  ({alert.count} incidents, {alert.change} vs last week)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{alert.category}</Badge>
                <Button size="sm" variant="outline">Investigate</Button>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>

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
              <Badge variant={kpi.trend === 'down' ? 'default' : 'outline'} className="mt-2">
                {kpi.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Reason Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              Report Reason Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportReasons.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.reason}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                      <Badge variant="outline" className="text-xs">{item.trend}</Badge>
                    </div>
                  </div>
                  <Progress value={item.percentage} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fraud by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Fraud Source (Category / City / User Type)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fraudByCategory.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive">{item.rate}</Badge>
                    <span className="text-sm text-muted-foreground">{item.reports} reports</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Performance */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Moderation Actions & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {moderationStats.map((stat, index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">{stat.action}</p>
                <p className="text-2xl font-bold mb-1">{stat.count.toLocaleString()}</p>
                <Badge variant="outline">Avg: {stat.avgTime}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI vs Manual Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              AI Flag vs Manual Flag Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                  <p className="text-sm text-muted-foreground mb-1">AI Auto-flag</p>
                  <p className="text-2xl font-bold">34.5%</p>
                  <p className="text-xs text-green-600 mt-1">87.3% accuracy</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Manual Review</p>
                  <p className="text-2xl font-bold">65.5%</p>
                  <p className="text-xs text-green-600 mt-1">95.8% accuracy</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span>True Positives (AI)</span>
                  <span className="font-medium">876 / 1,003</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>False Positives (AI)</span>
                  <span className="font-medium text-red-600">127</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Human Review Required</span>
                  <span className="font-medium">2,134</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Duplicate Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Duplicate Listing Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Detected</p>
                  <p className="text-2xl font-bold">234</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Detection Rate</p>
                  <p className="text-2xl font-bold">92.3%</p>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Recent Duplicates by Category</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Cars</span>
                    <Badge variant="outline">87</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Electronics</span>
                    <Badge variant="outline">64</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bikes</span>
                    <Badge variant="outline">45</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listing Rejection Causes */}
      <Card>
        <CardHeader>
          <CardTitle>❌ Listing Rejection Causes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Bar Chart: Rejection Reasons (Fake, Spam, Policy Violation, etc.)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Account Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Device/IP Clustering (Multi-Account Detection)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Suspicious Clusters Detected</p>
                  <p className="text-sm text-muted-foreground">Same device/IP with multiple accounts</p>
                </div>
                <Badge variant="destructive" className="text-lg">34</Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Accounts Flagged</p>
                <p className="text-xl font-bold">187</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-xl font-bold">98</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Blocked</p>
                <p className="text-xl font-bold">45</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Freeze History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-orange-500" />
            Wallet Freeze History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Total Wallets Frozen</span>
              <Badge variant="destructive">87</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Amount Frozen</span>
              <Badge variant="outline" className="text-base">₹2.34L</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm">Resolved Cases</span>
              <Badge variant="default">34</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
