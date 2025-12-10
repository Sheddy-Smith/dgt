'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
  Users,
  Target,
  Download,
  Calendar,
  MapPin,
  Tag,
  Percent
} from 'lucide-react'

export function AnalyticsTab() {
  const [dateRange, setDateRange] = useState('30d')
  const [platform, setPlatform] = useState('all')
  const [segment, setSegment] = useState('all')

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 w-full md:w-auto">
              <div className="space-y-2 flex-1 md:flex-none md:w-48">
                <Label className="text-xs">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1 md:flex-none md:w-48">
                <Label className="text-xs">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="android">Android</SelectItem>
                    <SelectItem value="ios">iOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1 md:flex-none md:w-48">
                <Label className="text-xs">Audience Segment</Label>
                <Select value={segment} onValueChange={setSegment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="sellers">Sellers</SelectItem>
                    <SelectItem value="buyers">Buyers</SelectItem>
                    <SelectItem value="new">New Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="banners">Banner CTR</TabsTrigger>
          <TabsTrigger value="boost">Boost ROI</TabsTrigger>
          <TabsTrigger value="coupons">Coupon Usage</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Impact</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Split</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewAnalytics />
        </TabsContent>

        <TabsContent value="banners">
          <BannerCTRAnalytics />
        </TabsContent>

        <TabsContent value="boost">
          <BoostROIAnalytics />
        </TabsContent>

        <TabsContent value="coupons">
          <CouponAnalytics />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignAnalytics />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueSplitAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OverviewAnalytics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold">2.4M</p>
                <p className="text-xs text-green-600 mt-1">+18% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">89.2K</p>
                <p className="text-xs text-green-600 mt-1">+22% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg CTR</p>
                <p className="text-2xl font-bold">3.72%</p>
                <p className="text-xs text-green-600 mt-1">+0.3% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">6,892</p>
                <p className="text-xs text-green-600 mt-1">+15% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Line chart: Impressions, Clicks, CTR over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Pie chart: Category-wise CTR distribution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Content Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content Type</TableHead>
                <TableHead>Active Count</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Home Banners</TableCell>
                <TableCell>12</TableCell>
                <TableCell>1,234,567</TableCell>
                <TableCell>45,678</TableCell>
                <TableCell><Badge variant="secondary">3.7%</Badge></TableCell>
                <TableCell>3,421</TableCell>
                <TableCell><Badge variant="secondary">7.5%</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Category Ads</TableCell>
                <TableCell>25</TableCell>
                <TableCell>876,543</TableCell>
                <TableCell>34,567</TableCell>
                <TableCell><Badge variant="secondary">3.9%</Badge></TableCell>
                <TableCell>2,345</TableCell>
                <TableCell><Badge variant="secondary">6.8%</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Boost Plans</TableCell>
                <TableCell>4</TableCell>
                <TableCell>234,567</TableCell>
                <TableCell>7,890</TableCell>
                <TableCell><Badge variant="secondary">3.4%</Badge></TableCell>
                <TableCell>892</TableCell>
                <TableCell><Badge variant="secondary">11.3%</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Campaigns</TableCell>
                <TableCell>5</TableCell>
                <TableCell>405,678</TableCell>
                <TableCell>21,234</TableCell>
                <TableCell><Badge variant="secondary">5.2%</Badge></TableCell>
                <TableCell>1,234</TableCell>
                <TableCell><Badge variant="secondary">5.8%</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function BannerCTRAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Banner CTR</p>
              <p className="text-3xl font-bold">3.7%</p>
              <p className="text-xs text-green-600 mt-1">Industry avg: 2.1%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Best Performing</p>
              <p className="text-xl font-bold">BNR-003</p>
              <p className="text-xs text-muted-foreground mt-1">CTR: 5.8%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Banner Views</p>
              <p className="text-3xl font-bold">1.2M</p>
              <p className="text-xs text-green-600 mt-1">Last 30 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Banner Performance by Placement</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono">BNR-003</TableCell>
                <TableCell>New Year Offers</TableCell>
                <TableCell><Badge variant="outline">Home</Badge></TableCell>
                <TableCell>234,567</TableCell>
                <TableCell>13,605</TableCell>
                <TableCell><Badge className="bg-green-500">5.8%</Badge></TableCell>
                <TableCell>1,089</TableCell>
                <TableCell><Badge className="bg-green-100 text-green-700">Excellent</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">BNR-001</TableCell>
                <TableCell>Winter Sale 2024</TableCell>
                <TableCell><Badge variant="outline">Home</Badge></TableCell>
                <TableCell>125,432</TableCell>
                <TableCell>5,268</TableCell>
                <TableCell><Badge className="bg-blue-500">4.2%</Badge></TableCell>
                <TableCell>421</TableCell>
                <TableCell><Badge className="bg-blue-100 text-blue-700">Good</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">BNR-002</TableCell>
                <TableCell>Boost Your Listing</TableCell>
                <TableCell><Badge variant="outline">Category</Badge></TableCell>
                <TableCell>89,234</TableCell>
                <TableCell>3,391</TableCell>
                <TableCell><Badge className="bg-blue-500">3.8%</Badge></TableCell>
                <TableCell>271</TableCell>
                <TableCell><Badge className="bg-blue-100 text-blue-700">Good</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono">BNR-005</TableCell>
                <TableCell>Flash Sale Alert</TableCell>
                <TableCell><Badge variant="outline">Search</Badge></TableCell>
                <TableCell>45,678</TableCell>
                <TableCell>1,370</TableCell>
                <TableCell><Badge className="bg-yellow-500">3.0%</Badge></TableCell>
                <TableCell>82</TableCell>
                <TableCell><Badge className="bg-yellow-100 text-yellow-700">Average</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CTR Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Line chart showing CTR trends for top banners</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BoostROIAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">₹15.2L</p>
              <p className="text-xs text-green-600 mt-1">+24% this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Active Boosted</p>
              <p className="text-3xl font-bold">588</p>
              <p className="text-xs text-muted-foreground mt-1">Listings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Views/Boost</p>
              <p className="text-3xl font-bold">2,340</p>
              <p className="text-xs text-green-600 mt-1">+12% vs organic</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Messages</p>
              <p className="text-3xl font-bold">18</p>
              <p className="text-xs text-muted-foreground mt-1">Per boosted listing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Boost Plan Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg Views</TableHead>
                <TableHead>Avg Messages</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>ROI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Ultimate Boost</TableCell>
                <TableCell>₹799</TableCell>
                <TableCell>892</TableCell>
                <TableCell className="font-bold text-green-600">₹7,12,508</TableCell>
                <TableCell>4,567</TableCell>
                <TableCell>28</TableCell>
                <TableCell><Badge className="bg-green-500">87%</Badge></TableCell>
                <TableCell><Badge className="bg-green-100 text-green-700">High</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Premium Boost</TableCell>
                <TableCell>₹249</TableCell>
                <TableCell>2,456</TableCell>
                <TableCell className="font-bold text-green-600">₹6,11,544</TableCell>
                <TableCell>3,234</TableCell>
                <TableCell>21</TableCell>
                <TableCell><Badge className="bg-green-500">82%</Badge></TableCell>
                <TableCell><Badge className="bg-green-100 text-green-700">High</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Basic Boost</TableCell>
                <TableCell>₹99</TableCell>
                <TableCell>1,234</TableCell>
                <TableCell className="font-bold text-green-600">₹1,22,166</TableCell>
                <TableCell>1,890</TableCell>
                <TableCell>14</TableCell>
                <TableCell><Badge className="bg-blue-500">76%</Badge></TableCell>
                <TableCell><Badge className="bg-blue-100 text-blue-700">Medium</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-2" />
                <p>Bar chart: Revenue by plan type over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Pie chart: Sales by plan type</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CouponAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Redemptions</p>
              <p className="text-3xl font-bold">1,808</p>
              <p className="text-xs text-green-600 mt-1">Last 30 days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Redemption Rate</p>
              <p className="text-3xl font-bold">23.4%</p>
              <p className="text-xs text-muted-foreground mt-1">Of distributed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Discount</p>
              <p className="text-3xl font-bold">₹87</p>
              <p className="text-xs text-muted-foreground mt-1">Per redemption</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-3xl font-bold">₹1.57L</p>
              <p className="text-xs text-muted-foreground mt-1">Provided to users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Distributed</TableHead>
                <TableHead>Redeemed</TableHead>
                <TableHead>Redemption Rate</TableHead>
                <TableHead>Total Savings</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><code className="bg-muted px-2 py-1 rounded font-bold">NEWUSER25</code></TableCell>
                <TableCell><Badge variant="outline">Percentage</Badge></TableCell>
                <TableCell>25%</TableCell>
                <TableCell>5,234</TableCell>
                <TableCell>1,234</TableCell>
                <TableCell><Badge className="bg-green-500">23.6%</Badge></TableCell>
                <TableCell className="font-bold">₹87,450</TableCell>
                <TableCell><Badge className="bg-green-500">Active</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code className="bg-muted px-2 py-1 rounded font-bold">WINTER50</code></TableCell>
                <TableCell><Badge variant="outline">Percentage</Badge></TableCell>
                <TableCell>50%</TableCell>
                <TableCell>1,890</TableCell>
                <TableCell>342</TableCell>
                <TableCell><Badge className="bg-blue-500">18.1%</Badge></TableCell>
                <TableCell className="font-bold">₹45,600</TableCell>
                <TableCell><Badge className="bg-green-500">Active</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code className="bg-muted px-2 py-1 rounded font-bold">BOOST100</code></TableCell>
                <TableCell><Badge variant="outline">Flat</Badge></TableCell>
                <TableCell>₹100</TableCell>
                <TableCell>892</TableCell>
                <TableCell>187</TableCell>
                <TableCell><Badge className="bg-yellow-500">21.0%</Badge></TableCell>
                <TableCell className="font-bold">₹18,700</TableCell>
                <TableCell><Badge className="bg-green-500">Active</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Redemption Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <Percent className="h-12 w-12 mx-auto mb-2" />
                <p>Line chart: Daily redemptions over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fraud Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Valid Redemptions</p>
                  <p className="text-2xl font-bold">1,763</p>
                </div>
                <Badge className="bg-green-500">97.5%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Blocked (Fraud)</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
                <Badge className="bg-red-500">2.5%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium">Under Review</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Badge className="bg-yellow-500">0.7%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CampaignAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-3xl font-bold">405K</p>
              <p className="text-xs text-green-600 mt-1">All channels</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Open Rate</p>
              <p className="text-3xl font-bold">58.2%</p>
              <p className="text-xs text-green-600 mt-1">+3% vs last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Click-Through</p>
              <p className="text-3xl font-bold">24.8%</p>
              <p className="text-xs text-green-600 mt-1">Of opened</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Conversions</p>
              <p className="text-3xl font-bold">4,561</p>
              <p className="text-xs text-muted-foreground mt-1">From campaigns</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance by Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>Converted</TableHead>
                <TableHead>Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Push Notification
                </TableCell>
                <TableCell>234,567</TableCell>
                <TableCell>145,678</TableCell>
                <TableCell><Badge className="bg-green-500">62.1%</Badge></TableCell>
                <TableCell>36,420</TableCell>
                <TableCell><Badge className="bg-blue-500">25.0%</Badge></TableCell>
                <TableCell>2,913</TableCell>
                <TableCell><Badge className="bg-purple-500">8.0%</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TableCell>
                <TableCell>125,432</TableCell>
                <TableCell>65,225</TableCell>
                <TableCell><Badge className="bg-green-500">52.0%</Badge></TableCell>
                <TableCell>13,045</TableCell>
                <TableCell><Badge className="bg-blue-500">20.0%</Badge></TableCell>
                <TableCell>1,174</TableCell>
                <TableCell><Badge className="bg-purple-500">9.0%</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS
                </TableCell>
                <TableCell>45,678</TableCell>
                <TableCell>25,873</TableCell>
                <TableCell><Badge className="bg-yellow-500">56.6%</Badge></TableCell>
                <TableCell>5,175</TableCell>
                <TableCell><Badge className="bg-blue-500">20.0%</Badge></TableCell>
                <TableCell>414</TableCell>
                <TableCell><Badge className="bg-purple-500">8.0%</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { city: 'Mumbai', engagement: 89, conversions: 1234 },
                { city: 'Delhi', engagement: 85, conversions: 1098 },
                { city: 'Bangalore', engagement: 82, conversions: 892 },
                { city: 'Pune', engagement: 78, conversions: 734 },
                { city: 'Hyderabad', engagement: 75, conversions: 603 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{item.city}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <Badge variant="secondary">{item.engagement}%</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="font-bold">{item.conversions}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Impact Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>Area chart: Open rate vs conversion over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RevenueSplitAnalytics() {
  const revenueData = [
    { source: 'Boost Plans', amount: 1522000, percentage: 68, color: 'bg-purple-500' },
    { source: 'Banner Ads', amount: 458000, percentage: 20, color: 'bg-blue-500' },
    { source: 'Featured Listings', amount: 246000, percentage: 11, color: 'bg-green-500' },
    { source: 'Subscriptions', amount: 22000, percentage: 1, color: 'bg-orange-500' }
  ]

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-5xl font-bold text-green-600">₹{(totalRevenue / 100000).toFixed(2)}L</p>
            <p className="text-muted-foreground mt-2">+18% vs last month</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.source}</span>
                    <span className="font-bold">₹{(item.amount / 100000).toFixed(2)}L ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className={`${item.color} h-3 rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center text-muted-foreground">
                <DollarSign className="h-12 w-12 mx-auto mb-2" />
                <p>Pie chart: Revenue split by source</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Stacked area chart: Revenue trends over last 6 months</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Revenue Source</TableHead>
                <TableHead>This Month</TableHead>
                <TableHead>Last Month</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Boost Plans</TableCell>
                <TableCell>₹15.22L</TableCell>
                <TableCell>₹12.89L</TableCell>
                <TableCell><Badge className="bg-green-500">+18%</Badge></TableCell>
                <TableCell><TrendingUp className="h-4 w-4 text-green-600" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Banner Ads</TableCell>
                <TableCell>₹4.58L</TableCell>
                <TableCell>₹3.92L</TableCell>
                <TableCell><Badge className="bg-green-500">+17%</Badge></TableCell>
                <TableCell><TrendingUp className="h-4 w-4 text-green-600" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Featured Listings</TableCell>
                <TableCell>₹2.46L</TableCell>
                <TableCell>₹2.34L</TableCell>
                <TableCell><Badge className="bg-green-500">+5%</Badge></TableCell>
                <TableCell><TrendingUp className="h-4 w-4 text-green-600" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Subscriptions</TableCell>
                <TableCell>₹0.22L</TableCell>
                <TableCell>₹0.19L</TableCell>
                <TableCell><Badge className="bg-green-500">+16%</Badge></TableCell>
                <TableCell><TrendingUp className="h-4 w-4 text-green-600" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
