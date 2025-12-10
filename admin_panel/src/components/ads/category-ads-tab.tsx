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
import { 
  Play, 
  Pause, 
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Plus,
  BarChart2,
  RefreshCw
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface CategoryAdsTabProps {
  searchQuery: string
}

export function CategoryAdsTab({ searchQuery }: CategoryAdsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState<any>(null)

  // Mock category ad data
  const categoryAds = [
    {
      id: 'CAD-001',
      slotId: 'header-cars',
      zone: 'Category Header',
      category: 'Cars',
      title: 'Premium Car Deals',
      type: 'Static Image',
      rotationInterval: '10s',
      impressions: '45,234',
      clicks: '1,892',
      ctr: '4.2%',
      status: 'active',
      targeting: 'Professional Sellers',
      priceRange: '> ₹5L'
    },
    {
      id: 'CAD-002',
      slotId: 'mid-electronics',
      zone: 'Mid-Listing',
      category: 'Electronics',
      title: 'Latest Gadgets',
      type: 'Native Ad',
      rotationInterval: '15s',
      impressions: '67,891',
      clicks: '2,715',
      ctr: '4.0%',
      status: 'active',
      targeting: 'All Users',
      priceRange: 'All'
    },
    {
      id: 'CAD-003',
      slotId: 'footer-realestate',
      zone: 'Bottom CTA',
      category: 'Real Estate',
      title: 'Property Boost Plans',
      type: 'CTA Banner',
      rotationInterval: '0s',
      impressions: '23,456',
      clicks: '1,173',
      ctr: '5.0%',
      status: 'active',
      targeting: 'Sellers Only',
      priceRange: '> ₹50L'
    },
    {
      id: 'CAD-004',
      slotId: 'header-fashion',
      zone: 'Category Header',
      category: 'Fashion',
      title: 'Trending Styles',
      type: 'Carousel',
      rotationInterval: '8s',
      impressions: '89,123',
      clicks: '3,210',
      ctr: '3.6%',
      status: 'paused',
      targeting: 'All Users',
      priceRange: 'All'
    }
  ]

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-500">🟢 Active</Badge>
    } else if (status === 'paused') {
      return <Badge className="bg-gray-500">⚫ Paused</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const filteredAds = categoryAds.filter(ad => 
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Zone Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Header Zones</p>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-green-600 mt-1">6 active</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mid-Listing Slots</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-green-600 mt-1">10 active</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bottom CTA Zones</p>
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-green-600 mt-1">4 active</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Ads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Category Ad Placements ({filteredAds.length})</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Category Ad
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad ID</TableHead>
                  <TableHead>Slot ID</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rotation</TableHead>
                  <TableHead>Targeting</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAds.map((ad) => (
                  <TableRow key={ad.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{ad.id}</TableCell>
                    <TableCell className="font-mono text-xs">{ad.slotId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ad.zone}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{ad.category}</TableCell>
                    <TableCell>{ad.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ad.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {ad.rotationInterval === '0s' ? (
                        <span className="text-muted-foreground">Static</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          {ad.rotationInterval}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>
                        <p>{ad.targeting}</p>
                        {ad.priceRange !== 'All' && (
                          <p className="text-xs text-muted-foreground">{ad.priceRange}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{ad.impressions}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {ad.ctr}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(ad.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedAd(ad)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {ad.status === 'active' && (
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </DropdownMenuItem>
                          )}
                          {ad.status === 'paused' && (
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Resume
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <BarChart2 className="h-4 w-4 mr-2" />
                            Performance
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

      {/* Create Category Ad Dialog */}
      <CreateCategoryAdDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {/* Ad Detail Dialog */}
      {selectedAd && (
        <CategoryAdDetailDialog
          ad={selectedAd}
          open={!!selectedAd}
          onClose={() => setSelectedAd(null)}
        />
      )}
    </div>
  )
}

function CreateCategoryAdDialog({ open, onClose }: any) {
  const [formData, setFormData] = useState({
    zone: 'header',
    category: '',
    title: '',
    type: 'static',
    rotationInterval: '10',
    targeting: 'all',
    priceRange: 'all',
    deepLink: '',
    ctaText: 'View Offers'
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Category Ad Placement</DialogTitle>
          <DialogDescription>
            Define ad zones for specific categories with targeting and rotation settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Zone Placement *</Label>
              <Select value={formData.zone} onValueChange={(value) => setFormData({...formData, zone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Category Header</SelectItem>
                  <SelectItem value="mid">Mid-Listing Slot</SelectItem>
                  <SelectItem value="footer">Bottom CTA Section</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cars">Cars</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="realestate">Real Estate</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ad Title *</Label>
            <Input
              placeholder="e.g., Premium Car Deals"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ad Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static Image</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="native">Native Ad</SelectItem>
                  <SelectItem value="cta">CTA Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Auto-Rotation Interval</Label>
              <Select value={formData.rotationInterval} onValueChange={(value) => setFormData({...formData, rotationInterval: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Rotation (Static)</SelectItem>
                  <SelectItem value="5">Every 5 seconds</SelectItem>
                  <SelectItem value="10">Every 10 seconds</SelectItem>
                  <SelectItem value="15">Every 15 seconds</SelectItem>
                  <SelectItem value="30">Every 30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Creative *</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary">
              <p className="text-sm text-muted-foreground">Click to upload image or video</p>
              <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x400px (PNG, JPG)</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Seller Type Targeting</Label>
              <Select value={formData.targeting} onValueChange={(value) => setFormData({...formData, targeting: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="professional">Professional Sellers</SelectItem>
                  <SelectItem value="casual">Casual Sellers</SelectItem>
                  <SelectItem value="buyers">Buyers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price Range Filter</Label>
              <Select value={formData.priceRange} onValueChange={(value) => setFormData({...formData, priceRange: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under50k">Under ₹50,000</SelectItem>
                  <SelectItem value="50k-5l">₹50,000 - ₹5L</SelectItem>
                  <SelectItem value="above5l">Above ₹5L</SelectItem>
                  <SelectItem value="above50l">Above ₹50L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deep Link / CTA URL</Label>
            <Input
              placeholder="/category/cars/boost-plans"
              value={formData.deepLink}
              onChange={(e) => setFormData({...formData, deepLink: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Button Text</Label>
            <Input
              placeholder="View Offers"
              value={formData.ctaText}
              onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Create Ad Placement</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CategoryAdDetailDialog({ ad, open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Category Ad Details - {ad.id}</DialogTitle>
          <DialogDescription>{ad.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Slot ID</Label>
              <p className="font-mono text-sm">{ad.slotId}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Zone</Label>
              <p>{ad.zone}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Category</Label>
              <p className="font-medium">{ad.category}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Ad Type</Label>
              <p>{ad.type}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Rotation Interval</Label>
              <p>{ad.rotationInterval === '0s' ? 'Static' : ad.rotationInterval}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="mt-1">{ad.status}</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Targeting Rules</Label>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Seller Type:</span> {ad.targeting}</p>
              <p><span className="font-medium">Price Range:</span> {ad.priceRange}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Performance Metrics</Label>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-xl font-bold">{ad.impressions}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clicks</p>
                <p className="text-xl font-bold">{ad.clicks}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CTR</p>
                <p className="text-xl font-bold">{ad.ctr}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-muted/50">
            <Label className="text-muted-foreground mb-2 block">Ad Preview</Label>
            <div className="w-full h-32 bg-background border rounded flex items-center justify-center">
              <p className="text-sm text-muted-foreground">{ad.title}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
