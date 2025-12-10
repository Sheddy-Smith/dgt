
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Package, Wallet, TrendingUp, Eye, Edit, Trash2, CheckCircle, XCircle, Shield } from 'lucide-react'

interface User {
  id: string
  mobile: string
  tokens: number
  createdAt: string
}

interface Listing {
  id: string
  title: string
  description: string
  price: string
  category: string
  condition: string
  contactNumber: string
  sellerId: string
  sellerName: string
  postedAt: string
  status: 'active' | 'pending' | 'rejected'
  location: string
  // New verification fields
  is_verified?: boolean
  verified_at?: string
  expires_at?: string
  verification_transaction_id?: string
  hasNoExpiry?: boolean
}

interface Transaction {
  id: string
  userId: string
  type: 'purchase' | 'unlock' | 'verification' | 'refund'
  tokens: number
  amount?: number
  listingId?: string
  createdAt: string
}

export default function AdminPanel() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalTokens: 0,
    totalRevenue: 0
  })

  // Auth guard
  useEffect(() => {
    requireAuth((path) => router.replace(path))
  }, [])

  // Mock data
  useEffect(() => {
    const mockUsers: User[] = [
      { id: '1', mobile: '9876543210', tokens: 5, createdAt: '2024-01-01T00:00:00.000Z' },
      { id: '2', mobile: '9123456789', tokens: 12, createdAt: '2024-01-02T00:00:00.000Z' },
      { id: '3', mobile: '9988776655', tokens: 0, createdAt: '2024-01-03T00:00:00.000Z' },
      { id: '4', mobile: '9765432109', tokens: 8, createdAt: '2024-01-04T00:00:00.000Z' }
    ]

    const mockListings: Listing[] = [
      {
        id: '1',
        title: 'Damaged Refrigerator',
        description: 'Double door fridge, cooling issue',
        price: '₹8,000',
        category: 'Appliances',
        condition: 'Needs Repair',
        contactNumber: '9876543210',
        sellerId: '1',
        sellerName: 'Rahul Sharma',
        postedAt: '2024-01-15T10:00:00.000Z',
        status: 'active',
        location: 'Delhi',
        is_verified: true,
        verified_at: '2024-01-15T11:00:00.000Z',
        verification_transaction_id: 'txn_verify_1',
        hasNoExpiry: false
      },
      {
        id: '2',
        title: 'Used Motorcycle',
        description: 'Bajaj Pulsar, 2018 model',
        price: '₹45,000',
        category: 'Vehicles',
        condition: 'Used',
        contactNumber: '9123456789',
        sellerId: '2',
        sellerName: 'Amit Kumar',
        postedAt: '2024-01-15T08:00:00.000Z',
        status: 'active',
        location: 'Mumbai',
        is_verified: false,
        expires_at: '2024-02-14T08:00:00.000Z',
        hasNoExpiry: false
      },
      {
        id: '3',
        title: 'Broken Washing Machine',
        description: 'LG washing machine, drum issue',
        price: '₹3,500',
        category: 'Appliances',
        condition: 'For Parts',
        contactNumber: '9988776655',
        sellerId: '3',
        sellerName: 'Priya Singh',
        postedAt: '2024-01-14T15:00:00.000Z',
        status: 'pending',
        location: 'Bangalore',
        is_verified: false,
        expires_at: '2024-02-13T15:00:00.000Z',
        hasNoExpiry: false
      },
      {
        id: '4',
        title: 'Special Listing - No Expiry',
        description: 'Vintage item, special case',
        price: '₹15,000',
        category: 'Furniture',
        condition: 'Used',
        contactNumber: '9765432109',
        sellerId: '4',
        sellerName: 'Admin Special',
        postedAt: '2024-01-10T10:00:00.000Z',
        status: 'active',
        location: 'Delhi',
        is_verified: false,
        hasNoExpiry: true // Admin override
      }
    ]

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        userId: '1',
        type: 'purchase',
        tokens: 6,
        amount: 50,
        createdAt: '2024-01-15T09:00:00.000Z'
      },
      {
        id: '2',
        userId: '2',
        type: 'unlock',
        tokens: 1,
        listingId: '1',
        createdAt: '2024-01-15T11:00:00.000Z'
      },
      {
        id: '3',
        userId: '1',
        type: 'verification',
        tokens: 1,
        listingId: '1',
        createdAt: '2024-01-15T11:00:00.000Z'
      },
      {
        id: '4',
        userId: '2',
        type: 'purchase',
        tokens: 13,
        amount: 100,
        createdAt: '2024-01-14T16:00:00.000Z'
      }
    ]

    setUsers(mockUsers)
    setListings(mockListings)
    setTransactions(mockTransactions)

    // Calculate stats
    const totalTokens = mockUsers.reduce((sum, user) => sum + user.tokens, 0)
    const totalRevenue = mockTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    setStats({
      totalUsers: mockUsers.length,
      totalListings: mockListings.length,
      totalTokens: totalTokens,
      totalRevenue: totalRevenue
    })
  }, [])

  const handleAdminVerifyListing = (listingId: string) => {
    setListings(listings.map(listing => 
      listing.id === listingId 
        ? { 
            ...listing, 
            is_verified: true, 
            verified_at: new Date().toISOString(),
            expires_at: undefined // Remove expiry
          }
        : listing
    ))
    alert('✅ Listing verified by admin!')
  }

  const handleAdminUnverifyListing = (listingId: string, refund: boolean = false) => {
    const listing = listings.find(l => l.id === listingId)
    if (!listing) return
    
    // Update listing
    setListings(listings.map(l => 
      l.id === listingId 
        ? { 
            ...l, 
            is_verified: false, 
            verified_at: undefined,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        : l
    ))
    
    // Refund tokens if requested
    if (refund && listing.verification_transaction_id) {
      const user = users.find(u => u.id === listing.sellerId)
      if (user) {
        setUsers(users.map(u => 
          u.id === listing.sellerId 
            ? { ...u, tokens: u.tokens + 1 }
            : u
        ))
        
        // Add refund transaction
        const refundTransaction: Transaction = {
          id: Date.now().toString(),
          userId: listing.sellerId,
          type: 'refund',
          tokens: 1,
          listingId: listingId,
          createdAt: new Date().toISOString()
        }
        setTransactions([refundTransaction, ...transactions])
      }
    }
    
    alert(`✅ Listing unverified${refund ? ' with token refund' : ''}!`)
  }

  const handleAdminSetNoExpiry = (listingId: string, noExpiry: boolean) => {
    setListings(listings.map(listing => 
      listing.id === listingId 
        ? { 
            ...listing, 
            hasNoExpiry: noExpiry,
            expires_at: noExpiry ? undefined : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        : listing
    ))
    alert(`✅ Listing ${noExpiry ? 'set to no expiry' : 'expiry restored'}!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🛒 DamagThings Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage users, listings, and transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <p className="text-xs text-muted-foreground">Posted items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTokens}</div>
              <p className="text-xs text-muted-foreground">In user wallets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">From token sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{user.tokens}</span>
                            <Input
                              type="number"
                              placeholder="New tokens"
                              className="w-24 h-8"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const newTokens = parseInt((e.target as HTMLInputElement).value)
                                  if (!isNaN(newTokens)) {
                                    handleUpdateUserTokens(user.id, newTokens)
                                    ;(e.target as HTMLInputElement).value = ''
                                  }
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Listing Management & Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.title}</TableCell>
                        <TableCell>{listing.category}</TableCell>
                        <TableCell>{listing.price}</TableCell>
                        <TableCell>{listing.sellerName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {listing.is_verified ? (
                              <Badge variant="default" className="text-xs bg-green-500">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Not Verified
                              </Badge>
                            )}
                            {listing.verified_at && (
                              <span className="text-xs text-gray-500">
                                {new Date(listing.verified_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {listing.hasNoExpiry ? (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                                ♾️ No Expiry
                              </Badge>
                            ) : listing.is_verified ? (
                              <span className="text-xs text-green-600">No expiry</span>
                            ) : listing.expires_at ? (
                              <span className="text-xs text-orange-600">
                                {new Date(listing.expires_at).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">30 days</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              listing.status === 'active' ? 'default' :
                              listing.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Select
                              value={listing.status}
                              onValueChange={(value: 'active' | 'pending' | 'rejected') => 
                                setListings(listings.map(l => 
                                  l.id === listing.id ? { ...l, status: value } : l
                                ))
                              }
                            >
                              <SelectTrigger className="w-20 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {!listing.is_verified ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAdminVerifyListing(listing.id)}
                                className="text-xs h-8"
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                Verify
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAdminUnverifyListing(listing.id, false)}
                                className="text-xs h-8"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Unverify
                              </Button>
                            )}
                            
                            {listing.is_verified && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAdminUnverifyListing(listing.id, true)}
                                className="text-xs h-8"
                              >
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Refund
                              </Button>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAdminSetNoExpiry(listing.id, !listing.hasNoExpiry)}
                              className="text-xs h-8"
                            >
                              {listing.hasNoExpiry ? 'Set Expiry' : 'No Expiry'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History (including Verification)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Listing</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.userId}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              transaction.type === 'purchase' ? 'default' :
                              transaction.type === 'verification' ? 'default' :
                              transaction.type === 'refund' ? 'destructive' : 'secondary'
                            }
                            className={
                              transaction.type === 'verification' ? 'bg-green-500' :
                              transaction.type === 'refund' ? 'bg-red-500' : ''
                            }
                          >
                            {transaction.type === 'verification' && '🛡️ '}
                            {transaction.type === 'refund' && '💰 '}
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={
                            transaction.type === 'refund' ? 'text-green-600 font-medium' : ''
                          }>
                            {transaction.type === 'refund' ? '+' : '-'}{transaction.tokens}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.amount ? `₹${transaction.amount}` : '-'}</TableCell>
                        <TableCell>{transaction.listingId || '-'}</TableCell>
                        <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}