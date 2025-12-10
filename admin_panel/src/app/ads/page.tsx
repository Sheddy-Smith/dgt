'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  Download, 
  Play, 
  Pause, 
  Calendar, 
  Copy, 
  Trash2,
  Eye,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target
} from 'lucide-react'
import { HomeBannersTab } from '@/components/ads/home-banners-tab'
import { CategoryAdsTab } from '@/components/ads/category-ads-tab'
import { BoostPlansTab } from '@/components/ads/boost-plans-tab'
import { CouponsTab } from '@/components/ads/coupons-tab'
import { CampaignsTab } from '@/components/ads/campaigns-tab'
import { AnalyticsTab } from '@/components/ads/analytics-tab'

export default function AdsPromotionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('home-banners')

  // Dashboard KPIs
  const kpis = [
    {
      label: 'Active Banners',
      value: '12',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Avg CTR',
      value: '3.7%',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Boost Revenue Today',
      value: '₹24,500',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Coupon Redemptions',
      value: '238',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Campaigns Running',
      value: '5',
      icon: BarChart3,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      label: 'Cities Active',
      value: '28',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ads, Banners & Promotions</h1>
          <p className="text-muted-foreground mt-1">
            Control marketplace visual and promotional content — banners, ads, boost plans, coupons, and campaigns
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
                    </div>
                    <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Topbar - Search and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Banner ID, Campaign Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" className="flex-1 md:flex-none">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
            <TabsTrigger value="home-banners" className="text-xs md:text-sm">
              🏠 Home Banners
            </TabsTrigger>
            <TabsTrigger value="category-ads" className="text-xs md:text-sm">
              🧩 Category Ads
            </TabsTrigger>
            <TabsTrigger value="boost-plans" className="text-xs md:text-sm">
              💎 Boost Plans
            </TabsTrigger>
            <TabsTrigger value="coupons" className="text-xs md:text-sm">
              🎟️ Coupons
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="text-xs md:text-sm">
              📢 Campaigns
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              📊 Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home-banners">
            <HomeBannersTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="category-ads">
            <CategoryAdsTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="boost-plans">
            <BoostPlansTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="coupons">
            <CouponsTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignsTab searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
