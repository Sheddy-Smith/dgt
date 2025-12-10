'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, Heart, Share2, MessageCircle, Phone, MapPin, 
  Clock, Calendar, User, Shield, Star, ChevronLeft, ChevronRight,
  Maximize2, Lock, Unlock, AlertCircle, CheckCircle, ExternalLink,
  Flag, RefreshCw, Eye, EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: string
  location: string
  city: string
  posted_at: string
  images: string[]
  seller_name: string
  seller_type: 'individual' | 'dealer'
  seller_since: string
  is_verified: boolean
  is_featured: boolean
  expires_at?: string
  views: number
  contact_number?: string
  whatsapp_number?: string
}

interface SimilarListing {
  id: string
  title: string
  price: number
  location: string
  image: string
  is_verified: boolean
}

export default function ListingPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [similarListings, setSimilarListings] = useState<SimilarListing[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [userTokens, setUserTokens] = useState(5) // Mock user tokens
  const [showReportModal, setShowReportModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock listing data
  const mockListing: Listing = {
    id: params.id as string,
    title: 'Used Honda Activa 5G - Excellent Condition',
    description: `Selling my well-maintained Honda Activa 5G purchased in 2021. The scooter is in excellent condition with regular servicing done at authorized Honda service center.

Key Features:
- 2021 Model, Honda Activa 5G
- 110cc engine with excellent mileage (45-50 km/l)
- Single owner, driven approximately 8,000 km
- Regular service history available
- Insurance valid till March 2025
- PUC certificate valid
- Scratchless body, no accidents
- New battery installed 3 months ago
- Front disc brake for better safety
- Digital speedometer and fuel gauge

The scooter is perfect for daily commuting and is very fuel efficient. Selling because upgrading to a car. Price is slightly negotiable for serious buyers. All documents are clear and original.

Location: Near Vijay Nagar, Indore - Easy for test rides`,
    price: 45000,
    category: 'Scooters',
    condition: 'Used',
    location: 'Vijay Nagar',
    city: 'Indore',
    posted_at: '2 days ago',
    images: [
      'https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=800&h=600&fit=crop&auto=format&h=600',
      'https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=800&h=600&fit=crop&auto=format&w=600',
      'https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=800&h=600&fit=crop&auto=format&q=80'
    ],
    seller_name: 'Rajesh Kumar',
    seller_type: 'individual',
    seller_since: '2025',
    is_verified: true,
    is_featured: true,
    expires_at: null, // Verified listings don't expire
    views: 234,
    contact_number: '+919876543210',
    whatsapp_number: '+919876543210'
  }

  const mockSimilarListings: SimilarListing[] = [
    {
      id: '1',
      title: 'Honda Activa 6G 2022',
      price: 52000,
      location: 'Palasia',
      image: 'https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=300&h=200&fit=crop',
      is_verified: false
    },
    {
      id: '2',
      title: 'TVS Jupiter 2021',
      price: 38000,
      location: 'Bhawarkua',
      image: 'https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=300&h=200&fit=crop',
      is_verified: true
    },
    {
      id: '3',
      title: 'Hero Pleasure 2020',
      price: 28000,
      location: 'Geeta Bhavan',
      image: 'https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=300&h=200&fit=crop',
      is_verified: false
    }
  ]

  useEffect(() => {
    // Simulate loading listing data
    setTimeout(() => {
      setListing(mockListing)
      setSimilarListings(mockSimilarListings)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleSaveListing = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Removed from saved items' : 'Added to saved items')
  }

  const handleShareListing = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          text: `Check out this ${listing?.category} on DGT: ${listing?.title}`,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleUnlockContact = async () => {
    if (userTokens < 1) {
      toast.error('Insufficient tokens! Please purchase tokens to unlock contact.')
      return
    }

    setIsUnlocking(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setUserTokens(userTokens - 1)
      setIsUnlocked(true)
      toast.success('Contact unlocked successfully! 1 token deducted.')
      setShowContactModal(true)
    } catch (error) {
      toast.error('Failed to unlock contact. Please try again.')
    } finally {
      setIsUnlocking(false)
    }
  }

  const nextImage = () => {
    if (listing) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
    }
  }

  const prevImage = () => {
    if (listing) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length)
    }
  }

  const handleReportListing = (reason: string) => {
    toast.success('Report submitted successfully. We will review it.')
    setShowReportModal(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Listing Not Found</h2>
          <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="text-xl font-bold text-blue-600">DGT</div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveListing}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareListing}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Section */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={listing.images[currentImageIndex]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Navigation */}
                    {listing.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Expand Button */}
                    <button
                      onClick={() => setShowImageModal(true)}
                      className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {listing.is_verified && (
                        <Badge className="bg-blue-500 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {listing.is_featured && (
                        <Badge className="bg-yellow-500 text-white">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    {/* Image Counter */}
                    {listing.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {listing.images.length}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                {listing.images.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-blue-500 scale-105'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listing Details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {listing.title}
                    </h1>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatPrice(listing.price)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {listing.views} views
                      </div>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium">{listing.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Condition</div>
                      <div className="font-medium">{listing.condition}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {listing.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Posted</div>
                      <div className="font-medium flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {listing.posted_at}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <div className="text-gray-700 whitespace-pre-line">
                      {listing.description}
                    </div>
                  </div>

                  {/* Expiry Info */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      {listing.expires_at ? (
                        <>
                          <Clock className="w-5 h-5 text-blue-600 mr-2" />
                          <div>
                            <div className="font-medium text-blue-900">Listing Expires</div>
                            <div className="text-sm text-blue-700">
                              Expires in 28 days
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <div className="font-medium text-green-900">Verified Listing</div>
                            <div className="text-sm text-green-700">
                              Never expires • Trusted seller
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {listing.expires_at && (
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Renew (1 Token)
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Listings */}
            {similarListings.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Similar Listings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarListings.map((item) => (
                      <div
                        key={item.id}
                        className="flex space-x-4 p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => router.push(`/listing/${item.id}`)}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.title}
                          </h4>
                          <div className="text-lg font-bold text-blue-600">
                            {formatPrice(item.price)}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.location}
                            {item.is_verified && (
                              <Shield className="w-3 h-3 ml-2 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {listing.seller_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {listing.seller_type === 'dealer' ? 'Dealer' : 'Individual'} • {listing.city}
                        </div>
                        <div className="text-xs text-gray-400">
                          Member since {listing.seller_since}
                        </div>
                      </div>
                    </div>
                  </div>

                  {listing.is_verified && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <div className="font-medium text-green-900">Verified Seller</div>
                        <div className="text-sm text-green-700">
                          Identity verified by DGT
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Actions */}
                  <div className="space-y-3">
                    {isUnlocked ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center text-green-700 mb-2">
                            <Unlock className="w-5 h-5 mr-2" />
                            <span className="font-medium">Contact Unlocked</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">📱 Mobile:</span>
                              <span className="font-medium">{listing.contact_number}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">💬 WhatsApp:</span>
                              <span className="font-medium">{listing.whatsapp_number}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                        
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat on WhatsApp
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleUnlockContact}
                          disabled={isUnlocking}
                        >
                          {isUnlocking ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Unlock Contact (1 Token)
                            </>
                          )}
                        </Button>
                        
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat Now
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Token Balance */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Your Tokens:</span>
                      <span className="font-bold text-blue-900">{userTokens}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowReportModal(true)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report Listing
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShareListing}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Listing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Safety Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    Meet in a safe, public location
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    Inspect the item before purchase
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    Pay only after receiving the item
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    Never share financial information
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowReportModal(true)}
          >
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleShareListing}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          {isUnlocked ? (
            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          ) : (
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleUnlockContact}
              disabled={isUnlocking}
            >
              {isUnlocking ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Unlock
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <img
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            
            {/* Navigation */}
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnails */}
          {listing.images.length > 1 && (
            <div className="p-4 flex space-x-2 overflow-x-auto bg-gray-50">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-blue-500 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Why are you reporting this listing?
            </p>
            <div className="space-y-2">
              {[
                'Fake or Spam',
                'Inappropriate Content',
                'Misleading Information',
                'Already Sold',
                'Other'
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReportListing(reason)}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}