'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { 
  Play, 
  Pause, 
  Calendar as CalendarIcon, 
  Copy, 
  Trash2,
  Eye,
  Edit,
  MoreVertical,
  Filter,
  Image as ImageIcon,
  Video,
  BarChart2,
  RotateCcw,
  ChevronDown
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface HomeBannersTabProps {
  searchQuery: string
}

export function HomeBannersTab({ searchQuery }: HomeBannersTabProps) {
  const [selectedBanner, setSelectedBanner] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    placement: 'all',
    platform: 'all',
    targetAudience: 'all'
  })

  // Mock banner data
  const banners = [
    {
      id: 'BNR-001',
      title: 'Winter Sale 2024',
      type: 'Carousel',
      placement: 'Home',
      targetAudience: 'All Users',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      ctr: '4.2%',
      impressions: '125,432',
      clicks: '5,268',
      status: 'active',
      platform: 'All',
      imageUrl: '/placeholder-banner.jpg'
    },
    {
      id: 'BNR-002',
      title: 'Boost Your Listing',
      type: 'Static',
      placement: 'Category',
      targetAudience: 'Sellers',
      startDate: '2024-12-10',
      endDate: '2024-12-25',
      ctr: '3.8%',
      impressions: '89,234',
      clicks: '3,391',
      status: 'active',
      platform: 'Mobile',
      imageUrl: '/placeholder-banner.jpg'
    },
    {
      id: 'BNR-003',
      title: 'New Year Offers',
      type: 'Video',
      placement: 'Home',
      targetAudience: 'New Users',
      startDate: '2024-12-26',
      endDate: '2025-01-05',
      ctr: '0%',
      impressions: '0',
      clicks: '0',
      status: 'scheduled',
      platform: 'All',
      imageUrl: '/placeholder-banner.jpg'
    },
    {
      id: 'BNR-004',
      title: 'Black Friday Deals',
      type: 'Carousel',
      placement: 'Home',
      targetAudience: 'All Users',
      startDate: '2024-11-20',
      endDate: '2024-11-30',
      ctr: '5.1%',
      impressions: '234,567',
      clicks: '11,963',
      status: 'expired',
      platform: 'All',
      imageUrl: '/placeholder-banner.jpg'
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants: any = {
      active: { variant: 'default', label: '🟢 Active', className: 'bg-green-500' },
      scheduled: { variant: 'secondary', label: '🟠 Scheduled', className: 'bg-orange-500' },
      expired: { variant: 'destructive', label: '🔴 Expired', className: 'bg-red-500' },
      paused: { variant: 'outline', label: '⚫ Paused', className: 'bg-gray-500' }
    }
    const config = variants[status] || variants.active
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         banner.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filters.status === 'all' || banner.status === filters.status
    const matchesPlacement = filters.placement === 'all' || banner.placement === filters.placement
    const matchesPlatform = filters.platform === 'all' || banner.platform === filters.platform
    const matchesAudience = filters.targetAudience === 'all' || banner.targetAudience === filters.targetAudience

    return matchesSearch && matchesStatus && matchesPlacement && matchesPlatform && matchesAudience
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Placement</Label>
              <Select value={filters.placement} onValueChange={(value) => setFilters({...filters, placement: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Placements</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Category">Category</SelectItem>
                  <SelectItem value="Search">Search</SelectItem>
                  <SelectItem value="Listing Footer">Listing Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={filters.platform} onValueChange={(value) => setFilters({...filters, platform: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Mobile">Mobile (Android/iOS)</SelectItem>
                  <SelectItem value="Android">Android Only</SelectItem>
                  <SelectItem value="iOS">iOS Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={filters.targetAudience} onValueChange={(value) => setFilters({...filters, targetAudience: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Audiences</SelectItem>
                  <SelectItem value="All Users">All Users</SelectItem>
                  <SelectItem value="Sellers">Sellers</SelectItem>
                  <SelectItem value="Buyers">Buyers</SelectItem>
                  <SelectItem value="New Users">New Users</SelectItem>
                  <SelectItem value="Verified Users">Verified Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Home Banners ({filteredBanners.length})</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Create Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banner ID</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Target Audience</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map((banner) => (
                  <TableRow key={banner.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{banner.id}</TableCell>
                    <TableCell>
                      <div className="group relative">
                        <div className="w-16 h-10 bg-muted rounded border flex items-center justify-center cursor-pointer">
                          {banner.type === 'Video' ? (
                            <Video className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="hidden group-hover:block absolute z-10 left-0 top-12 w-64 h-40 bg-muted border rounded-lg shadow-lg">
                          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                            Preview: {banner.title}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{banner.type}</Badge>
                    </TableCell>
                    <TableCell>{banner.placement}</TableCell>
                    <TableCell>{banner.targetAudience}</TableCell>
                    <TableCell className="text-sm">{banner.startDate}</TableCell>
                    <TableCell className="text-sm">{banner.endDate}</TableCell>
                    <TableCell className="text-sm">{banner.impressions}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {banner.ctr}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(banner.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedBanner(banner)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {banner.status === 'active' && (
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </DropdownMenuItem>
                          )}
                          {banner.status === 'paused' && (
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Resume
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Rollback
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

      {/* Banner Detail Dialog */}
      {selectedBanner && (
        <BannerDetailDialog
          banner={selectedBanner}
          open={!!selectedBanner}
          onClose={() => setSelectedBanner(null)}
        />
      )}

      {/* Create Banner Dialog */}
      <CreateBannerDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  )
}

// Banner Detail Dialog Component
function BannerDetailDialog({ banner, open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Banner Details - {banner.id}</DialogTitle>
          <DialogDescription>{banner.title}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Banner ID</Label>
                <p className="font-mono">{banner.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Type</Label>
                <p>{banner.type}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Placement</Label>
                <p>{banner.placement}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Platform</Label>
                <p>{banner.platform}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">{banner.status}</div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <Label className="text-muted-foreground mb-2 block">Banner Preview</Label>
              <div className="w-full h-48 bg-background border rounded flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>{banner.title}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Start Date</Label>
                <p className="font-medium">{banner.startDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">End Date</Label>
                <p className="font-medium">{banner.endDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Auto-Expire</Label>
                <p>Enabled</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Timezone</Label>
                <p>IST (UTC+5:30)</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="targeting" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Target Audience</Label>
                <p className="font-medium">{banner.targetAudience}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Device Targeting</Label>
                <p>{banner.platform}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Geo Targeting</Label>
                <p>All Cities</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Deep Link</Label>
                <p className="font-mono text-sm">/listing/boost-offers</p>
              </div>
              <div>
                <Label className="text-muted-foreground">CTA Button</Label>
                <p>Shop Now</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Impressions</p>
                  <p className="text-2xl font-bold">{banner.impressions}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-2xl font-bold">{banner.clicks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">CTR</p>
                  <p className="text-2xl font-bold">{banner.ctr}</p>
                </CardContent>
              </Card>
            </div>

            <div className="border rounded-lg p-4">
              <Label className="text-muted-foreground mb-2 block">Performance Trend</Label>
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                <BarChart2 className="h-8 w-8" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Create Banner Dialog Component
function CreateBannerDialog({ open, onClose }: any) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'static',
    placement: 'home',
    platform: 'all',
    targetAudience: 'all',
    deepLink: '',
    ctaText: 'Shop Now',
    startDate: new Date(),
    endDate: new Date(),
    autoExpire: true
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Banner</DialogTitle>
          <DialogDescription>
            Create and schedule a new promotional banner for the marketplace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Banner Title *</Label>
            <Input
              placeholder="e.g., Winter Sale 2024"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static Image</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Placement *</Label>
              <Select value={formData.placement} onValueChange={(value) => setFormData({...formData, placement: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="search">Search</SelectItem>
                  <SelectItem value="footer">Listing Footer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Creative *</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG or MP4 (max 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform *</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="web">Web Only</SelectItem>
                  <SelectItem value="mobile">Mobile (Android + iOS)</SelectItem>
                  <SelectItem value="android">Android Only</SelectItem>
                  <SelectItem value="ios">iOS Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Audience *</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => setFormData({...formData, targetAudience: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="sellers">Sellers Only</SelectItem>
                  <SelectItem value="buyers">Buyers Only</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="verified">Verified Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deep Link (Optional)</Label>
            <Input
              placeholder="/listing/boost-offers"
              value={formData.deepLink}
              onChange={(e) => setFormData({...formData, deepLink: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Button Text</Label>
            <Input
              placeholder="Shop Now"
              value={formData.ctaText}
              onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
            />
          </div>

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

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.autoExpire}
              onCheckedChange={(checked) => setFormData({...formData, autoExpire: checked})}
            />
            <Label>Auto-expire after end date</Label>
          </div>

          <div className="border rounded-lg p-4 bg-muted/50">
            <Label className="text-muted-foreground mb-2 block">Preview</Label>
            <div className="w-full h-32 bg-background border rounded flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Banner preview will appear here</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline">Save as Draft</Button>
          <Button>Publish Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
