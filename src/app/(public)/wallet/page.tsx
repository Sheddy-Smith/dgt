'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { 
  Wallet, ArrowUpRight, ArrowDownLeft, Plus, Download, 
  CreditCard, Calendar, TrendingUp, RefreshCw, Check 
} from 'lucide-react'
import Link from 'next/link'

export default function WalletPage() {
  const [showTopupDialog, setShowTopupDialog] = useState(false)
  const [showPayoutDialog, setShowPayoutDialog] = useState(false)
  const [topupAmount, setTopupAmount] = useState('')
  const [payoutAmount, setPayoutAmount] = useState('')

  // Mock wallet data
  const wallet = {
    balance: 15420,
    pendingPayouts: 3500,
    totalEarnings: 145000,
    totalSpent: 23400
  }

  const transactions = [
    { id: '1', type: 'credit', amount: 5000, description: 'Payment received for iPhone 14', date: '2025-12-09T14:30:00Z', status: 'completed' },
    { id: '2', type: 'debit', amount: 249, description: 'Premium Boost - Royal Enfield', date: '2025-12-08T10:15:00Z', status: 'completed' },
    { id: '3', type: 'credit', amount: 2500, description: 'Wallet top-up', date: '2025-12-07T16:20:00Z', status: 'completed' },
    { id: '4', type: 'debit', amount: 99, description: 'Basic Boost - MacBook', date: '2025-12-06T11:45:00Z', status: 'completed' },
    { id: '5', type: 'credit', amount: 12000, description: 'Payment received for Bike', date: '2025-12-05T09:30:00Z', status: 'completed' }
  ]

  const payouts = [
    { id: '1', amount: 15000, status: 'pending', requestDate: '2025-12-09T10:00:00Z', account: '****1234' },
    { id: '2', amount: 25000, status: 'completed', requestDate: '2025-12-05T14:00:00Z', completedDate: '2025-12-07T16:30:00Z', account: '****1234' },
    { id: '3', amount: 10000, status: 'completed', requestDate: '2025-11-28T10:00:00Z', completedDate: '2025-11-30T15:20:00Z', account: '****1234' }
  ]

  const handleTopup = () => {
    console.log('Processing topup:', topupAmount)
    setShowTopupDialog(false)
  }

  const handlePayoutRequest = () => {
    console.log('Requesting payout:', payoutAmount)
    setShowPayoutDialog(false)
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-4xl pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Wallet</h1>
        <p className="text-muted-foreground">Manage your earnings and payments</p>
      </div>

      {/* Balance Card */}
      <Card className="mb-6 bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold">₹{wallet.balance.toLocaleString()}</h2>
            </div>
            <Wallet className="h-12 w-12 opacity-50" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs opacity-75">Pending Payouts</p>
              <p className="text-lg font-semibold">₹{wallet.pendingPayouts.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Total Earnings</p>
              <p className="text-lg font-semibold">₹{wallet.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={showTopupDialog} onOpenChange={setShowTopupDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                  <DialogDescription>Enter the amount you want to add</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topup">Amount (₹)</Label>
                    <Input
                      id="topup"
                      type="number"
                      placeholder="Enter amount"
                      value={topupAmount}
                      onChange={(e) => setTopupAmount(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2000].map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        size="sm"
                        onClick={() => setTopupAmount(amt.toString())}
                      >
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full" onClick={handleTopup} disabled={!topupAmount}>
                    Continue to Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Payout</DialogTitle>
                  <DialogDescription>
                    Available balance: ₹{wallet.balance.toLocaleString()}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payout">Amount (₹)</Label>
                    <Input
                      id="payout"
                      type="number"
                      placeholder="Enter amount"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      max={wallet.balance}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum withdrawal: ₹500
                    </p>
                  </div>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Bank Account</span>
                        <Badge variant="secondary">Primary</Badge>
                      </div>
                      <p className="font-medium">HDFC Bank - ****1234</p>
                      <Link href="/settings/bank" className="text-xs text-primary hover:underline">
                        Change account
                      </Link>
                    </CardContent>
                  </Card>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="text-muted-foreground">
                      Payouts are processed within 2-3 business days
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handlePayoutRequest}
                    disabled={!payoutAmount || parseInt(payoutAmount) < 500 || parseInt(payoutAmount) > wallet.balance}
                  >
                    Request Payout
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-2xl font-bold">₹{wallet.totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-950 p-3 rounded-full">
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                <p className="text-2xl font-bold">₹{wallet.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-950 p-3 rounded-full">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((txn) => (
                  <div key={txn.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${txn.type === 'credit' ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'}`}>
                          {txn.type === 'credit' ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{txn.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(txn.date).toLocaleDateString()} at {new Date(txn.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
              <CardDescription>Track your withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div key={payout.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-950">
                          <Download className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">₹{payout.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            To {payout.account}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Requested: {new Date(payout.requestDate).toLocaleDateString()}
                          </p>
                          {payout.completedDate && (
                            <p className="text-xs text-muted-foreground">
                              Completed: {new Date(payout.completedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant={payout.status === 'completed' ? 'default' : 'secondary'}
                        className={payout.status === 'completed' ? 'bg-green-500' : ''}
                      >
                        {payout.status === 'completed' ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <RefreshCw className="h-3 w-3 mr-1" />
                        )}
                        {payout.status}
                      </Badge>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
