'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft, Share2, Heart, Flag, MapPin, Clock, Eye, 
  Phone, MessageCircle, ShieldCheck, Zap, Calendar, AlertCircle 
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDetails, setReportDetails] = useState('')

  // Mock listing data
  const listing = {
    id: params.id,
    title: 'iPhone 14 Pro Max 256GB Space Black',
    price: 95000,
    originalPrice: 125000,
    description: 'Excellent condition iPhone 14 Pro Max. Used for 6 months only. All accessories included. Box, charger, and earphones available. Battery health 98%. No scratches or dents. Reason for selling: Upgrading to new model.',
    images: ['/api/placeholder/800/600', '/api/placeholder/800/600', '/api/placeholder/800/600'],
    location: 'Connaught Place, Delhi',
    postedAt: '2025-12-08T10:00:00Z',
    expiresAt: '2026-01-07T10:00:00Z',
    views: 1245,
    isBoosted: true,
    isVerified: true,
    seller: {
      name: 'Rajesh Kumar',
      memberSince: '2023-05-15',
      totalAds: 24,
      isPowerSeller: true,
      isVerified: true
    },
    specs: {
      Brand: 'Apple',
      Model: 'iPhone 14 Pro Max',
      Storage: '256GB',
      Condition: 'Like New',
      Color: 'Space Black',
      Warranty: 'Under warranty until June 2024'
    }
  }

  const daysLeft = Math.ceil((new Date(listing.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysLeft <= 7

  const handleReport = () => {
    console.log('Reporting:', { reason: reportReason, details: reportDetails })
    setShowReportDialog(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this ${listing.title}`,
        url: window.location.href
      })
    }
  }

  return (
    <div className="pb-20 md:pb-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Image Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {listing.images.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="relative aspect-square md:aspect-video">
                <Image
                  src={img}
                  alt={`${listing.title} - Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <div className="container mx-auto px-4 py-4 max-w-4xl">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {listing.isBoosted && (
            <Badge className="bg-amber-500">
              <Zap className="h-3 w-3 mr-1" />
              Boosted
            </Badge>
          )}
          {listing.isVerified && (
            <Badge className="bg-green-500">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        {/* Title & Price */}
        <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold">₹{listing.price.toLocaleString()}</span>
          {listing.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              ₹{listing.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {listing.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Posted 2 days ago
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {listing.views} views
          </div>
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon && (
          <Card className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">
                    Ad expiring in {daysLeft} days
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-200">
                    Renew now to keep your ad active
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Renew Ad
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="font-semibold mb-4">Specifications</h2>
            <div className="space-y-3">
              {Object.entries(listing.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seller Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold">{listing.seller.name}</h2>
                  {listing.seller.isVerified && (
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  )}
                  {listing.seller.isPowerSeller && (
                    <Badge variant="secondary" className="text-xs">Power Seller</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(listing.seller.memberSince).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {listing.seller.totalAds} active ads
                </p>
              </div>
            </div>
            <Link href={`/profile/${listing.seller.name}`}>
              <Button variant="outline" className="w-full">
                View All Ads from Seller
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Report Button */}
        <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full text-destructive">
              <Flag className="h-4 w-4 mr-2" />
              Report this ad
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report Ad</DialogTitle>
              <DialogDescription>
                Help us understand what's wrong with this ad
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Select value={reportReason} onValueChange={setReportReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spam">Spam or Misleading</SelectItem>
                    <SelectItem value="fraud">Fraudulent</SelectItem>
                    <SelectItem value="duplicate">Duplicate Posting</SelectItem>
                    <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                    <SelectItem value="wrong-category">Wrong Category</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Additional Details</Label>
                <Textarea
                  placeholder="Provide more information..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowReportDialog(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleReport} disabled={!reportReason}>
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:hidden">
        <div className="flex gap-2">
          <Button className="flex-1" size="lg">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button className="flex-1" size="lg" variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
