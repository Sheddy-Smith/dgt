'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { 
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Plus,
  Send,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  PlayCircle,
  StopCircle
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

interface CampaignsTabProps {
  searchQuery: string
}

export function CampaignsTab({ searchQuery }: CampaignsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)

  // Mock campaign data
  const campaigns = [
    {
      id: 'CMP-001',
      name: 'Winter Sale Announcement',
      type: 'Promotional',
      channels: ['Push', 'In-App'],
      targetAudience: 'All Users',
      targetCities: ['Mumbai', 'Delhi', 'Bangalore'],
      delivered: '125,432',
      opened: '67,234',
      clicked: '12,456',
      converted: '892',
      openRate: '53.6%',
      ctr: '18.5%',
      conversionRate: '7.2%',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      status: 'active',
      linkedBanners: 2,
      linkedCoupons: 1
    },
    {
      id: 'CMP-002',
      name: 'Boost Your Listing',
      type: 'Engagement',
      channels: ['Push', 'Email', 'SMS'],
      targetAudience: 'Sellers',
      targetCities: ['All'],
      delivered: '45,678',
      opened: '23,456',
      clicked: '8,901',
      converted: '1,234',
      openRate: '51.3%',
      ctr: '37.9%',
      conversionRate: '13.9%',
      startDate: '2024-12-10',
      endDate: '2024-12-25',
      status: 'active',
      linkedBanners: 1,
      linkedCoupons: 1
    },
    {
      id: 'CMP-003',
      name: 'New Year Offers Preview',
      type: 'Promotional',
      channels: ['Push', 'In-App', 'Email'],
      targetAudience: 'High Value Users',
      targetCities: ['Mumbai', 'Pune'],
      delivered: '0',
      opened: '0',
      clicked: '0',
      converted: '0',
      openRate: '0%',
      ctr: '0%',
      conversionRate: '0%',
      startDate: '2024-12-26',
      endDate: '2025-01-05',
      status: 'scheduled',
      linkedBanners: 3,
      linkedCoupons: 2
    },
    {
      id: 'CMP-004',
      name: 'App Update Notification',
      type: 'Announcement',
      channels: ['Push'],
      targetAudience: 'All Users',
      targetCities: ['All'],
      delivered: '234,567',
      opened: '145,678',
      clicked: '5,432',
      converted: '2,345',
      openRate: '62.1%',
      ctr: '3.7%',
      conversionRate: '43.2%',
      startDate: '2024-12-05',
      endDate: '2024-12-06',
      status: 'completed',
      linkedBanners: 0,
      linkedCoupons: 0
    }
  ]

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-500"><PlayCircle className="h-3 w-3 mr-1" /> Active</Badge>
    } else if (status === 'completed') {
      return <Badge className="bg-blue-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>
    } else if (status === 'scheduled') {
      return <Badge className="bg-orange-500"><Clock className="h-3 w-3 mr-1" /> Scheduled</Badge>
    } else if (status === 'paused') {
      return <Badge className="bg-gray-500"><StopCircle className="h-3 w-3 mr-1" /> Paused</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate totals
  const totalDelivered = campaigns.reduce((sum, c) => sum + parseInt(c.delivered.replace(/,/g, '') || '0'), 0)
  const totalOpened = campaigns.reduce((sum, c) => sum + parseInt(c.opened.replace(/,/g, '') || '0'), 0)
  const avgOpenRate = (totalOpened / totalDelivered * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
                <p className="text-xs text-green-600 mt-1">
                  {campaigns.filter(c => c.status === 'active').length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Send className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{(totalDelivered / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-bold">{avgOpenRate}%</p>
                <p className="text-xs text-green-600 mt-1">+5% vs last month</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">4.5K</p>
                <p className="text-xs text-green-600 mt-1">All campaigns</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaigns / Announcements ({filteredCampaigns.length})</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Conversion</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{campaign.id}</TableCell>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {campaign.channels.map((channel, idx) => {
                          const icons: any = {
                            Push: <Bell className="h-3 w-3" />,
                            Email: <Mail className="h-3 w-3" />,
                            SMS: <MessageSquare className="h-3 w-3" />,
                            'In-App': <Smartphone className="h-3 w-3" />
                          }
                          return (
                            <Badge key={idx} variant="secondary" className="text-xs px-1">
                              {icons[channel]}
                            </Badge>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <p>{campaign.targetAudience}</p>
                        <p className="text-xs text-muted-foreground">
                          {campaign.targetCities.length > 3 
                            ? `${campaign.targetCities.length} cities` 
                            : campaign.targetCities.join(', ')
                          }
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{campaign.delivered}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {campaign.openRate}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {campaign.ctr}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-mono text-sm">{campaign.converted}</p>
                        <p className="text-xs text-muted-foreground">{campaign.conversionRate}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div>
                        <p>{campaign.startDate}</p>
                        <p className="text-muted-foreground">to {campaign.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedCampaign(campaign)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {campaign.status === 'active' && (
                            <DropdownMenuItem>
                              <StopCircle className="h-4 w-4 mr-2" />
                              Pause Campaign
                            </DropdownMenuItem>
                          )}
                          {campaign.status === 'paused' && (
                            <DropdownMenuItem>
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Resume Campaign
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {/* Campaign Detail Dialog */}
      {selectedCampaign && (
        <CampaignDetailDialog
          campaign={selectedCampaign}
          open={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  )
}

function CreateCampaignDialog({ open, onClose }: any) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'promotional',
    description: '',
    targetAudience: 'all',
    targetCities: [] as string[],
    channels: {
      push: true,
      email: false,
      sms: false,
      inApp: true
    },
    message: '',
    emailSubject: '',
    cta: 'Open App',
    ctaLink: '',
    startDate: new Date(),
    endDate: new Date(),
    linkedBanners: [] as string[],
    linkedCoupons: [] as string[],
    language: 'english'
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a multi-channel campaign to reach your target audience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="message">Message</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Campaign Name *</Label>
              <Input
                placeholder="e.g., Winter Sale Announcement"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Campaign Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">Promotional</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of this campaign..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-3 border rounded-lg p-4">
              <Label>Message Channels *</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.channels.push}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      channels: {...formData.channels, push: checked as boolean}
                    })}
                  />
                  <Bell className="h-4 w-4" />
                  <Label>Push Notification</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.channels.email}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      channels: {...formData.channels, email: checked as boolean}
                    })}
                  />
                  <Mail className="h-4 w-4" />
                  <Label>Email</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.channels.sms}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      channels: {...formData.channels, sms: checked as boolean}
                    })}
                  />
                  <MessageSquare className="h-4 w-4" />
                  <Label>SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.channels.inApp}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      channels: {...formData.channels, inApp: checked as boolean}
                    })}
                  />
                  <Smartphone className="h-4 w-4" />
                  <Label>In-App Banner</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="targeting" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Target Audience *</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => setFormData({...formData, targetAudience: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users (Last 30 days)</SelectItem>
                  <SelectItem value="sellers">Sellers Only</SelectItem>
                  <SelectItem value="buyers">Buyers Only</SelectItem>
                  <SelectItem value="power_sellers">Power Sellers</SelectItem>
                  <SelectItem value="inactive">Inactive Users (90+ days)</SelectItem>
                  <SelectItem value="high_value">High Value Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Cities</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai'].map(city => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.targetCities.includes(city)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({...formData, targetCities: [...formData.targetCities, city]})
                        } else {
                          setFormData({...formData, targetCities: formData.targetCities.filter(c => c !== city)})
                        }
                      }}
                    />
                    <Label className="text-sm">{city}</Label>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Select All Cities
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Link to Banners (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select banners to link" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bnr001">BNR-001: Winter Sale 2024</SelectItem>
                  <SelectItem value="bnr002">BNR-002: Boost Your Listing</SelectItem>
                  <SelectItem value="bnr003">BNR-003: New Year Offers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Link to Coupons (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select coupons to link" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpn001">WINTER50</SelectItem>
                  <SelectItem value="cpn002">BOOST100</SelectItem>
                  <SelectItem value="cpn003">NEWUSER25</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="message" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Language Template</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="marathi">Marathi</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.channels.email && (
              <div className="space-y-2">
                <Label>Email Subject Line *</Label>
                <Input
                  placeholder="e.g., 🎉 Winter Sale is Here!"
                  value={formData.emailSubject}
                  onChange={(e) => setFormData({...formData, emailSubject: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Message Content *</Label>
              <Textarea
                placeholder="Write your campaign message here..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                {formData.channels.sms && `SMS character count: ${formData.message.length}/160`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Button Text</Label>
                <Input
                  placeholder="Open App"
                  value={formData.cta}
                  onChange={(e) => setFormData({...formData, cta: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>CTA Deep Link</Label>
                <Input
                  placeholder="/listing/offers"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({...formData, ctaLink: e.target.value})}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <Label className="text-muted-foreground mb-2 block">Message Preview</Label>
              <div className="bg-white rounded-lg p-4 shadow-sm max-w-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{formData.name || 'Campaign Name'}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.message || 'Your message will appear here...'}
                    </p>
                    {formData.cta && (
                      <Button size="sm" className="mt-2">{formData.cta}</Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && setFormData({...formData, startDate: date})}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && setFormData({...formData, endDate: date})}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Label className="text-blue-900 mb-2 block">Campaign Summary</Label>
              <div className="space-y-1 text-sm text-blue-700">
                <p><span className="font-medium">Name:</span> {formData.name || 'Untitled Campaign'}</p>
                <p><span className="font-medium">Type:</span> {formData.type}</p>
                <p><span className="font-medium">Channels:</span> {
                  Object.entries(formData.channels)
                    .filter(([_, v]) => v)
                    .map(([k]) => k)
                    .join(', ')
                }</p>
                <p><span className="font-medium">Target:</span> {formData.targetAudience}</p>
                <p><span className="font-medium">Cities:</span> {formData.targetCities.length || 'All'}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline">Save as Draft</Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Launch Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CampaignDetailDialog({ campaign, open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Campaign Details - {campaign.id}</DialogTitle>
          <DialogDescription>{campaign.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Campaign ID</Label>
              <p className="font-mono text-sm">{campaign.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Type</Label>
              <p>{campaign.type}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Channels</Label>
              <p>{campaign.channels.join(', ')}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="mt-1">{campaign.status}</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Targeting</Label>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Audience:</span> {campaign.targetAudience}</p>
              <p><span className="font-medium">Cities:</span> {campaign.targetCities.join(', ')}</p>
              <p><span className="font-medium">Linked Banners:</span> {campaign.linkedBanners}</p>
              <p><span className="font-medium">Linked Coupons:</span> {campaign.linkedCoupons}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Performance Metrics</Label>
            <div className="grid grid-cols-4 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-xl font-bold">{campaign.delivered}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Opened</p>
                <p className="text-xl font-bold">{campaign.opened}</p>
                <p className="text-xs text-green-600">{campaign.openRate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clicked</p>
                <p className="text-xl font-bold">{campaign.clicked}</p>
                <p className="text-xs text-green-600">{campaign.ctr}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Converted</p>
                <p className="text-xl font-bold">{campaign.converted}</p>
                <p className="text-xs text-green-600">{campaign.conversionRate}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Duration</Label>
            <p className="text-sm">
              <span className="font-medium">From:</span> {campaign.startDate} 
              <span className="mx-2">→</span> 
              <span className="font-medium">To:</span> {campaign.endDate}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
