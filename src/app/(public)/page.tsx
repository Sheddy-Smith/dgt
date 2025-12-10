'use client'

import { useEffect, useState } from 'react'
import { BannerCarousel } from '@/components/home/banner-carousel'
import { ListingCard, ListingCardSkeleton } from '@/components/listings/listing-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Zap, TrendingUp, Clock, Package } from 'lucide-react'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  price: number
  location: string
  image: string
  postedAt: string
  isBoosted: boolean
  isVerified: boolean
  category: string
}

export default function HomePage() {
  const [boostedListings, setBoostedListings] = useState<Listing[]>([])
  const [recentListings, setRecentListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockListings = [
        {
          id: '1',
          title: 'iPhone 14 Pro Max 256GB Space Black',
          price: 95000,
          location: 'Delhi',
          image: '/api/placeholder/400/300',
          postedAt: '2025-12-09T10:00:00Z',
          isBoosted: true,
          isVerified: true,
          category: 'Mobiles'
        },
        {
          id: '2',
          title: 'Royal Enfield Classic 350 - 2022 Model',
          price: 145000,
          location: 'Mumbai',
          image: '/api/placeholder/400/300',
          postedAt: '2025-12-08T15:30:00Z',
          isBoosted: true,
          isVerified: false,
          category: 'Vehicles'
        },
        {
          id: '3',
          title: '2 BHK Apartment for Rent in Noida',
          price: 18000,
          location: 'Noida',
          image: '/api/placeholder/400/300',
          postedAt: '2025-12-10T08:00:00Z',
          isBoosted: false,
          isVerified: true,
          category: 'Real Estate'
        },
        {
          id: '4',
          title: 'MacBook Air M2 8GB RAM 256GB SSD',
          price: 85000,
          location: 'Bangalore',
          image: '/api/placeholder/400/300',
          postedAt: '2025-12-09T12:00:00Z',
          isBoosted: false,
          isVerified: false,
          category: 'Electronics'
        }
      ]

      setBoostedListings(mockListings.filter(l => l.isBoosted))
      setRecentListings(mockListings)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch listings:', error)
      setLoading(false)
    }
  }

  const categories = [
    { name: 'Mobiles', icon: '📱', href: '/category/mobiles' },
    { name: 'Vehicles', icon: '🚗', href: '/category/vehicles' },
    { name: 'Electronics', icon: '💻', href: '/category/electronics' },
    { name: 'Real Estate', icon: '🏠', href: '/category/real-estate' },
    { name: 'Jobs', icon: '💼', href: '/category/jobs' },
    { name: 'Fashion', icon: '👔', href: '/category/fashion' },
    { name: 'Furniture', icon: '🛋️', href: '/category/furniture' },
    { name: 'More', icon: '➕', href: '/categories' }
  ]

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="container mx-auto px-4 py-4">
        <BannerCarousel />
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-3xl">{category.icon}</div>
              <span className="text-xs font-medium text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Sections */}
      <section className="container mx-auto px-4 py-6">
        <Tabs defaultValue="boosted" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="boosted" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Boosted Ads
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Posts
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="boosted" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Featured Listings</h2>
              <Link href="/listings?boosted=true">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)
                : boostedListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Latest Ads</h2>
              <Link href="/listings">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)
                : recentListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Trending Now</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)
                : recentListings.slice(0, 4).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-lg p-6 text-center">
          <Package className="h-12 w-12 mx-auto mb-3 text-primary" />
          <h3 className="text-xl font-bold mb-2">Have something to sell?</h3>
          <p className="text-muted-foreground mb-4">
            Post your ad in just a few minutes and reach millions of buyers
          </p>
          <Link href="/post">
            <Button size="lg">
              Post Your Ad for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
