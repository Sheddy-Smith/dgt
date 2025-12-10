'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Wallet,
  CreditCard,
  RefreshCw,
  FileText,
  AlertTriangle,
  Settings,
  Download,
  Search,
  Filter,
  Plus,
  Minus,
  Lock,
  Unlock,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
} from 'lucide-react'

// Types
interface WalletUser {
  id: string
  name: string
  phone: string
  balance: number
  heldAmount: number
  lastTransaction: string
  kycVerified: boolean
  status: 'active' | 'limited' | 'frozen'
}

interface PayoutRequest {
  id: string
  userId: string
  userName: string
  amount: number
  method: string
  kycStatus: boolean
  requestDate: string
  fraudScore: number
  status: 'pending' | 'approved' | 'rejected' | 'paid' | 'failed'
}

interface RefundRequest {
  id: string
  type: string
  userId: string
  userName: string
  amount: number
  linkedListing: string
  reason: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
}

interface Transaction {
  id: string
  type: 'credit' | 'debit' | 'refund' | 'payout' | 'boost'
  from: string
  to: string
  amount: number
  gateway: string
  ref: string
  status: string
  timestamp: string
}

interface Chargeback {
  id: string
  userId: string
  userName: string
  amount: number
  reason: string
  gateway: string
  date: string
  deadline: string
  status: 'open' | 'resolved' | 'escalated'
}

