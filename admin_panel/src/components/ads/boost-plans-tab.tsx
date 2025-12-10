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
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  Crown,
  Zap,
  Star
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface BoostPlansTabProps {
  searchQuery: string
}

export function BoostPlansTab({ searchQuery }: BoostPlansTabProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  // Mock boost plans data
  const boostPlans = [
    {
      id: 'PLAN-001',
      name: 'Basic Boost',
      duration: '3 days',
      durationDays: 3,
      price: '₹99',
      benefits: ['Top 10 position', 'Boost badge', '2x visibility'],
      visibility: 'Category page',
      totalSales: '1,234',
      revenue: '₹1,22,166',
      activeUsers: '156',
      status: 'active',
      discount: '0%'
    },
    {
      id: 'PLAN-002',
      name: 'Premium Boost',
      duration: '7 days',
      durationDays: 7,
      price: '₹249',
      benefits: ['Top 5 position', 'Premium badge', '5x visibility', 'Featured section'],
      visibility: 'Category + Home',
      totalSales: '2,456',
      revenue: '₹6,11,544',
      activeUsers: '289',
      status: 'active',
      discount: '10%'
    },
    {
      id: 'PLAN-003',
      name: 'Ultimate Boost',
      duration: '30 days',
      durationDays: 30,
      price: '₹799',
      benefits: ['#1 position guaranteed', 'Ultimate badge', '10x visibility', 'Banner placement', 'Priority support'],
      visibility: 'All pages',
      totalSales: '892',
      revenue: '₹7,12,508',
      activeUsers: '98',
      status: 'active',
      discount: '15%'
    },
    {
      id: 'PLAN-004',
      name: 'Weekend Special',
      duration: '2 days',
      durationDays: 2,
      price: '₹49',
      benefits: ['Top 20 position', 'Weekend badge', '1.5x visibility'],
      visibility: 'Category page',
      totalSales: '567',
      revenue: '₹27,783',
      activeUsers: '45',
      status: 'paused',
      discount: '50%'
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

  const filteredPlans = boostPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate totals
  const totalRevenue = boostPlans.reduce((sum, plan) => {
    const amount = parseInt(plan.revenue.replace(/[₹,]/g, ''))
    return sum + amount
  }, 0)

  const totalSales = boostPlans.reduce((sum, plan) => {
    return sum + parseInt(plan.totalSales.replace(/,/g, ''))
  }, 0)

  const activeSubscribers = boostPlans.reduce((sum, plan) => {
    return sum + parseInt(plan.activeUsers)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold">{boostPlans.length}</p>
                <p className="text-xs text-green-600 mt-1">
                  {boostPlans.filter(p => p.status === 'active').length} active
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(2)}L</p>
                <p className="text-xs text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{totalSales.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
                <p className="text-2xl font-bold">{activeSubscribers}</p>
                <p className="text-xs text-green-600 mt-1">Currently boosted</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boost Plans Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Boost / Featured Plans ({filteredPlans.length})</CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Benefits</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Active Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{plan.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {plan.name === 'Ultimate Boost' && <Crown className="h-4 w-4 text-yellow-600" />}
                        {plan.name === 'Premium Boost' && <Star className="h-4 w-4 text-purple-600" />}
                        {plan.name === 'Basic Boost' && <Zap className="h-4 w-4 text-blue-600" />}
                        <span className="font-medium">{plan.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{plan.duration}</Badge>
                    </TableCell>
                    <TableCell className="font-bold">{plan.price}</TableCell>
                    <TableCell>
                      {plan.discount !== '0%' ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {plan.discount} OFF
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <ul className="text-xs space-y-1">
                          {plan.benefits.slice(0, 2).map((benefit, idx) => (
                            <li key={idx}>• {benefit}</li>
                          ))}
                          {plan.benefits.length > 2 && (
                            <li className="text-muted-foreground">
                              +{plan.benefits.length - 2} more
                            </li>
                          )}
                        </ul>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{plan.visibility}</TableCell>
                    <TableCell className="font-mono text-sm">{plan.totalSales}</TableCell>
                    <TableCell className="font-bold text-green-600">{plan.revenue}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{plan.activeUsers}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedPlan(plan)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Offer Discount
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Subscribers
                          </DropdownMenuItem>
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

      {/* Create Plan Dialog */}
      <CreateBoostPlanDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {/* Plan Detail Dialog */}
      {selectedPlan && (
        <BoostPlanDetailDialog
          plan={selectedPlan}
          open={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  )
}

function CreateBoostPlanDialog({ open, onClose }: any) {
  const [formData, setFormData] = useState({
    name: '',
    duration: '3',
    price: '',
    discount: '0',
    visibility: 'category',
    position: 'top10',
    badge: 'boost',
    multiplier: '2',
    bannerPlacement: false,
    prioritySupport: false,
    autoExpire: true,
    refundable: true
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Boost / Featured Plan</DialogTitle>
          <DialogDescription>
            Define a new boost plan with pricing, benefits, and visibility settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Plan Name *</Label>
            <Input
              placeholder="e.g., Premium Boost"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Duration (days) *</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                placeholder="99"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Visibility Level *</Label>
              <Select value={formData.visibility} onValueChange={(value) => setFormData({...formData, visibility: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Category Page Only</SelectItem>
                  <SelectItem value="category-home">Category + Home</SelectItem>
                  <SelectItem value="all">All Pages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Position Guarantee *</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top20">Top 20</SelectItem>
                  <SelectItem value="top10">Top 10</SelectItem>
                  <SelectItem value="top5">Top 5</SelectItem>
                  <SelectItem value="top1">#1 Position</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Badge Type *</Label>
              <Select value={formData.badge} onValueChange={(value) => setFormData({...formData, badge: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boost">Boost Badge</SelectItem>
                  <SelectItem value="premium">Premium Badge</SelectItem>
                  <SelectItem value="ultimate">Ultimate Badge</SelectItem>
                  <SelectItem value="featured">Featured Badge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visibility Multiplier *</Label>
              <Select value={formData.multiplier} onValueChange={(value) => setFormData({...formData, multiplier: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.5">1.5x visibility</SelectItem>
                  <SelectItem value="2">2x visibility</SelectItem>
                  <SelectItem value="5">5x visibility</SelectItem>
                  <SelectItem value="10">10x visibility</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 border rounded-lg p-4">
            <Label>Additional Benefits</Label>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.bannerPlacement}
                onCheckedChange={(checked) => setFormData({...formData, bannerPlacement: checked})}
              />
              <Label>Banner Placement (Featured Section)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.prioritySupport}
                onCheckedChange={(checked) => setFormData({...formData, prioritySupport: checked})}
              />
              <Label>Priority Support</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.autoExpire}
                onCheckedChange={(checked) => setFormData({...formData, autoExpire: checked})}
              />
              <Label>Auto-expire after duration ends</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.refundable}
                onCheckedChange={(checked) => setFormData({...formData, refundable: checked})}
              />
              <Label>Refundable on early cancellation</Label>
            </div>
          </div>

          <div className="bg-muted/50 border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Plan Preview</Label>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Plan:</span> {formData.name || 'Unnamed Plan'}</p>
              <p><span className="font-medium">Duration:</span> {formData.duration} days</p>
              <p><span className="font-medium">Price:</span> ₹{formData.price || '0'} 
                {formData.discount !== '0' && ` (${formData.discount}% OFF)`}
              </p>
              <p><span className="font-medium">Benefits:</span> {formData.position} position, {formData.multiplier}x visibility, {formData.badge}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Create Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function BoostPlanDetailDialog({ plan, open, onClose }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Boost Plan Details - {plan.id}</DialogTitle>
          <DialogDescription>{plan.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Plan ID</Label>
              <p className="font-mono text-sm">{plan.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Duration</Label>
              <p>{plan.duration}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Price</Label>
              <p className="font-bold text-lg">{plan.price}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Discount</Label>
              <p>{plan.discount !== '0%' ? plan.discount : 'None'}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Visibility</Label>
              <p>{plan.visibility}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <div className="mt-1">{plan.status}</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Plan Benefits</Label>
            <ul className="space-y-2 text-sm">
              {plan.benefits.map((benefit: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <Label className="text-muted-foreground mb-2 block">Performance Metrics</Label>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold">{plan.totalSales}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue Generated</p>
                <p className="text-xl font-bold text-green-600">{plan.revenue}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
                <p className="text-xl font-bold">{plan.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-blue-50">
            <Label className="text-muted-foreground mb-2 block">ROI Analysis</Label>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Avg. views per boosted listing:</span> 2,340</p>
              <p><span className="font-medium">Avg. messages generated:</span> 18</p>
              <p><span className="font-medium">Conversion rate:</span> 0.77%</p>
              <p><span className="font-medium">Customer satisfaction:</span> 4.6/5.0</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
