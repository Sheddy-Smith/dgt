'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Package, Wallet, TrendingUp, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    totalTokens: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    newListingsToday: 0
  })

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth !== 'authenticated') {
      router.replace('/')
      return
    }
    loadData()
  }, [router])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, listingsRes, transactionsRes] = await Promise.all([
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/listings`),
        fetch(`${API_URL}/transactions`)
      ])

      const users = await usersRes.json()
      const listings = await listingsRes.json()
      const transactions = await transactionsRes.json()

      const totalTokens = users.reduce((sum: number, user: any) => sum + (user.tokens || 0), 0)
      const totalRevenue = transactions
        .filter((t: any) => t.type === 'purchase')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const newUsersToday = users.filter((u: any) => new Date(u.createdAt) >= today).length
      const newListingsToday = listings.filter((l: any) => new Date(l.postedAt) >= today).length

      setStats({
        totalUsers: users.length,
        totalListings: listings.length,
        activeListings: listings.filter((l: any) => l.status === 'active').length,
        totalTokens,
        totalRevenue,
        newUsersToday,
        newListingsToday
      })
    } catch (error) {
      toast.error('Failed to load data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: 'Mon', users: 12, listings: 8, revenue: 450 },
    { name: 'Tue', users: 19, listings: 14, revenue: 780 },
    { name: 'Wed', users: 15, listings: 11, revenue: 620 },
    { name: 'Thu', users: 22, listings: 18, revenue: 950 },
    { name: 'Fri', users: 28, listings: 22, revenue: 1200 },
    { name: 'Sat', users: 35, listings: 28, revenue: 1450 },
    { name: 'Sun', users: 30, listings: 24, revenue: 1100 },
  ]

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to DamagThings Admin Panel</p>
          </div>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersToday} new today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeListings} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTokens}</div>
              <p className="text-xs text-muted-foreground">
                In circulation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                From token sales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                  <Area type="monotone" dataKey="listings" stackId="1" stroke="#10b981" fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
