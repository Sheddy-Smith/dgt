'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw,
  Mail,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  FileText,
  Table2
} from 'lucide-react'
import { MarketplaceOverview } from '@/components/reports/marketplace-overview'
import { UserAnalytics } from '@/components/reports/user-analytics'
import { ListingInsights } from '@/components/reports/listing-insights'
import { MonetizationReports } from '@/components/reports/monetization-reports'
import { TrustSafety } from '@/components/reports/trust-safety'
import { OperationalSLAs } from '@/components/reports/operational-slas'
import { RetentionEngagement } from '@/components/reports/retention-engagement'
import { CustomReports } from '@/components/reports/custom-reports'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Badge } from '@/components/ui/badge'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7d')
  const [city, setCity] = useState('all')
  const [category, setCategory] = useState('all')
  const [platform, setPlatform] = useState('all')
  const [compareMode, setCompareMode] = useState('week')
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock user role - in production, get from auth context
  const userRole = 'Super Admin' // Super Admin | Analyst | Finance | Moderator | Marketing | Support

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    console.log(`Exporting as ${format}`)
    // Implement export logic
  }

  const handleScheduleReport = () => {
    console.log('Opening schedule dialog')
    // Implement scheduling
  }

  const getRoleBasedTabs = () => {
    const allTabs = [
      { value: 'overview', label: 'Marketplace Overview', roles: ['Super Admin', 'Analyst'] },
      { value: 'users', label: 'User Analytics', roles: ['Super Admin', 'Analyst', 'Marketing'] },
      { value: 'listings', label: 'Listing Insights', roles: ['Super Admin', 'Analyst'] },
      { value: 'monetization', label: 'Monetization Reports', roles: ['Super Admin', 'Analyst', 'Finance'] },
      { value: 'trust', label: 'Trust & Safety', roles: ['Super Admin', 'Analyst', 'Moderator'] },
      { value: 'sla', label: 'Operational SLAs', roles: ['Super Admin', 'Analyst', 'Support'] },
      { value: 'retention', label: 'Retention & Engagement', roles: ['Super Admin', 'Analyst', 'Marketing'] },
      { value: 'custom', label: 'Custom Reports', roles: ['Super Admin', 'Analyst', 'Finance', 'Marketing'] },
    ]

    return allTabs.filter(tab => tab.roles.includes(userRole))
  }

  const visibleTabs = getRoleBasedTabs()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive marketplace performance and insights dashboard
            </p>
            <Badge variant="outline" className="mt-2">{userRole}</Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleScheduleReport}>
              <Mail className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Global Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Global Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cars">Cars</SelectItem>
                    <SelectItem value="bikes">Bikes</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Platform Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
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

              {/* Compare Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Compare vs</label>
                <Select value={compareMode} onValueChange={setCompareMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary">Apply Filters</Button>
              <Button size="sm" variant="ghost">Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue={visibleTabs[0]?.value || 'overview'} className="space-y-6">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)` }}>
            {visibleTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <MarketplaceOverview filters={{ dateRange, city, category, platform, compareMode }} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserAnalytics filters={{ dateRange, city, category, platform, compareMode }} />
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <ListingInsights filters={{ dateRange, city, category, platform, compareMode }} />
          </TabsContent>

          <TabsContent value="monetization" className="space-y-6">
            <MonetizationReports filters={{ dateRange, city, category, platform, compareMode }} />
          </TabsContent>

          <TabsContent value="trust" className="space-y-6">
            <TrustSafety filters={{ dateRange, city, category, platform, compareMode }} />
          </TabsContent>

          <TabsContent value="sla" className="space-y-6">
            <OperationalSLAs filters={{ dateRange, city, category, platform, compareMode }} />
          </TabsContent>

          <TabsContent value="retention" className="space-y-6">
            <RetentionEngagement filters={{ dateRange, city, category, platform, compareMode }} />
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <CustomReports />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
