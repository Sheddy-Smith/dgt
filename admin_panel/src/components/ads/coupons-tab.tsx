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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { 
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Plus,
  Copy,
  TrendingUp,
  Users,
  Percent,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface CouponsTabProps {
  searchQuery: string
}

export function CouponsTab({ searchQuery }: CouponsTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)

  // Mock coupon data
  const coupons = [
    {
      id: 'CPN-001',
      code: 'WINTER50',
      type: 'Percentage',
      discount: '50%',
      minSpend: '₹500',
      maxDiscount: '₹200',
      usageLimit: '1000',
      usedCount: '342',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      targetAudience: 'All Users',
      channel: 'App + Web',
      category: 'All',
      status: 'active'
    },
    {
      id: 'CPN-002',
      code: 'BOOST100',
      type: 'Flat',
      discount: '₹100',
      minSpend: '₹299',
      maxDiscount: '₹100',
      usageLimit: '500',
      usedCount: '187',
      startDate: '2024-12-10',
      endDate: '2024-12-25',
      targetAudience: 'Sellers',
      channel: 'App Only',
      category: 'Boost Plans',
      status: 'active'
    },
    {
      id: 'CPN-003',
      code: 'NEWUSER25',
      type: 'Percentage',
      discount: '25%',
      minSpend: '₹0',
      maxDiscount: '₹150',
      usageLimit: 'Unlimited',
      usedCount: '1,234',
      startDate: '2024-11-01',
      endDate: '2025-01-31',
      targetAudience: 'New Users',
      channel: 'App + Web',
      category: 'All',
      status: 'active'
    },
    {
      id: 'CPN-004',
      code: 'FLASH200',
      type: 'Flat',
      discount: '₹200',
      minSpend: '₹1000',
      maxDiscount: '₹200',
      usageLimit: '100',
      usedCount: '100',
      startDate: '2024-12-05',
      endDate: '2024-12-06',
      targetAudience: 'All Users',
      channel: 'App + Web',
      category: 'All',
      status: 'expired'
    },
    {
      id: 'CPN-005',
      code: 'CITY50OFF',
      type: 'Percentage',
      discount: '50%',
      minSpend: '₹500',
      maxDiscount: '₹250',
      usageLimit: '200',
      usedCount: '45',
      startDate: '2024-12-15',
      endDate: '2024-12-20',
      targetAudience: 'Mumbai Users',
      channel: 'App Only',
      category: 'All',
      status: 'scheduled'
    }
  ]

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Active</Badge>
    } else if (status === 'expired') {
      return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Expired</Badge>
    } else if (status === 'scheduled') {
      return <Badge className="bg-orange-500"><CalendarIcon className="h-3 w-3 mr-1" /> Scheduled</Badge>
    }
    return <Badge variant="outline">{status}</Badge>
  }

  const getUsageStatus = (used: string, limit: string) => {
    if (limit === 'Unlimited') return <Badge variant="secondary">∞</Badge>
    const usedNum = parseInt(used.replace(/,/g, ''))
    const limitNum = parseInt(limit.replace(/,/g, ''))
    const percentage = (usedNum / limitNum) * 100

    if (percentage >= 100) {
      return <Badge variant="destructive">Exhausted</Badge>
    } else if (percentage >= 80) {
      return <Badge className="bg-orange-500">Low</Badge>
    } else {
      return <Badge variant="secondary">{percentage.toFixed(0)}%</Badge>
    }
  }

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate totals
  const totalRedemptions = coupons.reduce((sum, coupon) => {
    return sum + parseInt(coupon.usedCount.replace(/,/g, ''))
  }, 0)

  const avgDiscount = coupons.filter(c => c.type === 'Flat').reduce((sum, c) => {
    return sum + parseInt(c.discount.replace(/[₹,]/g, ''))
  }, 0) / coupons.filter(c => c.type === 'Flat').length

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Coupons</p>
                <p className="text-2xl font-bold">{coupons.length}</p>
                <p className="text-xs text-green-600 mt-1">
                  {coupons.filter(c => c.status === 'active').length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Redemptions</p>
                <p className="text-2xl font-bold">{totalRedemptions.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">All time</p>
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
                <p className="text-sm text-muted-foreground">Avg Discount</p>
                <p className="text-2xl font-bold">₹{avgDiscount.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground mt-1">Flat coupons</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Percent className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">1,808</p>
                <p className="text-xs text-green-600 mt-1">Using coupons</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Coupons & Offers ({filteredCoupons.length})</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coupon ID</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min Spend</TableHead>
                  <TableHead>Max Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Target Audience</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => (
                  <TableRow key={coupon.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{coupon.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded font-bold text-sm">
                          {coupon.code}
                        </code>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{coupon.type}</Badge>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">{coupon.discount}</TableCell>
                    <TableCell className="text-sm">{coupon.minSpend}</TableCell>
                    <TableCell className="text-sm">{coupon.maxDiscount}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-mono">{coupon.usedCount} / {coupon.usageLimit}</p>
                        {getUsageStatus(coupon.usedCount, coupon.usageLimit)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div>
                        <p>{coupon.startDate}</p>
                        <p className="text-muted-foreground">to {coupon.endDate}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{coupon.targetAudience}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{coupon.channel}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedCoupon(coupon)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Usage Report
                          </DropdownMenuItem>
                          {coupon.status === 'active' && (
                            <DropdownMenuItem>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
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

      {/* Create Coupon Dialog */}
      <CreateCouponDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {/* Coupon Detail Dialog */}
      {selectedCoupon && (
        <CouponDetailDialog
          coupon={selectedCoupon}
          open={!!selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
        />
      )}
    </div>
  )
}

function CreateCouponDialog({ open, onClose }: any) {
  const [formData, setFormData] = useState({
    code: '',
    autoGenerate: false,
    type: 'percentage',
    discount: '',
    minSpend: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: '1',
    startDate: new Date(),
    endDate: new Date(),
    targetAudience: 'all',
    city: 'all',
    category: 'all',
    channel: 'both',
    autoDeactivate: true
  })

  const generateCode = () => {
    const randomCode = 'SAVE' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setFormData({...formData, code: randomCode})
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Coupon</DialogTitle>
          <DialogDescription>
            Create a new promotional coupon code with targeting and usage limits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Coupon Code *</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.autoGenerate}
                  onCheckedChange={(checked) => {
                    setFormData({...formData, autoGenerate: checked})
                    if (checked) generateCode()
                  }}
                />
                <Label className="text-sm text-muted-foreground">Auto-generate</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., WINTER50"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                disabled={formData.autoGenerate}
                className="font-mono font-bold"
              />
              {formData.autoGenerate && (
                <Button variant="outline" onClick={generateCode}>
                  Regenerate
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Discount Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  <SelectItem value="category">Category Specific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount Value *</Label>
              <Input
                type="number"
                placeholder={formData.type === 'percentage' ? '50' : '100'}
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Discount (₹)</Label>
              <Input
                type="number"
                placeholder="200"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Spend (₹)</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.minSpend}
                onChange={(e) => setFormData({...formData, minSpend: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Total Usage Limit</Label>
              <Input
                type="number"
                placeholder="1000 (leave empty for unlimited)"
                value={formData.usageLimit}
                onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Per User Limit</Label>
              <Select value={formData.perUserLimit} onValueChange={(value) => setFormData({...formData, perUserLimit: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 time</SelectItem>
                  <SelectItem value="2">2 times</SelectItem>
                  <SelectItem value="3">3 times</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Channel *</Label>
              <Select value={formData.channel} onValueChange={(value) => setFormData({...formData, channel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">App + Web</SelectItem>
                  <SelectItem value="app">App Only</SelectItem>
                  <SelectItem value="web">Web Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => setFormData({...formData, targetAudience: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="sellers">Sellers Only</SelectItem>
                  <SelectItem value="buyers">Buyers Only</SelectItem>
                  <SelectItem value="verified">Verified Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>City Filter</Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category Filter</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="boost">Boost Plans</SelectItem>
                  <SelectItem value="cars">Cars</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.autoDeactivate}
              onCheckedChange={(checked) => setFormData({...formData, autoDeactivate: checked})}
            />
            <Label>Auto-deactivate on expiry date</Label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-medium text-blue-900">Coupon Preview</p>
                <p className="text-blue-700">
                  Code: <code className="bg-white px-2 py-0.5 rounded font-bold">{formData.code || 'CODE'}</code>
                </p>
                <p className="text-blue-700">
                  {formData.type === 'percentage' ? `${formData.discount}% OFF` : `₹${formData.discount} OFF`}
                  {formData.minSpend && ` on orders above ₹${formData.minSpend}`}
                  {formData.maxDiscount && ` (max ₹${formData.maxDiscount})`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Create Coupon</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CouponDetailDialog({ coupon, open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Coupon Details - {coupon.id}</DialogTitle>
          <DialogDescription>
            <code className="bg-muted px-3 py-1 rounded font-bold text-lg">{coupon.code}</code>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Coupon ID</Label>
              <p className="font-mono text-sm">{coupon.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Type</Label>
              <p>{coupon.type}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Discount</Label>
              <p className="font-bold text-lg text-green-600">{coupon.discount}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Min Spend</Label>
              <p>{coupon.minSpend}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Max Discount</Label>
              <p>{coupon.maxDiscount}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="mt-1">{coupon.status}</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Usage Statistics</Label>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Used</p>
                <p className="text-xl font-bold">{coupon.usedCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Limit</p>
                <p className="text-xl font-bold">{coupon.usageLimit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-xl font-bold">
                  {coupon.usageLimit === 'Unlimited' 
                    ? '∞' 
                    : parseInt(coupon.usageLimit) - parseInt(coupon.usedCount.replace(/,/g, ''))
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Targeting & Validity</Label>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Target Audience:</span> {coupon.targetAudience}</p>
              <p><span className="font-medium">Channel:</span> {coupon.channel}</p>
              <p><span className="font-medium">Category:</span> {coupon.category}</p>
              <p><span className="font-medium">Valid From:</span> {coupon.startDate}</p>
              <p><span className="font-medium">Valid Until:</span> {coupon.endDate}</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Estimated Savings</Label>
            <p className="text-2xl font-bold text-green-600">
              ₹{(parseInt(coupon.usedCount.replace(/,/g, '')) * parseInt(coupon.maxDiscount.replace(/[₹,]/g, '')) * 0.6).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total savings provided to users</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
