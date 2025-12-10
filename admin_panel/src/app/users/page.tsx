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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  EyeOff, 
  Shield, 
  ShieldAlert, 
  Ban, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Wallet,
  Package,
  MessageSquare,
  Smartphone,
  MapPin,
  FileText,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Settings,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface User {
  id: string
  name: string
  mobile: string
  phone: string
  email?: string
  tokens: number
  password: string
  isLoggedIn: boolean
  createdAt: string
  city?: string
  kycStatus?: 'none' | 'pending' | 'approved' | 'rejected'
  blocked?: boolean
  blockReason?: string
  blockUntil?: string
  strikes?: number
  riskScore?: number
  listingsCount?: number
  activeListings?: number
  disputes?: number
  walletBalance?: number
  lastActive?: string
  powerSeller?: boolean
}

interface KYCDocument {
  type: 'id' | 'selfie'
  url: string
  status: 'pending' | 'approved' | 'rejected'
  uploadedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

interface DeviceInfo {
  id: string
  fingerprint: string
  ip: string
  lastSeen: string
  vpn: boolean
  tor: boolean
  city?: string
  otherAccounts?: string[]
}

export default function UsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  
  // Modals
  const [blockModalOpen, setBlockModalOpen] = useState(false)
  const [unblockModalOpen, setUnblockModalOpen] = useState(false)
  const [warnModalOpen, setWarnModalOpen] = useState(false)
  const [kycModalOpen, setKycModalOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  
  // Form states
  const [blockReason, setBlockReason] = useState('')
  const [blockDuration, setBlockDuration] = useState('30')
  const [blockNote, setBlockNote] = useState('')
  const [expireListings, setExpireListings] = useState(false)
  const [unmaskedPII, setUnmaskedPII] = useState<string[]>([])

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth !== 'authenticated') {
      router.replace('/')
      return
    }
    loadUsers()
  }, [router])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/users`)
      const data = await res.json()
      
      // Enrich with mock data
      const enriched = data.map((u: any) => ({
        ...u,
        kycStatus: u.kycStatus || (Math.random() > 0.7 ? 'approved' : Math.random() > 0.5 ? 'pending' : 'none'),
        blocked: u.blocked || false,
        strikes: u.strikes || Math.floor(Math.random() * 3),
        riskScore: u.riskScore || Math.floor(Math.random() * 100),
        listingsCount: u.listingsCount || Math.floor(Math.random() * 20),
        activeListings: u.activeListings || Math.floor(Math.random() * 10),
        disputes: u.disputes || Math.floor(Math.random() * 3),
        walletBalance: u.tokens || 0,
        lastActive: u.lastActive || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        powerSeller: u.powerSeller || Math.random() > 0.8
      }))
      
      setUsers(enriched)
      setFilteredUsers(enriched)
    } catch (error) {
      toast.error('Failed to load users')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  useEffect(() => {
    let filtered = users

    // Tab filtering
    if (activeTab === 'kyc') {
      filtered = filtered.filter(u => u.kycStatus === 'pending')
    } else if (activeTab === 'blocked') {
      filtered = filtered.filter(u => u.blocked)
    } else if (activeTab === 'power-sellers') {
      filtered = filtered.filter(u => u.powerSeller)
    } else if (activeTab === 'high-refund') {
      filtered = filtered.filter(u => (u.disputes || 0) > 1)
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(u => 
        u.id.toLowerCase().includes(query) ||
        u.name.toLowerCase().includes(query) ||
        u.mobile.includes(query) ||
        u.email?.toLowerCase().includes(query)
      )
    }

    setFilteredUsers(filtered)
  }, [activeTab, searchQuery, users])

  const openUserDrawer = (user: User) => {
    setSelectedUser(user)
    setDrawerOpen(true)
  }

  const handleBlockUser = async () => {
    if (!selectedUser || !blockReason) {
      toast.error('Please select a reason')
      return
    }

    try {
      const blockUntil = new Date()
      blockUntil.setDate(blockUntil.getDate() + parseInt(blockDuration))

      await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocked: true,
          blockReason,
          blockNote,
          blockUntil: blockUntil.toISOString(),
          strikes: (selectedUser.strikes || 0) + 1
        })
      })

      toast.success(`User blocked for ${blockDuration} days`)
      setBlockModalOpen(false)
      loadUsers()
      setDrawerOpen(false)
      
      // Simulate real-time push
      console.log(`📱 Push sent to user ${selectedUser.id}: Account blocked`)
    } catch (error) {
      toast.error('Failed to block user')
    }
  }

  const handleUnblockUser = async () => {
    if (!selectedUser) return

    try {
      await fetch(`${API_URL}/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocked: false,
          blockReason: null,
          blockUntil: null
        })
      })

      toast.success('User unblocked successfully')
      setUnblockModalOpen(false)
      loadUsers()
      setDrawerOpen(false)
      
      console.log(`📱 Push sent to user ${selectedUser.id}: Account unblocked`)
    } catch (error) {
      toast.error('Failed to unblock user')
    }
  }

  const unmaskPII = (userId: string, field: string) => {
    const reason = prompt(`Why do you need to unmask ${field}?`)
    if (!reason) return

    setUnmaskedPII(prev => [...prev, `${userId}-${field}`])
    
    // Log audit
    console.log(`🔓 Admin unmasked ${field} for user ${userId}. Reason: ${reason}`)
    toast.success('PII unmasked (logged in audit)')
  }

  const isUnmasked = (userId: string, field: string) => {
    return unmaskedPII.includes(`${userId}-${field}`)
  }

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
  }

  const getRiskBadge = (score: number) => {
    if (score > 70) return <Badge variant="destructive">High Risk</Badge>
    if (score > 40) return <Badge className="bg-yellow-500">Medium</Badge>
    return <Badge className="bg-green-500">Low Risk</Badge>
  }

  const getKYCBadge = (status: string) => {
    const badges = {
      'approved': <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>,
      'pending': <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>,
      'rejected': <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>,
      'none': <Badge variant="outline">No KYC</Badge>
    }
    return badges[status as keyof typeof badges] || badges.none
  }

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
            <h1 className="text-3xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">
              {filteredUsers.length} users • {users.filter(u => u.blocked).length} blocked • {users.filter(u => u.kycStatus === 'pending').length} KYC pending
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadUsers}>
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
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              All Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="kyc">
              KYC Queue ({users.filter(u => u.kycStatus === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="blocked">
              Blocked ({users.filter(u => u.blocked).length})
            </TabsTrigger>
            <TabsTrigger value="power-sellers">
              Power Sellers ({users.filter(u => u.powerSeller).length})
            </TabsTrigger>
            <TabsTrigger value="high-refund">
              High Refund ({users.filter(u => (u.disputes || 0) > 1).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search by ID, name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.length > 0 && (
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{selectedUsers.length} users selected</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Warn
                  </Button>
                  <Button size="sm" variant="outline">
                    <Ban className="w-4 h-4 mr-2" />
                    Block
                  </Button>
                  <Button size="sm" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Force Re-KYC
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

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedUsers.length === filteredUsers.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(filteredUsers.map(u => u.id))
                          } else {
                            setSelectedUsers([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Listings</TableHead>
                    <TableHead>Disputes</TableHead>
                    <TableHead>Strikes</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => openUserDrawer(user)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers(prev => [...prev, user.id])
                            } else {
                              setSelectedUsers(prev => prev.filter(id => id !== user.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.powerSeller && <Badge className="bg-purple-500">⭐ Power</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            {isUnmasked(user.id, 'phone') ? (
                              <span>{user.mobile}</span>
                            ) : (
                              <span className="text-muted-foreground">{maskPhone(user.mobile)}</span>
                            )}
                            {!isUnmasked(user.id, 'phone') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  unmaskPII(user.id, 'phone')
                                }}
                              >
                                <Eye className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          {user.email && (
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getKYCBadge(user.kycStatus || 'none')}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.listingsCount || 0} total</div>
                          <div className="text-xs text-green-600">{user.activeListings || 0} active</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.disputes ? (
                          <Badge variant="destructive">{user.disputes}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.strikes ? (
                          <Badge variant="outline" className="border-red-500 text-red-600">
                            {user.strikes} ⚠️
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell>{getRiskBadge(user.riskScore || 0)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Wallet className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{user.walletBalance || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.blocked ? (
                          <Badge variant="destructive">
                            <Ban className="w-3 h-3 mr-1" />
                            Blocked
                          </Badge>
                        ) : user.isLoggedIn ? (
                          <Badge className="bg-green-500">
                            <div className="w-2 h-2 bg-white rounded-full mr-1" />
                            Online
                          </Badge>
                        ) : (
                          <Badge variant="outline">Offline</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openUserDrawer(user)}
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

        {/* User Profile Drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            {selectedUser && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{selectedUser.name}</span>
                        {selectedUser.kycStatus === 'approved' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {selectedUser.powerSeller && (
                          <Badge className="bg-purple-500">⭐ Power Seller</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground font-normal">
                        ID: {selectedUser.id}
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 my-6">
                  {selectedUser.blocked ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setUnblockModalOpen(true)}
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Unblock
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setBlockModalOpen(true)}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Block
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" onClick={() => setWarnModalOpen(true)}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Warn
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Re-KYC
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setWalletModalOpen(true)}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Adjust Wallet
                  </Button>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                    <TabsTrigger value="listings">Listings</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Phone</span>
                          <div className="flex items-center gap-2">
                            {isUnmasked(selectedUser.id, 'phone') ? (
                              <span className="font-medium">{selectedUser.mobile}</span>
                            ) : (
                              <>
                                <span className="font-medium">{maskPhone(selectedUser.mobile)}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => unmaskPII(selectedUser.id, 'phone')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        {selectedUser.email && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Email</span>
                            <span className="font-medium">{selectedUser.email}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">City</span>
                          <span className="font-medium">{selectedUser.city || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Joined</span>
                          <span className="font-medium">
                            {new Date(selectedUser.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Trust & Safety</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">KYC Status</span>
                          {getKYCBadge(selectedUser.kycStatus || 'none')}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Risk Score</span>
                          {getRiskBadge(selectedUser.riskScore || 0)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Strikes</span>
                          <Badge variant="outline">{selectedUser.strikes || 0}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Disputes</span>
                          <Badge variant="outline">{selectedUser.disputes || 0}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedUser.blocked && (
                      <Card className="border-red-200 bg-red-50">
                        <CardHeader>
                          <CardTitle className="text-sm text-red-700">Blocked</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-sm">
                            <strong>Reason:</strong> {selectedUser.blockReason || 'Not specified'}
                          </div>
                          {selectedUser.blockUntil && (
                            <div className="text-sm">
                              <strong>Until:</strong> {new Date(selectedUser.blockUntil).toLocaleDateString()}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="wallet">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>Wallet Balance</span>
                          <span className="text-2xl font-bold">{selectedUser.walletBalance || 0} tokens</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground mb-4">
                          Recent transactions will appear here
                        </div>
                        <Button variant="outline" className="w-full" onClick={() => setWalletModalOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Adjust Balance
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="listings">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Listing Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold">{selectedUser.listingsCount || 0}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">{selectedUser.activeListings || 0}</div>
                            <div className="text-xs text-muted-foreground">Active</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-red-600">
                              {(selectedUser.listingsCount || 0) - (selectedUser.activeListings || 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">Inactive</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="activity">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>Last active: {selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleString() : 'Never'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Smartphone className="w-4 h-4 text-muted-foreground" />
                            <span>Status: {selectedUser.isLoggedIn ? 'Online' : 'Offline'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Block Modal */}
        <Dialog open={blockModalOpen} onOpenChange={setBlockModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block User</DialogTitle>
              <DialogDescription>
                This action will prevent the user from accessing their account.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Reason</Label>
                <Select value={blockReason} onValueChange={setBlockReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="abuse">Abuse</SelectItem>
                    <SelectItem value="scam">Scam</SelectItem>
                    <SelectItem value="fake-listings">Fake Listings</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (days)</Label>
                <Select value={blockDuration} onValueChange={setBlockDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="99999">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Additional Note (optional)</Label>
                <Textarea
                  placeholder="Add internal notes..."
                  value={blockNote}
                  onChange={(e) => setBlockNote(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="expire-listings"
                  checked={expireListings}
                  onCheckedChange={(checked) => setExpireListings(checked as boolean)}
                />
                <label htmlFor="expire-listings" className="text-sm">
                  Also expire all active listings
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBlockModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBlockUser} disabled={!blockReason}>
                <Ban className="w-4 h-4 mr-2" />
                Block User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Unblock Modal */}
        <Dialog open={unblockModalOpen} onOpenChange={setUnblockModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unblock User</DialogTitle>
              <DialogDescription>
                This will restore user access to their account.
              </DialogDescription>
            </DialogHeader>
            {selectedUser?.blockReason && (
              <div className="py-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">Previous Block Reason:</div>
                  <div className="text-sm">{selectedUser.blockReason}</div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setUnblockModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUnblockUser}>
                <Unlock className="w-4 h-4 mr-2" />
                Unblock User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Wallet Adjustment Modal */}
        <Dialog open={walletModalOpen} onOpenChange={setWalletModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adjust Wallet Balance</DialogTitle>
              <DialogDescription>
                Add or deduct tokens from user's wallet
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Current Balance</Label>
                <div className="text-2xl font-bold">{selectedUser?.walletBalance || 0} tokens</div>
              </div>
              <div>
                <Label>Adjustment Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit (Add)</SelectItem>
                    <SelectItem value="debit">Debit (Subtract)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input type="number" placeholder="Enter amount" />
              </div>
              <div>
                <Label>Reason</Label>
                <Textarea placeholder="Reason for adjustment..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWalletModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success('Wallet adjusted successfully')
                setWalletModalOpen(false)
              }}>
                Apply Adjustment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
