'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Clock, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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

export function ListingCard({ listing }: { listing: Listing }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return 'Just now'
  }

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative aspect-4/3">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover"
          />
          {listing.isBoosted && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
              <Zap className="h-3 w-3 mr-1" />
              Boosted
            </Badge>
          )}
          {listing.isVerified && (
            <Badge className="absolute top-2 right-2 bg-green-600">
              Verified
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold">{formatPrice(listing.price)}</span>
            <Badge variant="outline" className="text-xs">
              {listing.category}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(listing.postedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-4/3 w-full" />
      <CardContent className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-24" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}
