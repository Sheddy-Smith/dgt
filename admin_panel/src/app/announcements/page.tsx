'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BroadcastsTab } from '@/components/announcements/broadcasts-tab'
import { SystemEventsTab } from '@/components/announcements/system-events-tab'
import { TemplatesTab } from '@/components/announcements/templates-tab'
import { AudiencesTab } from '@/components/announcements/audiences-tab'
import { DeliveryLogsTab } from '@/components/announcements/delivery-logs-tab'
import { AnalyticsTab } from '@/components/announcements/analytics-tab'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Download, Bell, Radio, FileText, Users, ListChecks, BarChart3 } from 'lucide-react'

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState('broadcasts')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })

  const handleExport = () => {
    // Export logic based on active tab
    console.log(`Exporting ${activeTab} data...`)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements & Notifications</h1>
          <p className="text-muted-foreground">
            Manage multi-channel notifications, campaigns, and system events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user, phone, email, campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="broadcasts" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Broadcasts
          </TabsTrigger>
          <TabsTrigger value="system-events" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            System Events
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="audiences" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audiences
          </TabsTrigger>
          <TabsTrigger value="delivery-logs" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Delivery Logs
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="broadcasts" className="space-y-4">
          <BroadcastsTab searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="system-events" className="space-y-4">
          <SystemEventsTab searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplatesTab searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="audiences" className="space-y-4">
          <AudiencesTab searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="delivery-logs" className="space-y-4">
          <DeliveryLogsTab searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
