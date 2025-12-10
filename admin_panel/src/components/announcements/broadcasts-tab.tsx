'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateCampaignDialog } from './create-campaign-dialog'
import { CampaignDrawer } from './campaign-drawer'
import { Plus, Play, Pause, Copy, Edit, Archive, Filter, Clock, CheckCircle2, XCircle, CalendarClock } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface BroadcastsTabProps {
  searchQuery: string
}

interface Campaign {
  id: string
  name: string
  goal: string
  channels: string[]
  audience: string
  startDate: string
  endDate: string
  sent: number
  openRate: number
  clickRate: number
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed'
}

export function BroadcastsTab({ searchQuery }: BroadcastsTabProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    channels: [] as string[],
    status: 'all',
    city: 'all',
    language: 'all'
  })

  // Mock data
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Renew Expiring Listings - Delhi Mobiles',
      goal: 'renew listings',
      channels: ['push', 'in-app'],
      audience: 'Expiring in 3 days | Delhi | Mobiles',
      startDate: '2025-12-10 10:00',
      endDate: '2025-12-13 23:59',
      sent: 1247,
      openRate: 68.5,
      clickRate: 24.3,
      status: 'active'
    },
    {
      id: '2',
      name: 'Boost Plan Promotion - Power Sellers',
      goal: 'drive boosts',
      channels: ['push', 'sms', 'email'],
      audience: 'Power Sellers | All Cities',
      startDate: '2025-12-15 09:00',
      endDate: '2025-12-20 23:59',
      sent: 0,
      openRate: 0,
      clickRate: 0,
      status: 'scheduled'
    },
    {
      id: '3',
      name: 'Safety Tips for New Sellers',
      goal: 'safety tips',
      channels: ['in-app', 'email'],
      audience: 'New Sellers | Tenure < 7 days',
      startDate: '2025-12-08 08:00',
      endDate: '2025-12-10 23:59',
      sent: 892,
      openRate: 45.2,
      clickRate: 12.8,
      status: 'completed'
    }
  ]

  const getStatusBadge = (status: Campaign['status']) => {
    const variants: Record<Campaign['status'], { variant: any; icon: any }> = {
      draft: { variant: 'secondary', icon: Edit },
      scheduled: { variant: 'outline', icon: CalendarClock },
      active: { variant: 'default', icon: Play },
      paused: { variant: 'warning', icon: Pause },
      completed: { variant: 'success', icon: CheckCircle2 },
      failed: { variant: 'destructive', icon: XCircle }
    }
    const { variant, icon: Icon } = variants[status]
    return (
      <Badge variant={variant as any} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getChannelBadge = (channel: string) => {
    const colors: Record<string, string> = {
      push: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      sms: 'bg-green-500/10 text-green-700 dark:text-green-400',
      email: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      'in-app': 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
    }
    return (
      <Badge variant="outline" className={colors[channel]}>
        {channel.toUpperCase()}
      </Badge>
    )
  }

  const handleAction = (action: string, campaign: Campaign) => {
    console.log(`${action} campaign:`, campaign.id)
    // Implement action logic
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filters.status !== 'all' && campaign.status !== filters.status) {
      return false
    }
    if (filters.channels.length > 0) {
      const hasChannel = filters.channels.some(ch => campaign.channels.includes(ch))
      if (!hasChannel) return false
    }
    return true
  })

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          {(filters.status !== 'all' || filters.channels.length > 0) && (
            <Badge variant="secondary">{Object.values(filters).filter(v => v !== 'all' && (Array.isArray(v) ? v.length > 0 : true)).length} active</Badge>
          )}
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Filters Drawer */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Filter broadcast campaigns</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label>Channel</Label>
              <div className="space-y-2">
                {['push', 'sms', 'email', 'in-app'].map(channel => (
                  <div key={channel} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel}
                      checked={filters.channels.includes(channel)}
                      onCheckedChange={(checked) => {
                        setFilters(prev => ({
                          ...prev,
                          channels: checked
                            ? [...prev.channels, channel]
                            : prev.channels.filter(c => c !== channel)
                        }))
                      }}
                    />
                    <Label htmlFor={channel} className="text-sm font-normal">
                      {channel.toUpperCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={filters.language} onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setFilters({ channels: [], status: 'all', city: 'all', language: 'all' })}
            >
              Clear All
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Card>
        <CardHeader>
          <CardTitle>Broadcast Campaigns</CardTitle>
          <CardDescription>Manual marketing and engagement campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{campaign.goal}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {campaign.channels.map(ch => getChannelBadge(ch))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{campaign.audience}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {campaign.startDate}
                      </div>
                      <div className="text-muted-foreground">to {campaign.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{campaign.sent.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    {campaign.sent > 0 ? (
                      <div className="text-sm">
                        <div>Open: {campaign.openRate}%</div>
                        <div className="text-muted-foreground">Click: {campaign.clickRate}%</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {campaign.status === 'active' && (
                        <Button variant="ghost" size="sm" onClick={() => handleAction('pause', campaign)}>
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {campaign.status === 'paused' && (
                        <Button variant="ghost" size="sm" onClick={() => handleAction('resume', campaign)}>
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleAction('duplicate', campaign)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                        <Button variant="ghost" size="sm" onClick={() => handleAction('edit', campaign)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleAction('archive', campaign)}>
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

      {/* Campaign Detail Drawer */}
      {selectedCampaign && (
        <CampaignDrawer
          campaign={selectedCampaign}
          open={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </>
  )
}