export default function WalletPaymentsPage() {
  const [activeTab, setActiveTab] = useState('user-wallets')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWallet, setSelectedWallet] = useState<WalletUser | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit')
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false)

  // Mock data
  const walletUsers: WalletUser[] = [
    {
      id: 'U001',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      balance: 15420.50,
      heldAmount: 500,
      lastTransaction: '2 hours ago',
      kycVerified: true,
      status: 'active'
    },
    {
      id: 'U002',
      name: 'Priya Sharma',
      phone: '+91 98765 43211',
      balance: 8920.00,
      heldAmount: 0,
      lastTransaction: '1 day ago',
      kycVerified: true,
      status: 'active'
    },
    {
      id: 'U003',
      name: 'Amit Singh',
      phone: '+91 98765 43212',
      balance: 2340.75,
      heldAmount: 2340.75,
      lastTransaction: '3 days ago',
      kycVerified: false,
      status: 'limited'
    },
    {
      id: 'U004',
      name: 'Sneha Patel',
      phone: '+91 98765 43213',
      balance: 0,
      heldAmount: 0,
      lastTransaction: '1 week ago',
      kycVerified: true,
      status: 'frozen'
    },
  ]

  const payoutRequests: PayoutRequest[] = [
    {
      id: 'PO001',
      userId: 'U001',
      userName: 'Rajesh Kumar',
      amount: 5000,
      method: 'UPI',
      kycStatus: true,
      requestDate: '2024-12-10 10:30 AM',
      fraudScore: 12,
      status: 'pending'
    },
    {
      id: 'PO002',
      userId: 'U002',
      userName: 'Priya Sharma',
      amount: 3500,
      method: 'Bank Transfer',
      kycStatus: true,
      requestDate: '2024-12-10 09:15 AM',
      fraudScore: 5,
      status: 'approved'
    },
  ]

  const refundRequests: RefundRequest[] = [
    {
      id: 'RF001',
      type: 'Listing Removed',
      userId: 'U003',
      userName: 'Amit Singh',
      amount: 1200,
      linkedListing: 'L12345',
      reason: 'Seller cancelled listing after payment',
      date: '2024-12-10',
      status: 'pending'
    },
    {
      id: 'RF002',
      type: 'Dispute Resolved',
      userId: 'U004',
      userName: 'Sneha Patel',
      amount: 800,
      linkedListing: 'L12346',
      reason: 'Dispute resolved in buyer favor',
      date: '2024-12-09',
      status: 'approved'
    },
  ]

  const transactions: Transaction[] = [
    {
      id: 'TX001',
      type: 'credit',
      from: 'Gateway',
      to: 'U001',
      amount: 5000,
      gateway: 'Razorpay',
      ref: 'RZP_12345',
      status: 'Success',
      timestamp: '2024-12-10 14:30'
    },
    {
      id: 'TX002',
      type: 'debit',
      from: 'U002',
      to: 'Payout',
      amount: 3500,
      gateway: 'Stripe',
      ref: 'STR_67890',
      status: 'Success',
      timestamp: '2024-12-10 13:15'
    },
  ]

  const chargebacks: Chargeback[] = [
    {
      id: 'CB001',
      userId: 'U001',
      userName: 'Rajesh Kumar',
      amount: 2500,
      reason: 'Product not as described',
      gateway: 'Razorpay',
      date: '2024-12-08',
      deadline: '2024-12-15',
      status: 'open'
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      active: { color: 'bg-green-500', label: '🟢 Active' },
      limited: { color: 'bg-orange-500', label: '🟠 Limited' },
      frozen: { color: 'bg-red-500', label: '🔴 Frozen' },
      pending: { color: 'bg-yellow-500', label: 'Pending' },
      approved: { color: 'bg-green-500', label: 'Approved' },
      rejected: { color: 'bg-red-500', label: 'Rejected' },
      paid: { color: 'bg-blue-500', label: 'Paid' },
      failed: { color: 'bg-red-600', label: 'Failed' },
      open: { color: 'bg-orange-500', label: 'Open' },
      resolved: { color: 'bg-green-500', label: 'Resolved' },
      escalated: { color: 'bg-red-500', label: 'Escalated' },
    }
    const variant = variants[status] || { color: 'bg-gray-500', label: status }
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  const getTransactionColor = (type: string) => {
    const colors: Record<string, string> = {
      credit: 'text-green-600',
      debit: 'text-red-600',
      refund: 'text-purple-600',
      payout: 'text-blue-600',
      boost: 'text-orange-600',
    }
    return colors[type] || 'text-gray-600'
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Wallet & Payments</h1>
          <p className="text-muted-foreground mt-1">
            Manage user wallets, payouts, refunds, and transactions
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹26,681.25</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,000</div>
            <p className="text-xs text-muted-foreground">1 request pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refund Queue</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,200</div>
            <p className="text-xs text-muted-foreground">1 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chargebacks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 text-orange-500" /> 7 days to deadline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by User ID, Transaction ID, or Reference..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="frozen">Frozen</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Gateways</SelectItem>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paytm">Paytm</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="user-wallets">
            <Wallet className="mr-2 h-4 w-4" />
            User Wallets
          </TabsTrigger>
          <TabsTrigger value="payouts">
            <CreditCard className="mr-2 h-4 w-4" />
            Payout Requests
          </TabsTrigger>
          <TabsTrigger value="refunds">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refund Queue
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <FileText className="mr-2 h-4 w-4" />
            Transactions Log
          </TabsTrigger>
          <TabsTrigger value="chargebacks">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Chargebacks
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* User Wallets Tab */}
        <TabsContent value="user-wallets">
          <Card>
            <CardHeader>
              <CardTitle>User Wallets</CardTitle>
              <CardDescription>Manage user wallet balances and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Held Amount</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {walletUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(user.balance)}</TableCell>
                      <TableCell>{formatCurrency(user.heldAmount)}</TableCell>
                      <TableCell className="text-muted-foreground">{user.lastTransaction}</TableCell>
                      <TableCell>
                        {user.kycVerified ? (
                          <Badge variant="outline" className="bg-green-50">
                            <CheckCircle className="mr-1 h-3 w-3" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50">
                            <XCircle className="mr-1 h-3 w-3" /> Not Verified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedWallet(user)
                              setDrawerOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedWallet(user)
                              setAdjustDialogOpen(true)
                            }}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedWallet(user)
                              setFreezeDialogOpen(true)
                            }}
                          >
                            {user.status === 'frozen' ? (
                              <Unlock className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
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

        {/* Payout Requests Tab */}
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
              <CardDescription>Review and approve seller withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Fraud Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payout.userName}</div>
                          <div className="text-sm text-muted-foreground">{payout.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{formatCurrency(payout.amount)}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>
                        {payout.kycStatus ? (
                          <Badge variant="outline" className="bg-green-50">Verified</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50">Not Verified</Badge>
                        )}
                      </TableCell>
                      <TableCell>{payout.requestDate}</TableCell>
                      <TableCell>
                        <Badge variant={payout.fraudScore > 50 ? 'destructive' : 'outline'}>
                          {payout.fraudScore}/100
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell>
                        {payout.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refund Queue Tab */}
        <TabsContent value="refunds">
          <Card>
            <CardHeader>
              <CardTitle>Refund Queue</CardTitle>
              <CardDescription>Process refund requests from buyers and sellers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refund ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Linked Listing</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundRequests.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell className="font-medium">{refund.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{refund.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{refund.userName}</div>
                          <div className="text-sm text-muted-foreground">{refund.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-purple-600">
                        {formatCurrency(refund.amount)}
                      </TableCell>
                      <TableCell>
                        <Button variant="link" className="p-0 h-auto">
                          {refund.linkedListing}
                        </Button>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{refund.reason}</TableCell>
                      <TableCell>{refund.date}</TableCell>
                      <TableCell>{getStatusBadge(refund.status)}</TableCell>
                      <TableCell>
                        {refund.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="default">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Log Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transactions Log</CardTitle>
              <CardDescription>Unified ledger of all system transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Ref</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">{txn.id}</TableCell>
                      <TableCell>
                        <Badge className={getTransactionColor(txn.type)}>
                          {txn.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{txn.from}</TableCell>
                      <TableCell>{txn.to}</TableCell>
                      <TableCell className={`font-bold ${getTransactionColor(txn.type)}`}>
                        {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell>{txn.gateway}</TableCell>
                      <TableCell className="font-mono text-xs">{txn.ref}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50">
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{txn.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chargebacks Tab */}
        <TabsContent value="chargebacks">
          <Card>
            <CardHeader>
              <CardTitle>Chargebacks / Disputes</CardTitle>
              <CardDescription>Manage payment disputes and chargebacks</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chargebacks.map((cb) => (
                    <TableRow key={cb.id}>
                      <TableCell className="font-medium">{cb.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cb.userName}</div>
                          <div className="text-sm text-muted-foreground">{cb.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{formatCurrency(cb.amount)}</TableCell>
                      <TableCell>{cb.reason}</TableCell>
                      <TableCell>{cb.gateway}</TableCell>
                      <TableCell>{cb.date}</TableCell>
                      <TableCell className="text-orange-600 font-medium">{cb.deadline}</TableCell>
                      <TableCell>{getStatusBadge(cb.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default">
                            Add Evidence
                          </Button>
                          <Button size="sm" variant="outline">
                            Resolve
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

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gateway Configuration</CardTitle>
                <CardDescription>Manage payment gateway settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Gateway</Label>
                    <Select defaultValue="razorpay">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="razorpay">Razorpay</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paytm">Paytm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fallback Gateway</Label>
                    <Select defaultValue="stripe">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="razorpay">Razorpay</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paytm">Paytm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>Configure payout thresholds and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Payout Amount (₹)</Label>
                    <Input type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Payout Amount (₹)</Label>
                    <Input type="number" defaultValue="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Platform Fee (%)</Label>
                    <Input type="number" defaultValue="2.5" step="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Dual Approval Threshold (₹)</Label>
                    <Input type="number" defaultValue="10000" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refund Settings</CardTitle>
                <CardDescription>Configure automatic refund rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Auto-Refund</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process refunds below threshold
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Auto-Refund Threshold (₹)</Label>
                  <Input type="number" defaultValue="500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>Fraud prevention and audit settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Fraud Score Threshold</Label>
                  <Input type="number" defaultValue="75" />
                  <p className="text-sm text-muted-foreground">
                    Payouts above this score require manual review
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Test Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use sandbox gateways for testing
                    </p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Wallet Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Wallet Details - {selectedWallet?.name}</SheetTitle>
            <SheetDescription>
              User ID: {selectedWallet?.id} | Phone: {selectedWallet?.phone}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Balance Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedWallet && formatCurrency(selectedWallet.balance)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Held Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedWallet && formatCurrency(selectedWallet.heldAmount)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ledger */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Transaction Ledger</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2024-12-10 14:30</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Credit</Badge>
                      </TableCell>
                      <TableCell>Payment received</TableCell>
                      <TableCell className="text-green-600 font-bold">+₹5,000</TableCell>
                      <TableCell>₹15,420.50</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2024-12-09 10:15</TableCell>
                      <TableCell>
                        <Badge className="bg-red-500">Debit</Badge>
                      </TableCell>
                      <TableCell>Boost plan purchase</TableCell>
                      <TableCell className="text-red-600 font-bold">-₹500</TableCell>
                      <TableCell>₹10,420.50</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={() => setAdjustDialogOpen(true)} className="flex-1">
                <DollarSign className="mr-2 h-4 w-4" />
                Adjust Balance
              </Button>
              <Button variant="outline" onClick={() => setFreezeDialogOpen(true)} className="flex-1">
                {selectedWallet?.status === 'frozen' ? (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Unfreeze Wallet
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Freeze Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Adjust Balance Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Wallet Balance</DialogTitle>
            <DialogDescription>
              Manually credit or debit amount for {selectedWallet?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={adjustType} onValueChange={(v) => setAdjustType(v as 'credit' | 'debit')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">
                    <Plus className="inline mr-2 h-4 w-4" />
                    Credit (Add Money)
                  </SelectItem>
                  <SelectItem value="debit">
                    <Minus className="inline mr-2 h-4 w-4" />
                    Debit (Deduct Money)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" placeholder="Enter amount" />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                  <SelectItem value="compensation">Compensation</SelectItem>
                  <SelectItem value="fraud">Fraud Recovery</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (Mandatory)</Label>
              <Textarea placeholder="Provide detailed reason for this adjustment..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button>
              Confirm {adjustType === 'credit' ? 'Credit' : 'Debit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Freeze/Unfreeze Dialog */}
      <Dialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedWallet?.status === 'frozen' ? 'Unfreeze' : 'Freeze'} Wallet
            </DialogTitle>
            <DialogDescription>
              {selectedWallet?.status === 'frozen'
                ? 'Restore wallet access for ' + selectedWallet?.name
                : 'Temporarily freeze wallet for ' + selectedWallet?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedWallet?.status !== 'frozen' && (
              <>
                <div className="space-y-2">
                  <Label>Freeze Reason</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fraud">Suspected Fraud</SelectItem>
                      <SelectItem value="dispute">Ongoing Dispute</SelectItem>
                      <SelectItem value="kyc">KYC Verification</SelectItem>
                      <SelectItem value="investigation">Under Investigation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (Optional)</Label>
                  <Input type="date" />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Add internal notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFreezeDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={selectedWallet?.status === 'frozen' ? 'default' : 'destructive'}>
              {selectedWallet?.status === 'frozen' ? 'Unfreeze Wallet' : 'Freeze Wallet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
