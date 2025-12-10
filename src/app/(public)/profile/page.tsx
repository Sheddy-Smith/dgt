'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ListingCard } from '@/components/listings/listing-card'
import { 
  Settings, ShieldCheck, Star, Package, Heart, 
  TrendingUp, Edit, Zap, Award, Calendar, Eye 
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('active')

  // Mock user data
  const user = {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    avatar: '/api/placeholder/200/200',
    memberSince: '2023-05-15',
    isVerified: true,
    isPowerSeller: true,
    kycStatus: 'verified',
    stats: {
      activeAds: 8,
      soldItems: 145,
      totalViews: 45230,
      avgRating: 4.8,
      totalRatings: 67
    }
  }

  const listings = [
    {
      id: '1',
      title: 'iPhone 14 Pro Max 256GB',
      price: 95000,
      location: 'Delhi',
      image: '/api/placeholder/400/300',
      postedAt: '2025-12-08T10:00:00Z',
      isBoosted: true,
      isVerified: true,
      category: 'Mobiles',
      status: 'active',
      views: 234,
      expiresIn: 25
    },
    {
      id: '2',
      title: 'Royal Enfield Classic 350',
      price: 145000,
      location: 'Delhi',
      image: '/api/placeholder/400/300',
      postedAt: '2025-12-07T15:30:00Z',
      isBoosted: false,
      category: 'Vehicles',
      isVerified: true,
      status: 'active',
      views: 156,
      expiresIn: 24
    }
  ]

  const favorites = [
    {
      id: '3',
      title: 'MacBook Pro M2 16"',
      price: 185000,
      location: 'Mumbai',
      image: '/api/placeholder/400/300',
      postedAt: '2025-12-06T12:00:00Z',
      isBoosted: true,
      isVerified: true,
      category: 'Electronics'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl pb-20">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    {user.isVerified && (
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user.memberSince).toLocaleDateString()}
                  </p>
                </div>
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {user.isPowerSeller && (
                  <Badge className="bg-amber-500">
                    <Award className="h-3 w-3 mr-1" />
                    Power Seller
                  </Badge>
                )}
                {user.kycStatus === 'verified' && (
                  <Badge className="bg-green-500">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    KYC Verified
                  </Badge>
                )}
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1 fill-amber-400 text-amber-400" />
                  {user.stats.avgRating} ({user.stats.totalRatings} ratings)
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-2xl font-bold">{user.stats.activeAds}</p>
                  <p className="text-sm text-muted-foreground">Active Ads</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.stats.soldItems}</p>
                  <p className="text-sm text-muted-foreground">Items Sold</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{(user.stats.totalViews / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.stats.avgRating}</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KYC Status Card */}
      {user.kycStatus === 'pending' && (
        <Card className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold mb-1">Complete KYC Verification</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Verify your identity to unlock premium features and build buyer trust
                </p>
                <Link href="/profile/kyc">
                  <Button size="sm">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Complete KYC
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link href="/post">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Post Ad</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/wallet">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">My Wallet</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/boost-plans">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <p className="font-medium">Boost Ads</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/settings">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Settings</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Listings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({listings.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites ({favorites.length})
          </TabsTrigger>
          <TabsTrigger value="sold">
            Sold (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0">
                        <img src={listing.image} alt={listing.title} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 truncate">{listing.title}</h3>
                            <p className="text-lg font-bold">₹{listing.price.toLocaleString()}</p>
                          </div>
                          {listing.isBoosted && (
                            <Badge className="bg-amber-500 ml-2">
                              <Zap className="h-3 w-3 mr-1" />
                              Boosted
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {listing.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Expires in {listing.expiresIn} days
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/listing/${listing.id}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                          <Link href={`/listing/${listing.id}/edit`}>
                            <Button size="sm" variant="outline">Edit</Button>
                          </Link>
                          <Link href="/boost-plans">
                            <Button size="sm" variant="outline">
                              <Zap className="h-3 w-3 mr-1" />
                              Boost
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-2">No active ads</h3>
              <p className="text-muted-foreground mb-4">Start selling by posting your first ad</p>
              <Link href="/post">
                <Button>Post Your First Ad</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {favorites.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-4">Save ads you like to view them later</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sold" className="mt-6">
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-2">No sold items</h3>
            <p className="text-muted-foreground">Items you've marked as sold will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
