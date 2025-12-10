'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Package,
  Image as ImageIcon,
  MessageSquare,
  User,
  ChevronRight,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Ban,
  Sparkles,
  Flag,
  Calendar,
  MapPin,
  DollarSign,
  BarChart3,
  Shield,
  Zap,
  Copy,
  ExternalLink,
  MoreVertical,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  images: string[]
  location: string
  contactNumber: string
  sellerId: string
  sellerName: string
  sellerType: 'individual' | 'dealer'
  postedAt: string
  views: number
  status: 'active' | 'pending' | 'rejected' | 'expired'
  // Extended fields
  expiresAt?: string
  boosted?: boolean
  boostExpiresAt?: string
  boostPlan?: string
  reported?: boolean
  reportCount?: number
  flagCount?: number
  riskScore?: number
  aiFlags?: string[]
  messages?: number
  lastEdited?: string
}

const REJECT_REASONS = [
  'Prohibited item',
  'Fake/Counterfeit product',
  'Inappropriate content',
  'Spam/Duplicate',
  'Misleading description',
  'Missing information',
  'Price manipulation',
  'Violates policies',
  'Other'
]

export default function ListingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  
  // Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [extendModalOpen, setExtendModalOpen] = useState(false)
  const [boostModalOpen, setBoostModalOpen] = useState(false)
  
  // Form states
  const [rejectReason, setRejectReason] = useState('')
  const [rejectNote, setRejectNote] = useState('')
  const [notifySeller, setNotifySeller] = useState(true)
  const [refundBoost, setRefundBoost] = useState(false)
  const [extendDays, setExtendDays] = useState('30')

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth !== 'authenticated') {
      router.replace('/')
      return
    }
    loadListings()
  }, [router])

  const loadListings = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/listings`)
      const data = await res.json()
      
      // Enrich with mock data for expiry, boost, reports, AI flags
      const enriched = data.map((listing: any) => {
        const postedDate = new Date(listing.postedAt)
        const expiryDate = new Date(postedDate)
        expiryDate.setDate(expiryDate.getDate() + 30)
        
        return {
          ...listing,
          expiresAt: expiryDate.toISOString(),
          boosted: Math.random() > 0.8,
          boostExpiresAt: Math.random() > 0.5 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          boostPlan: Math.random() > 0.5 ? 'Premium' : 'Basic',
          reported: Math.random() > 0.9,
          reportCount: Math.random() > 0.9 ? Math.floor(Math.random() * 5) + 1 : 0,
          flagCount: Math.random() > 0.85 ? Math.floor(Math.random() * 3) + 1 : 0,
          riskScore: Math.floor(Math.random() * 100),
          aiFlags: Math.random() > 0.8 ? ['duplicate', 'suspicious-text'] : [],
          messages: Math.floor(Math.random() * 20),
          status: listing.status || (Math.random() > 0.7 ? 'active' : 'pending')
        }
      })
      
      setListings(enriched)
      setFilteredListings(enriched)
    } catch (error) {
      toast.error('Failed to load listings')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  useEffect(() => {
    let filtered = listings

    // Tab filtering
    if (activeTab === 'pending') {
      filtered = filtered.filter(l => l.status === 'pending')
    } else if (activeTab === 'reported') {
      filtered = filtered.filter(l => l.reported || (l.reportCount && l.reportCount > 0))
    } else if (activeTab === 'boosted') {
      filtered = filtered.filter(l => l.boosted)
    } else if (activeTab === 'expiring') {
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
      filtered = filtered.filter(l => {
        if (!l.expiresAt) return false
        return new Date(l.expiresAt) <= threeDaysFromNow
      })
    } else if (activeTab === 'expired') {
      filtered = filtered.filter(l => l.status === 'expired' || (l.expiresAt && new Date(l.expiresAt) < new Date()))
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(l => l.category === categoryFilter)
    }

    // City filter
    if (cityFilter !== 'all') {
      filtered = filtered.filter(l => l.location.includes(cityFilter))
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(l => 
        l.id.toLowerCase().includes(query) ||
        l.title.toLowerCase().includes(query) ||
        l.sellerName.toLowerCase().includes(query) ||
        l.location.toLowerCase().includes(query)
      )
    }

    setFilteredListings(filtered)
  }, [activeTab, searchQuery, listings, categoryFilter, cityFilter])

  const openListingDrawer = (listing: Listing) => {
    setSelectedListing(listing)
    setDrawerOpen(true)
  }

  const handleApproveListing = async () => {
    if (!selectedListing) return

    try {
      await fetch(`${API_URL}/listings/${selectedListing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      })

      toast.success('✅ Listing approved & live')
      console.log(`📱 Push to seller ${selectedListing.sellerId}: "Your listing is now live!"`)
      setApproveModalOpen(false)
      loadListings()
      setDrawerOpen(false)
    } catch (error) {
      toast.error('Failed to approve listing')
    }
  }

  const handleRejectListing = async () => {
    if (!selectedListing || !rejectReason) {
      toast.error('Please select a reason')
      return
    }

    try {
      await fetch(`${API_URL}/listings/${selectedListing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectionReason: rejectReason,
          rejectionNote: rejectNote
        })
      })

      if (refundBoost && selectedListing.boosted) {
        console.log(`💰 Refund processed for listing ${selectedListing.id}`)
      }

      toast.success('❌ Listing rejected')
      if (notifySeller) {
        console.log(`📱 Push to seller ${selectedListing.sellerId}: "Listing rejected - ${rejectReason}"`)
      }
      
      setRejectModalOpen(false)
      loadListings()
      setDrawerOpen(false)
    } catch (error) {
      toast.error('Failed to reject listing')
    }
  }

  const handleExtendExpiry = async () => {
    if (!selectedListing) return

    try {
      const currentExpiry = new Date(selectedListing.expiresAt || Date.now())
      currentExpiry.setDate(currentExpiry.getDate() + parseInt(extendDays))

      await fetch(`${API_URL}/listings/${selectedListing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresAt: currentExpiry.toISOString() })
      })

      toast.success(`🕒 Expiry extended by ${extendDays} days`)
      console.log(`📱 Push to seller ${selectedListing.sellerId}: "Listing extended till ${currentExpiry.toLocaleDateString()}"`)
      
      setExtendModalOpen(false)
      loadListings()
    } catch (error) {
      toast.error('Failed to extend expiry')
    }
  }

  const handleExpireNow = async (listingId: string) => {
    if (!confirm('Expire this listing immediately?')) return

    try {
      await fetch(`${API_URL}/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'expired',
          expiresAt: new Date().toISOString()
        })
      })

      toast.success('⏱️ Listing expired')
      loadListings()
    } catch (error) {
      toast.error('Failed to expire listing')
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      'active': <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>,
      'pending': <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>,
      'rejected': <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>,
      'expired': <Badge variant="outline"><Ban className="w-3 h-3 mr-1" />Expired</Badge>
    }
    return badges[status as keyof typeof badges] || badges.pending
  }

  const getRiskBadge = (score: number) => {
    if (score > 70) return <Badge variant="destructive" className="text-xs">High Risk {score}</Badge>
    if (score > 40) return <Badge className="bg-yellow-500 text-xs">Medium {score}</Badge>
    return <Badge className="bg-green-500 text-xs">Low {score}</Badge>
  }

  const getDaysUntilExpiry = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return <span className="text-red-600 text-xs">Expired</span>
    if (days <= 3) return <span className="text-orange-600 text-xs font-medium">{days}d left</span>
    return <span className="text-muted-foreground text-xs">{days} days</span>
  }

  const categories = ['All', ...Array.from(new Set(listings.map(l => l.category)))]
  const cities = ['All', ...Array.from(new Set(listings.map(l => l.location.split(',')[0])))]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Listings Management</h1>
            <div className="flex gap-4 mt-2">
              <span className="text-sm text-muted-foreground">
                <strong>{listings.length}</strong> Total
              </span>
              <span className="text-sm text-green-600">
                <strong>{listings.filter(l => l.status === 'active').length}</strong> Active
              </span>
              <span className="text-sm text-yellow-600">
                <strong>{listings.filter(l => l.status === 'pending').length}</strong> Pending
              </span>
              <span className="text-sm text-red-600">
                <strong>{listings.filter(l => l.reported).length}</strong> Reported
              </span>
              <span className="text-sm text-blue-600">
                <strong>{listings.filter(l => l.boosted).length}</strong> Boosted
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadListings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              🟢 All ({listings.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              🟡 Pending ({listings.filter(l => l.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="reported">
              🔴 Reported ({listings.filter(l => l.reported).length})
            </TabsTrigger>
            <TabsTrigger value="boosted">
              💎 Boosted ({listings.filter(l => l.boosted).length})
            </TabsTrigger>
            <TabsTrigger value="expiring">
              🕓 Expiring Soon ({listings.filter(l => {
                if (!l.expiresAt) return false
                const days = Math.ceil((new Date(l.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                return days <= 3 && days > 0
              }).length})
            </TabsTrigger>
            <TabsTrigger value="expired">
              ⚫ Expired ({listings.filter(l => l.status === 'expired').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search by ID, title, seller, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.filter(c => c !== 'All').map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.filter(c => c !== 'All').map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions Bar */}
        {selectedListings.length > 0 && (
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedListings.length} listings selected</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    <Clock className="w-4 h-4 mr-2" />
                    Extend
                  </Button>
                  <Button size="sm" variant="outline">
                    <Ban className="w-4 h-4 mr-2" />
                    Expire
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedListings.length === filteredListings.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedListings(filteredListings.map(l => l.id))
                          } else {
                            setSelectedListings([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredListings.map((listing) => (
                    <TableRow 
                      key={listing.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => openListingDrawer(listing)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={selectedListings.includes(listing.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedListings(prev => [...prev, listing.id])
                            } else {
                              setSelectedListings(prev => prev.filter(id => id !== listing.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{listing.id}</TableCell>
                      <TableCell>
                        <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          {listing.images[0] ? (
                            <img 
                              src={listing.images[0]} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          {listing.boosted && (
                            <div className="absolute top-0 right-0 bg-yellow-400 p-1 rounded-bl">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">{listing.title}</div>
                          <div className="flex gap-1 mt-1">
                            {listing.reported && (
                              <Badge variant="destructive" className="text-xs">
                                <Flag className="w-3 h-3 mr-1" />
                                {listing.reportCount}
                              </Badge>
                            )}
                            {listing.aiFlags && listing.aiFlags.length > 0 && (
                              <Badge className="bg-purple-500 text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                            {listing.boosted && (
                              <Badge className="bg-yellow-500 text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Boosted
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">₹{listing.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{listing.category}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {listing.location.split(',')[0]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{listing.sellerName}</div>
                          <div className="text-xs text-muted-foreground">{listing.sellerType}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(listing.postedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {listing.expiresAt && getDaysUntilExpiry(listing.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          {listing.views}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(listing.status)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {listing.flagCount ? (
                            <Badge variant="destructive" className="text-xs">
                              🚩 {listing.flagCount}
                            </Badge>
                          ) : null}
                          {listing.riskScore !== undefined && listing.riskScore > 40 && (
                            getRiskBadge(listing.riskScore)
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openListingDrawer(listing)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Listing Detail Drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            {selectedListing && (
              <>
                <SheetHeader>
                  <SheetTitle className="text-xl">{selectedListing.title}</SheetTitle>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(selectedListing.status)}
                    {selectedListing.boosted && (
                      <Badge className="bg-yellow-500">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Boosted
                      </Badge>
                    )}
                    {selectedListing.reported && (
                      <Badge variant="destructive">
                        <Flag className="w-3 h-3 mr-1" />
                        {selectedListing.reportCount} Reports
                      </Badge>
                    )}
                  </div>
                </SheetHeader>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 my-6">
                  {selectedListing.status === 'pending' && (
                    <>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => setApproveModalOpen(true)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => setRejectModalOpen(true)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedListing.status === 'active' && (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setExtendModalOpen(true)}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Extend
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleExpireNow(selectedListing.id)}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Expire Now
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    View Seller
                  </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="chat">Chats</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="font-bold text-lg">₹{selectedListing.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Category</span>
                          <Badge variant="outline">{selectedListing.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Condition</span>
                          <span className="font-medium">{selectedListing.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Location</span>
                          <span className="font-medium">{selectedListing.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Posted</span>
                          <span>{new Date(selectedListing.postedAt).toLocaleDateString()}</span>
                        </div>
                        {selectedListing.expiresAt && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Expires</span>
                            <span>{new Date(selectedListing.expiresAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{selectedListing.description}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Engagement</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{selectedListing.views}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{selectedListing.messages || 0}</div>
                          <div className="text-xs text-muted-foreground">Messages</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{selectedListing.reportCount || 0}</div>
                          <div className="text-xs text-muted-foreground">Reports</div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedListing.riskScore !== undefined && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-2">
                            <span>Risk Score</span>
                            {getRiskBadge(selectedListing.riskScore)}
                          </div>
                          {selectedListing.aiFlags && selectedListing.aiFlags.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm font-medium mb-2">AI Flags:</div>
                              <div className="flex flex-wrap gap-2">
                                {selectedListing.aiFlags.map((flag, i) => (
                                  <Badge key={i} className="bg-purple-500">
                                    <Shield className="w-3 h-3 mr-1" />
                                    {flag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {selectedListing.boosted && (
                      <Card className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-600" />
                            Boost Active
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Plan</span>
                            <span className="font-medium">{selectedListing.boostPlan}</span>
                          </div>
                          {selectedListing.boostExpiresAt && (
                            <div className="flex justify-between text-sm">
                              <span>Expires</span>
                              <span>{new Date(selectedListing.boostExpiresAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="media">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Images ({selectedListing.images.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedListing.images.map((img, i) => (
                            <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="history">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Activity Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Listing Created</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(selectedListing.postedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          {selectedListing.boosted && (
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">Boosted</div>
                                <div className="text-xs text-muted-foreground">Plan: {selectedListing.boostPlan}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="chat">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Chat Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center text-sm text-muted-foreground py-8">
                          {selectedListing.messages || 0} conversations from this listing
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Approve Modal */}
        <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Listing</DialogTitle>
              <DialogDescription>
                This listing will become visible to all users in the marketplace.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-medium">{selectedListing?.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Seller will be notified immediately
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleApproveListing}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Modal */}
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Listing</DialogTitle>
              <DialogDescription>
                The listing will be hidden and the seller will be notified.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Rejection Reason</Label>
                <Select value={rejectReason} onValueChange={setRejectReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REJECT_REASONS.map(reason => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Additional Note (optional)</Label>
                <Textarea
                  placeholder="Add details for the seller..."
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notify-seller"
                    checked={notifySeller}
                    onCheckedChange={(checked) => setNotifySeller(checked as boolean)}
                  />
                  <label htmlFor="notify-seller" className="text-sm">
                    Send notification to seller
                  </label>
                </div>
                {selectedListing?.boosted && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="refund-boost"
                      checked={refundBoost}
                      onCheckedChange={(checked) => setRefundBoost(checked as boolean)}
                    />
                    <label htmlFor="refund-boost" className="text-sm">
                      Refund boost payment
                    </label>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectListing} disabled={!rejectReason}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject Listing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Extend Expiry Modal */}
        <Dialog open={extendModalOpen} onOpenChange={setExtendModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Extend Listing Expiry</DialogTitle>
              <DialogDescription>
                Add more days to the listing's active period.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Current Expiry</Label>
                <div className="text-sm font-medium mt-1">
                  {selectedListing?.expiresAt ? new Date(selectedListing.expiresAt).toLocaleDateString() : 'Not set'}
                </div>
              </div>
              <div>
                <Label>Extend By</Label>
                <Select value={extendDays} onValueChange={setExtendDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExtendModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExtendExpiry}>
                <Clock className="w-4 h-4 mr-2" />
                Extend Expiry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
