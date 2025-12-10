'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, User, Menu, Heart, Star, Clock, Filter, ChevronDown, X, TrendingUp, Map, ChevronLeft, ChevronRight, Maximize2, Phone, MessageCircle, Share2, Calendar, Wallet, Coins, Lock, Unlock, Bell, Settings, Plus, Camera, Package, Tag, DollarSign, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

// Types
interface Listing {
  id: string
  title: string
  price: number
  location: string
  city: string
  posted_at: string
  images: string[]
  category: string
  is_verified: boolean
  is_featured: boolean
  seller_name: string
  seller_type: 'individual' | 'dealer'
  views: number
  description?: string
  listing_type: 'free' | 'token'
  expires_at?: string
}

interface Category {
  id: string
  name: string
  icon: string
  count: number
}

interface Location {
  city: string
  state: string
  lat: number
  lng: number
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'category' | 'location' | 'recent' | 'trending'
  category?: string
  count?: number
}

interface UserWallet {
  id: string
  userId: string
  tokens: number
  createdAt: string
  updatedAt: string
}

interface TokenBundle {
  id: string
  name: string
  price: number
  tokens: number
  freeTokens: number
  totalTokens: number
  isActive: boolean
}

interface UnlockStatus {
  isUnlocked: boolean
  unlock?: {
    contactNumber: string
    sellerName: string
    unlockedAt: string
  }
}

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Cars', icon: '🚗', count: 1250 },
  { id: '2', name: 'Bikes', icon: '🏍️', count: 890 },
  { id: '3', name: 'Mobiles', icon: '📱', count: 2100 },
  { id: '4', name: 'Furniture', icon: '🛋️', count: 650 },
  { id: '5', name: 'Properties', icon: '🏠', count: 430 },
  // { id: '6', name: 'Jobs', icon: '💼', count: 320 },
  // { id: '7', name: 'Services', icon: '🔧', count: 180 },
  // { id: '8', name: 'Pets', icon: '🐕', count: 95 },
  { id: '9', name: 'Fashion', icon: '👕', count: 780 }
]

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Damaged iPhone 13 Pro - Cracked Screen',
    price: 28000,
    location: 'Vijay Nagar',
    city: 'Indore',
    posted_at: '2 hours ago',
    images: [
      'https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/8000621/pexels-photo-8000621.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/7241413/pexels-photo-7241413.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    ],
    category: 'Mobiles',
    is_verified: true,
    is_featured: true,
    seller_name: 'Rahul Sharma',
    seller_type: 'individual',
    views: 234,
    description: 'iPhone 13 Pro 256GB with cracked screen. Everything else working perfectly. Touch responsive, Face ID works, battery health 89%. Easy repair - display replacement only.',
    listing_type: 'token',
    expires_at: undefined
  },
  {
    id: '2',
    title: 'Damaged Car - Front Bumper Damage',
    price: 185000,
    location: 'Palasia',
    city: 'Indore',
    posted_at: '5 hours ago',
    images: [
      'https://images.pexels.com/photos/9834048/pexels-photo-9834048.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/10042666/pexels-photo-10042666.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/13861487/pexels-photo-13861487.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    ],
    category: 'Cars',
    is_verified: false,
    is_featured: false,
    seller_name: 'Auto World',
    seller_type: 'dealer',
    views: 567,
    description: 'Maruti Swift 2019 with front bumper damage from parking mishap. Engine perfect, all documents clear. AC, music system working. Minor repair needed.',
    listing_type: 'free',
    expires_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    title: 'HP LaserJet Printer - Paper Jam Issue',
    price: 3500,
    location: 'Bhawarkua',
    city: 'Indore',
    posted_at: '1 day ago',
    images: [
      'https://images.pexels.com/photos/4622188/pexels-photo-4622188.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/5668838/pexels-photo-5668838.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/4621967/pexels-photo-4621967.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    ],
    category: 'Electronics',
    is_verified: true,
    is_featured: false,
    seller_name: 'Office Solutions',
    seller_type: 'dealer',
    views: 123,
    description: 'HP LaserJet Pro M402dn - Has recurring paper jam issue. Prints fine when it works. Sold as-is for parts or repair. Network printing functional.',
    listing_type: 'token',
    expires_at: undefined
  },
  {
    id: '4',
    title: 'Damaged Laptop - Screen Hinge Broken',
    price: 15000,
    location: 'Sapna Sangeeta',
    city: 'Indore',
    posted_at: '3 days ago',
    images: [
      'https://images.pexels.com/photos/7339012/pexels-photo-7339012.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/5238645/pexels-photo-5238645.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/4195504/pexels-photo-4195504.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    ],
    category: 'Electronics',
    is_verified: true,
    is_featured: true,
    seller_name: 'Tech Repairs',
    seller_type: 'dealer',
    views: 890,
    description: 'Dell Inspiron 15 (2020) - Broken screen hinge. Display works perfectly with external monitor. Core i5, 8GB RAM, 256GB SSD. Great for desktop replacement or repair.',
    listing_type: 'token',
    expires_at: undefined
  },
  {
    id: '5',
    title: 'Water Damaged Washing Machine',
    price: 4500,
    location: 'Annapurna',
    city: 'Indore',
    posted_at: '1 week ago',
    images: [
      'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    ],
    category: 'Electronics',
    is_verified: false,
    is_featured: false,
    seller_name: 'Priya Patel',
    seller_type: 'individual',
    views: 45,
    description: 'LG 6.5kg fully automatic washing machine. Water leaked from bottom during last use. Drum and motor seem fine. Selling for parts or repair.',
    listing_type: 'free',
    expires_at: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '6',
    title: 'Damaged Refrigerator - Cooling Issue',
    price: 5800,
    location: 'Vijay Nagar',
    city: 'Indore',
    posted_at: '2 days ago',
    images: [
      'https://images.pexels.com/photos/2343467/pexels-photo-2343467.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/4113703/pexels-photo-4113703.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    ],
    category: 'Electronics',
    is_verified: true,
    is_featured: false,
    seller_name: 'Appliance Hub',
    seller_type: 'dealer',
    views: 178,
    description: 'Samsung 265L double door fridge. Compressor runs but not cooling properly. Gas refill or compressor replacement may fix it. Body in good condition.',
    listing_type: 'token',
    expires_at: undefined
  },
  {
    id: '7',
    title: 'Accident Damaged Motorcycle - Salvage',
    price: 22000,
    location: 'Rau',
    city: 'Indore',
    posted_at: '4 days ago',
    images: [
      'https://images.pexels.com/photos/4488662/pexels-photo-4488662.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/13861669/pexels-photo-13861669.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/7675408/pexels-photo-7675408.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    ],
    category: 'Bikes',
    is_verified: true,
    is_featured: true,
    seller_name: 'Bike Salvage',
    seller_type: 'dealer',
    views: 456,
    description: 'Bajaj Pulsar 220F accident damaged. Engine and gearbox intact and working. Frame bent, fuel tank dented. Good for parts or restoration project.',
    listing_type: 'token',
    expires_at: undefined
  },
  {
    id: '8',
    title: 'Broken Gaming Console - PS4 HDMI Port',
    price: 8500,
    location: 'Palasia',
    city: 'Indore',
    posted_at: '3 hours ago',
    images: [
      'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      'https://images.pexels.com/photos/4219861/pexels-photo-4219861.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
    ],
    category: 'Electronics',
    is_verified: false,
    is_featured: false,
    seller_name: 'Gaming Store',
    seller_type: 'dealer',
    views: 289,
    description: 'PlayStation 4 500GB with damaged HDMI port. Powers on, all functions work. HDMI port repair needed for display output. 2 controllers included.',
    listing_type: 'free',
    expires_at: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString()
  }
]

const mockLocations: Location[] = [
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 }
]

const mockSearchSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'Damaged iPhone', type: 'category', category: 'Mobiles', count: 234 },
  { id: '2', text: 'Cracked Screen Phone', type: 'category', category: 'Mobiles', count: 567 },
  { id: '3', text: 'Broken Laptop', type: 'category', category: 'Electronics', count: 123 },
  { id: '4', text: 'Accident Car', type: 'category', category: 'Cars', count: 89 },
  { id: '5', text: 'Indore', type: 'location', count: 1250 },
  { id: '6', text: 'Bhopal', type: 'location', count: 890 },
  { id: '7', text: 'Water damaged electronics', type: 'trending', count: 456 },
  { id: '8', text: 'Salvage bikes', type: 'trending', count: 789 },
  { id: '9', text: 'Faulty appliances', type: 'trending', count: 234 },
  { id: '10', text: 'Damaged printer', type: 'recent', count: 0 },
  { id: '11', text: 'Broken refrigerator', type: 'recent', count: 0 },
  { id: '12', text: 'Gaming console repair', type: 'recent', count: 0 }
]

const mockTokenBundles: TokenBundle[] = [
  { id: '1', name: 'Starter Pack', price: 50, tokens: 5, freeTokens: 1, totalTokens: 6, isActive: true },
  { id: '2', name: 'Value Pack', price: 100, tokens: 10, freeTokens: 3, totalTokens: 13, isActive: true },
  { id: '3', name: 'Premium Pack', price: 150, tokens: 15, freeTokens: 4, totalTokens: 19, isActive: true },
  { id: '4', name: 'Super Saver', price: 200, tokens: 20, freeTokens: 6, totalTokens: 26, isActive: true }
]

import { getCurrentUser, onAuthChange, logout as authLogout } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<Location>(mockLocations[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchInputRef = useRef<HTMLDivElement>(null)
  
  // Modal and image slider states
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [showListingModal, setShowListingModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [cardImageIndexes, setCardImageIndexes] = useState<Record<string, number>>({})
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  // Token system states
  const [currentUser, setCurrentUser] = useState<{ id: string; mobile: string; name?: string } | null>(null)
  const [userWallet, setUserWallet] = useState<UserWallet | null>(null)
  const [tokenBundles, setTokenBundles] = useState<TokenBundle[]>([])
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showTokenPurchaseModal, setShowTokenPurchaseModal] = useState(false)
  const [unlockedContacts, setUnlockedContacts] = useState<Set<string>>(new Set())
  const [isProcessingUnlock, setIsProcessingUnlock] = useState<string | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  
  // Notification states
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'contact_unlock',
      title: 'Contact Unlocked',
      message: 'Someone unlocked your contact for iPhone 12 Pro listing',
      time: '2 hours ago',
      read: false,
      icon: '📞'
    },
    {
      id: '2',
      type: 'listing_view',
      title: 'New View',
      message: 'Your Royal Enfield listing got 5 new views',
      time: '5 hours ago',
      read: false,
      icon: '👁️'
    },
    {
      id: '3',
      type: 'token_purchase',
      title: 'Tokens Purchased',
      message: 'You successfully purchased 13 tokens',
      time: '1 day ago',
      read: true,
      icon: '🪙'
    },
    {
      id: '4',
      type: 'listing_sold',
      title: 'Item Sold',
      message: 'Your Sofa Set listing has been marked as sold',
      time: '2 days ago',
      read: true,
      icon: '✅'
    }
  ])
  
  // Listing form states
  const [showListingForm, setShowListingForm] = useState(false)
  const [listingForm, setListingForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    condition: 'damaged',
    images: [] as File[]
  })
  const [isSubmittingListing, setIsSubmittingListing] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Check authentication status on mount
  useEffect(() => {
    let unsub = () => {}
    const check = async () => {
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser({ id: user.id, mobile: user.phone || user.mobile || '', name: user.name })
        setUserWallet({
          id: `wallet-${user.id}`,
          userId: user.id,
          tokens: user.tokens ?? 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      } else {
        setCurrentUser(null)
        setUserWallet(null)
      }
      setTokenBundles(mockTokenBundles)
    }
    check()
    unsub = onAuthChange(check)
    return () => unsub()
  }, [])

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('dgt-recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Handle click outside to close search suggestions and dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false)
      }
      
      // Close profile menu when clicking outside
      const profileMenu = document.getElementById('profile-menu')
      if (profileMenu && !profileMenu.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
      
      // Close notifications dropdown when clicking outside
      const notificationDropdown = document.getElementById('notification-dropdown')
      if (notificationDropdown && !notificationDropdown.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle logout
  const handleLogout = async () => {
    await authLogout()
    setCurrentUser(null)
    setUserWallet(null)
    setUnlockedContacts(new Set())
    setShowProfileMenu(false)
    toast.success('Logged out successfully')
    router.replace('/login')
  }

  // Notification handlers
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    toast.success('All notifications marked as read')
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setShowNotifications(false)
    toast.success('All notifications cleared')
  }

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length
  }

  useEffect(() => {
    // Filter search suggestions based on query
    if (searchQuery.length > 0) {
      const filtered = mockSearchSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchSuggestions(filtered)
      setShowSearchSuggestions(true)
    } else {
      setSearchSuggestions([])
      setShowSearchSuggestions(false)
    }
  }, [searchQuery])

  useEffect(() => {
    // Simulate location detection
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location detected:', position.coords)
        },
        (error) => {
          console.log('Location detection failed:', error)
        }
      )
    }
  }, [])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem('dgt-recent-searches', JSON.stringify(newRecentSearches))
      
      setSearchQuery(query)
      setShowSearchSuggestions(false)
      toast.success(`Searching for "${query}"`)
      // In real app, this would trigger API call
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('dgt-recent-searches')
    toast.success('Recent searches cleared')
  }

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location)
    setShowLocationModal(false)
    toast.success(`Location changed to ${location.city}`)
    // In real app, this would trigger a new API call
  }

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to category page
    router.push(`/category/${encodeURIComponent(categoryName)}`)
  }

  const handleSaveListing = (listingId: string) => {
    setSavedListings(prev => {
      const newSet = new Set(prev)
      if (newSet.has(listingId)) {
        newSet.delete(listingId)
        toast.success('Removed from saved items')
      } else {
        newSet.add(listingId)
        toast.success('Added to saved items')
      }
      return newSet
    })
  }

  // Token system functions
  const handleUnlockContact = async (listingId: string) => {
    if (!currentUser) {
      toast.error('Please login to unlock contact')
      return
    }
    
    if (!userWallet || userWallet.tokens < 1) {
      toast.error('Insufficient tokens! Please purchase tokens to unlock contact')
      setShowTokenPurchaseModal(true)
      return
    }
    
    setIsProcessingUnlock(listingId)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if already unlocked
      if (unlockedContacts.has(listingId)) {
        toast.success('Contact already unlocked')
        setIsProcessingUnlock(null)
        return
      }
      
      // Deduct token and unlock contact
      setUserWallet(prev => prev ? { ...prev, tokens: prev.tokens - 1 } : null)
      setUnlockedContacts(prev => new Set([...prev, listingId]))
      
      toast.success('Contact unlocked successfully! 1 token deducted')
    } catch (error) {
      toast.error('Failed to unlock contact. Please try again.')
    } finally {
      setIsProcessingUnlock(null)
    }
  }

  const handlePurchaseTokens = async (bundle: TokenBundle) => {
    if (!currentUser) {
      toast.error('Please login to purchase tokens')
      return
    }
    
    try {
      // Simulate payment processing
      toast.loading('Processing payment...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add tokens to wallet
      setUserWallet(prev => prev ? { 
        ...prev, 
        tokens: prev.tokens + bundle.totalTokens 
      } : null)
      
      toast.success(`Successfully purchased ${bundle.totalTokens} tokens for ₹${bundle.price}!`)
      setShowTokenPurchaseModal(false)
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    }
  }

  const handleVerifyListing = async (listingId: string) => {
    if (!currentUser) {
      toast.error('Please login to verify listing')
      return
    }
    
    if (!userWallet || userWallet.tokens < 1) {
      toast.error('Insufficient tokens! Please purchase tokens to verify listing')
      setShowTokenPurchaseModal(true)
      return
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Deduct token and mark as verified
      setUserWallet(prev => prev ? { ...prev, tokens: prev.tokens - 1 } : null)
      setListings(prev => prev.map(listing => 
        listing.id === listingId 
          ? { ...listing, is_verified: true }
          : listing
      ))
      
      toast.success('Listing verified successfully! 1 token deducted')
    } catch (error) {
      toast.error('Failed to verify listing. Please try again.')
    }
  }

  // Listing form handlers
  const handleListingFormChange = (field: string, value: string | File[]) => {
    setListingForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setListingForm(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5) // Max 5 images
    }))
  }

  const removeImage = (index: number) => {
    setListingForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      toast.error('Please login to post a listing')
      return
    }
    
    // Validate form
    if (!listingForm.title.trim() || !listingForm.price || !listingForm.category || !listingForm.location.trim()) {
      toast.error('Please fill all required fields')
      return
    }
    
    setIsSubmittingListing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create new listing
      const newListing: Listing = {
        id: Date.now().toString(),
        title: listingForm.title,
        price: parseInt(listingForm.price),
        location: listingForm.location,
        city: listingForm.location,
        posted_at: 'Just now',
        images: listingForm.images.length > 0 
          ? listingForm.images.map(() => 'https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=600&h=400&fit=crop')
          : ['https://images.unsplash.com/photo-1558980664-1e5d2d43b42d?w=600&h=400&fit=crop'],
        category: listingForm.category,
        is_verified: false,
        is_featured: false,
        seller_name: currentUser.name || 'User',
        seller_type: 'individual',
        views: 0,
        description: listingForm.description,
        listing_type: 'free',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      // Add to listings
      setListings(prev => [newListing, ...prev])
      
      // Reset form
      setListingForm({
        title: '',
        description: '',
        price: '',
        category: '',
        location: '',
        condition: 'damaged',
        images: [] as File[]
      })
      
      setShowListingForm(false)
      toast.success('Listing posted successfully!')
    } catch (error) {
      toast.error('Failed to post listing. Please try again.')
    } finally {
      setIsSubmittingListing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatTimeAgo = (postedAt: string) => {
    return postedAt
  }

  const calculateDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Image slider functions for cards
  const nextCardImage = (listingId: string, totalImages: number) => {
    setCardImageIndexes(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % totalImages
    }))
  }

  const prevCardImage = (listingId: string, totalImages: number) => {
    setCardImageIndexes(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + totalImages) % totalImages
    }))
  }

  // Modal functions
  const openListingModal = (listing: Listing) => {
    setSelectedListing(listing)
    setShowListingModal(true)
    setCurrentImageIndex(0)
    // Increment view count
    setListings(prev => prev.map(l =>
      l.id === listing.id ? { ...l, views: l.views + 1 } : l
    ))
  }

  const closeListingModal = () => {
    setShowListingModal(false)
    setSelectedListing(null)
    setCurrentImageIndex(0)
  }

  const nextModalImage = () => {
    if (selectedListing) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedListing.images.length)
    }
  }

  const prevModalImage = () => {
    if (selectedListing) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedListing.images.length) % selectedListing.images.length)
    }
  }

  const selectModalImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showListingModal) {
        if (e.key === 'Escape') closeListingModal()
        if (e.key === 'ArrowRight') nextModalImage()
        if (e.key === 'ArrowLeft') prevModalImage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showListingModal, selectedListing])

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEndCard = (listingId: string, totalImages: number) => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextCardImage(listingId, totalImages)
    }
    if (isRightSwipe) {
      prevCardImage(listingId, totalImages)
    }
  }

  const onTouchEndModal = () => {
    if (!touchStart || !touchEnd || !selectedListing) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextModalImage()
    }
    if (isRightSwipe) {
      prevModalImage()
    }
  }

  const SearchComponent = () => (
    <div className="relative w-full" ref={searchInputRef}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      <Input
        type="text"
        placeholder="Find Cars, Mobile Phones and more..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(searchQuery)
          } else if (e.key === 'Escape') {
            setShowSearchSuggestions(false)
          }
        }}
        onFocus={() => {
          if (searchQuery.length === 0 && recentSearches.length > 0) {
            setShowSearchSuggestions(true)
          }
        }}
        className="pl-10 pr-4 w-full"
      />
      
      {/* Search Suggestions Dropdown */}
      {showSearchSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {searchQuery.length === 0 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-600">
                <span>Recent Searches</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-blue-600 hover:text-blue-700 text-xs"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center"
                >
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Filtered Suggestions */}
          {searchQuery.length > 0 && (
            <div className="p-2">
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {suggestion.type === 'category' && <div className="w-4 h-4 mr-2">📁</div>}
                      {suggestion.type === 'location' && <MapPin className="w-4 h-4 mr-2 text-gray-400" />}
                      {suggestion.type === 'trending' && <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />}
                      {suggestion.type === 'recent' && <Clock className="w-4 h-4 mr-2 text-gray-400" />}
                      <div>
                        <div>{suggestion.text}</div>
                        {suggestion.category && (
                          <div className="text-xs text-gray-500">in {suggestion.category}</div>
                        )}
                      </div>
                    </div>
                    {suggestion.count !== undefined && suggestion.count > 0 && (
                      <div className="text-xs text-gray-500">{suggestion.count} results</div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No suggestions found
                </div>
              )}
            </div>
          )}
          
          {/* Trending Searches */}
          {searchQuery.length === 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-3 py-2 text-sm text-gray-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending Searches
              </div>
              {mockSearchSuggestions
                .filter(s => s.type === 'trending')
                .slice(0, 3)
                .map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{suggestion.text}</span>
                    </div>
                    <div className="text-xs text-gray-500">{suggestion.count} searches</div>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )

  const ListingCard = ({ listing }: { listing: Listing }) => {
    const currentImageIndex = cardImageIndexes[listing.id] || 0
    
    return (
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden"
                 onTouchStart={onTouchStart}
                 onTouchMove={onTouchMove}
                 onTouchEnd={() => onTouchEndCard(listing.id, listing.images.length)}>
              <img 
                src={listing.images[currentImageIndex]} 
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onClick={() => openListingModal(listing)}
              />
              
              {/* Image Navigation Arrows */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      prevCardImage(listing.id, listing.images.length)
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-md transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      nextCardImage(listing.id, listing.images.length)
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow-md transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              
              {/* Image Indicators */}
              {listing.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {listing.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <div className="flex gap-1">
                {listing.is_featured && (
                  <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                )}
                {listing.listing_type === 'token' && (
                  <Badge className="bg-green-500 text-white text-xs flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Token Verified
                  </Badge>
                )}
              </div>
              {listing.listing_type === 'free' && listing.expires_at && (
                <Badge className="bg-orange-500 text-white text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires in {calculateDaysRemaining(listing.expires_at)} days
                </Badge>
              )}
            </div>
            
            {/* Save button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSaveListing(listing.id)
              }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <Heart 
                className={`w-4 h-4 ${savedListings.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
            
            {/* Expand button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                openListingModal(listing)
              }}
              className="absolute bottom-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Maximize2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>
          
          <div className="p-4" onClick={() => openListingModal(listing)}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {listing.title}
              </h3>
            </div>
            
            <div className="text-xl font-bold text-gray-900 mb-2">
              {formatPrice(listing.price)}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{listing.location}, {listing.city}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{formatTimeAgo(listing.posted_at)}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">•</span>
                <span>{listing.views} views</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      {listing.seller_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {listing.seller_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {listing.seller_type === 'dealer' ? 'Dealer' : 'Individual'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Animated Neon DGT Home Button */}
            <div className="flex items-center">
              <button
                onClick={() => window.location.href = '/'}
                className="group relative flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
              >
                {/* Neon Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-60 group-hover:opacity-80 animate-pulse"></div>
                
                {/* DGT Text */}
                <div className="relative text-2xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                    🛒 DGT
                  </span>
                  {/* Additional Glow Layer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent blur-sm animate-pulse opacity-80"></div>
                </div>
                
                {/* Home Indicator */}
                <div className="relative">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </div>
              </button>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <SearchComponent />
            </div>

            {/* Location Selector */}
            <div className="flex items-center space-x-4">
              <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {selectedLocation.city}, {selectedLocation.state}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Your Location</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {mockLocations.map((location) => (
                      <button
                        key={location.city}
                        onClick={() => handleLocationChange(location)}
                        className={`p-3 text-left rounded-lg border transition-colors ${
                          selectedLocation.city === location.city
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="font-medium">{location.city}</div>
                        <div className="text-sm text-gray-500">{location.state}</div>
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Wallet Button */}
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-3"
                onClick={() => setShowWalletModal(true)}
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {userWallet?.tokens || 0} <Coins className="w-3 h-3 inline" />
                </span>
              </Button>

              {/* Notifications */}
              <div className="relative" id="notification-dropdown">
                <Button 
                  variant="outline" 
                  size="icon"
                  className={`
                    relative transition-all duration-200
                    ${isMobile ? 'w-9 h-9' : 'w-10 h-10'}
                    ${showNotifications ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                  `}
                  onClick={() => {
                    if (currentUser) {
                      setShowNotifications(!showNotifications)
                      setShowProfileMenu(false) // Close profile menu if open
                    } else {
                      toast.error('Please login to view notifications')
                    }
                  }}
                >
                  <Bell className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  {currentUser && getUnreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && currentUser && (
                  <div className={`
                    absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50
                    ${isMobile ? 'w-80 max-h-96' : 'w-96 max-h-96'}
                  `}>
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <div className="flex items-center gap-2">
                        {getUnreadCount() > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={clearAllNotifications}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`
                              px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors
                              ${!notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                            `}
                            onClick={() => {
                              markNotificationAsRead(notification.id)
                              // Handle notification click based on type
                              switch (notification.type) {
                                case 'contact_unlock':
                                  toast.info('View your listing details')
                                  break
                                case 'listing_view':
                                  toast.info('Check your listing analytics')
                                  break
                                case 'token_purchase':
                                  setShowWalletModal(true)
                                  break
                                case 'listing_sold':
                                  toast.info('Congratulations on your sale!')
                                  break
                                default:
                                  break
                              }
                              setShowNotifications(false)
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-2xl flex-shrink-0">
                                {notification.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className={`
                                    text-sm font-medium text-gray-900 truncate
                                    ${!notification.read ? 'font-semibold' : ''}
                                  `}>
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button
                          onClick={() => {
                            toast.info('View all notifications in settings')
                            setShowNotifications(false)
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Profile/Login */}
              {currentUser ? (
                <div className="relative" id="profile-menu">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="relative"
                  >
                    <User className="w-5 h-5" />
                    <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  </Button>
                  
                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.mobile}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {userWallet?.tokens || 0} tokens available
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          setShowWalletModal(true)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        My Wallet
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          router.push('/listings')
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        My Listings
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false)
                          router.push('/profile')
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </button>
                      
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => router.push('/login')}
                >
                  <User className="w-5 h-5" />
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <div className="flex items-center justify-center py-4">
                      {/* Animated DGT Logo in Mobile Menu */}
                      <div className="relative">
                        {/* Neon Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur-lg opacity-60 animate-pulse"></div>
                        
                        {/* DGT Text */}
                        <div className="relative text-3xl font-bold">
                          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                            🛒 DGT
                          </span>
                          {/* Additional Glow Layer */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent blur-sm animate-pulse opacity-80"></div>
                        </div>
                      </div>
                    </div>
                    <SheetTitle className="text-center">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <SearchComponent />
                    <Button 
                      className="w-full"
                      onClick={() => router.push('/login')}
                    >
                      Login / Sign Up
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Category Shortcut Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-900">Categories</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {mockCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === category.name
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="text-lg">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{category.count}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              Find something great in {selectedLocation.city}
            </h1>
            <p className="text-blue-100 mb-4">
              Discover amazing deals from sellers near you
            </p>
            <Button 
              variant="secondary" 
              onClick={() => setShowLocationModal(true)}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Change Location
            </Button>
          </div>
        </div>
      </section>

      {/* Main Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Featured Ads Near You
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.filter(listing => listing.is_featured).map((listing) => (
              <Card key={listing.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  {/* Image Section */}
                  <div className="relative">
                    <div 
                      className="aspect-video bg-gray-100 overflow-hidden cursor-pointer"
                      onClick={() => openListingModal(listing)}
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={() => onTouchEndCard(listing.id, listing.images.length)}
                    >
                      <img
                        src={listing.images[cardImageIndexes[listing.id] || 0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      
                      {/* Image Navigation */}
                      {listing.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              prevCardImage(listing.id, listing.images.length)
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              nextCardImage(listing.id, listing.images.length)
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {/* Expand Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openListingModal(listing)
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <div className="flex gap-1">
                          {listing.is_featured && (
                            <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                          )}
                          {listing.listing_type === 'token' && (
                            <Badge className="bg-green-500 text-white text-xs flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Token Verified
                            </Badge>
                          )}
                        </div>
                        {listing.listing_type === 'free' && listing.expires_at && (
                          <Badge className="bg-orange-500 text-white text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires in {calculateDaysRemaining(listing.expires_at)} days
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {listing.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveListing(listing.id)
                        }}
                        className="flex-shrink-0"
                      >
                        <Heart className={`w-4 h-4 ${savedListings.has(listing.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                    
                    <div className="text-lg font-bold text-blue-600 mb-2">
                      {formatPrice(listing.price)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.location}, {listing.city}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(listing.posted_at)}
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {listing.seller_type}
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {unlockedContacts.has(listing.id) ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">
                              ✅ Contact Unlocked
                            </span>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Phone className="w-3 h-3 mr-1" />
                              Call Now
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600">
                            📱 {listing.seller_name}: +91 XXXXXXXXXX
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleUnlockContact(listing.id)}
                          disabled={isProcessingUnlock === listing.id}
                        >
                          {isProcessingUnlock === listing.id ? (
                            <>
                              <div className="w-3 h-3 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-2" />
                              Unlock Contact (1 Token)
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">All Listings</h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  {/* Image Section */}
                  <div className="relative">
                    <div 
                      className="aspect-video bg-gray-100 overflow-hidden cursor-pointer"
                      onClick={() => openListingModal(listing)}
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={() => onTouchEndCard(listing.id, listing.images.length)}
                    >
                      <img
                        src={listing.images[cardImageIndexes[listing.id] || 0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      
                      {/* Image Navigation */}
                      {listing.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              prevCardImage(listing.id, listing.images.length)
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              nextCardImage(listing.id, listing.images.length)
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {/* Expand Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openListingModal(listing)
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <div className="flex gap-1">
                          {listing.is_featured && (
                            <Badge className="bg-yellow-500 text-white text-xs">Featured</Badge>
                          )}
                          {listing.listing_type === 'token' && (
                            <Badge className="bg-green-500 text-white text-xs flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Token Verified
                            </Badge>
                          )}
                        </div>
                        {listing.listing_type === 'free' && listing.expires_at && (
                          <Badge className="bg-orange-500 text-white text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires in {calculateDaysRemaining(listing.expires_at)} days
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {listing.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveListing(listing.id)
                        }}
                        className="flex-shrink-0"
                      >
                        <Heart className={`w-4 h-4 ${savedListings.has(listing.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                    
                    <div className="text-lg font-bold text-blue-600 mb-2">
                      {formatPrice(listing.price)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.location}, {listing.city}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(listing.posted_at)}
                      </div>
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {listing.seller_type}
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {unlockedContacts.has(listing.id) ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">
                              ✅ Contact Unlocked
                            </span>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Phone className="w-3 h-3 mr-1" />
                              Call Now
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600">
                            📱 {listing.seller_name}: +91 XXXXXXXXXX
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleUnlockContact(listing.id)}
                          disabled={isProcessingUnlock === listing.id}
                        >
                          {isProcessingUnlock === listing.id ? (
                            <>
                              <div className="w-3 h-3 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-2" />
                              Unlock Contact (1 Token)
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Main Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Featured Ads Near You
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings
              .filter(listing => listing.is_featured)
              .map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
          </div>
        </section>

        {/* All Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Listings in {selectedLocation.city}
            </h2>
            <div className="flex items-center space-x-2">
              <Select defaultValue="recent">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => setIsLoading(true)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        </section>
      </main>

      {/* Floating Sell Button */}
      <button 
        onClick={() => {
          if (currentUser) {
            setShowListingForm(true)
          } else {
            toast.error('Please login to post a listing')
            window.location.href = '/auth'
          }
        }}
        className={`
          fixed bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center z-30
          ${isMobile 
            ? 'bottom-20 right-4 w-12 h-12 text-lg' 
            : 'bottom-6 right-6 w-14 h-14 text-xl hover:scale-110'
          }
        `}
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* Listing Form Dialog */}
      <Dialog open={showListingForm} onOpenChange={setShowListingForm}>
        <DialogContent className={isMobile ? "w-full max-w-lg mx-4" : "max-w-2xl"}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Post New Listing
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleListingSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                value={listingForm.title}
                onChange={(e) => handleListingFormChange('title', e.target.value)}
                placeholder="e.g., iPhone 12 Pro - Screen Damaged"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                value={listingForm.description}
                onChange={(e) => handleListingFormChange('description', e.target.value)}
                placeholder="Describe the condition, what's working, what's not..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <Input
                  type="number"
                  value={listingForm.price}
                  onChange={(e) => handleListingFormChange('price', e.target.value)}
                  placeholder="5000"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Select 
                  value={listingForm.category} 
                  onValueChange={(value) => handleListingFormChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <Input
                value={listingForm.location}
                onChange={(e) => handleListingFormChange('location', e.target.value)}
                placeholder="e.g., Indore, Vijay Nagar"
                required
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <Select 
                value={listingForm.condition} 
                onValueChange={(value) => handleListingFormChange('condition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">🔧 Damaged</SelectItem>
                  <SelectItem value="used">📦 Used</SelectItem>
                  <SelectItem value="repairable">🔨 Repairable</SelectItem>
                  <SelectItem value="parts">⚙️ For Parts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Max 5)
              </label>
              <div className="space-y-3">
                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload images
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG up to 10MB each
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {listingForm.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {listingForm.images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowListingForm(false)}
                className="flex-1"
                disabled={isSubmittingListing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmittingListing}
              >
                {isSubmittingListing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Posting...
                  </div>
                ) : (
                  'Post Listing'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation - Mobile */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="grid grid-cols-5 py-2">
            <button className="flex flex-col items-center py-2 text-blue-600">
              <div className="text-xl mb-1">🏠</div>
              <div className="text-xs">Home</div>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-600">
              <div className="text-xl mb-1">🔍</div>
              <div className="text-xs">Search</div>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-600">
              <div className="text-xl mb-1">➕</div>
              <div className="text-xs">Sell</div>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-600">
              <div className="text-xl mb-1">💬</div>
              <div className="text-xs">Chats</div>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-600">
              <div className="text-xl mb-1">👤</div>
              <div className="text-xs">Profile</div>
            </button>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              My Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Current Balance */}
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {userWallet?.tokens || 0}
              </div>
              <div className="text-sm text-blue-600">Available Tokens</div>
              <div className="text-xs text-blue-500 mt-1">
                1 Token = 1 Contact Unlock
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => {
                  setShowWalletModal(false)
                  setShowTokenPurchaseModal(true)
                }}
              >
                <Coins className="w-4 h-4 mr-2" />
                Purchase More Tokens
              </Button>
              
              <Button variant="outline" className="w-full">
                Transaction History
              </Button>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Tokens are valid for 12 months</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>No refunds for unused tokens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Use tokens to unlock seller contacts</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Token Purchase Modal */}
      <Dialog open={showTokenPurchaseModal} onOpenChange={setShowTokenPurchaseModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Purchase Tokens
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Current Balance */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Current Balance:</span>
              <span className="font-semibold">{userWallet?.tokens || 0} Tokens</span>
            </div>

            {/* Token Bundles */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Choose Token Package</h3>
              {tokenBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => handlePurchaseTokens(bundle)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{bundle.name}</div>
                      <div className="text-sm text-gray-600">
                        {bundle.tokens} Tokens
                        {bundle.freeTokens > 0 && (
                          <span className="text-green-600 font-medium">
                            +{bundle.freeTokens} Free
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        ₹{bundle.price}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: {bundle.totalTokens} Tokens
                      </div>
                    </div>
                  </div>
                  
                  {bundle.freeTokens > 0 && (
                    <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                      Save {Math.round((bundle.freeTokens / bundle.totalTokens) * 100)}%
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Payment Info */}
            <div className="text-sm text-gray-600 space-y-2 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Secure payment via Razorpay</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Tokens added instantly after payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>No hidden charges</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Listing Detail Modal */}
      {showListingModal && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedListing.title}
              </h2>
              <button
                onClick={closeListingModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Image Gallery */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
                       onTouchStart={onTouchStart}
                       onTouchMove={onTouchMove}
                       onTouchEnd={onTouchEndModal}>
                    <img
                      src={selectedListing.images[currentImageIndex]}
                      alt={`${selectedListing.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Navigation Arrows */}
                    {selectedListing.images.length > 1 && (
                      <>
                        <button
                          onClick={prevModalImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextModalImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    {selectedListing.images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedListing.images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {selectedListing.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedListing.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => selectModalImage(index)}
                          className={`aspect-video bg-gray-100 rounded overflow-hidden border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-blue-500 scale-105'
                              : 'border-transparent hover:border-gray-300'
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
                </div>

                {/* Listing Details */}
                <div className="space-y-6">
                  {/* Price and Badges */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(selectedListing.price)}
                      </span>
                      {selectedListing.is_featured && (
                        <Badge className="bg-yellow-500 text-white">Featured</Badge>
                      )}
                      {selectedListing.listing_type === 'token' && (
                        <Badge className="bg-green-500 text-white flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Token Verified - No Expiry
                        </Badge>
                      )}
                      {selectedListing.listing_type === 'free' && selectedListing.expires_at && (
                        <Badge className="bg-orange-500 text-white flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires in {calculateDaysRemaining(selectedListing.expires_at)} days
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{selectedListing.location}, {selectedListing.city}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedListing.description}
                    </p>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium">{selectedListing.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Posted</span>
                        <span className="font-medium">{formatTimeAgo(selectedListing.posted_at)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Views</span>
                        <span className="font-medium">{selectedListing.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Seller Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {selectedListing.seller_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {selectedListing.seller_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedListing.seller_type === 'dealer' ? 'Dealer' : 'Individual'}
                        </div>
                      </div>
                      {selectedListing.is_verified && (
                        <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {unlockedContacts.has(selectedListing.id) ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700 mb-2">
                            <Unlock className="w-5 h-5" />
                            <span className="font-medium">Contact Unlocked</span>
                          </div>
                          <div className="text-sm text-green-600">
                            📱 {selectedListing.seller_name}: +91 XXXXXXXXXX
                          </div>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Seller Now
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleUnlockContact(selectedListing.id)}
                        disabled={isProcessingUnlock === selectedListing.id}
                      >
                        {isProcessingUnlock === selectedListing.id ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Unlock Contact (1 Token)
                          </>
                        )}
                      </Button>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleSaveListing(selectedListing.id)
                        toast.success(savedListings.has(selectedListing.id) ? 'Removed from saved items' : 'Added to saved items')
                      }}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${savedListings.has(selectedListing.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      {savedListings.has(selectedListing.id) ? 'Remove from Saved' : 'Save Listing'}
                    </Button>
                  </div>

                  {/* Safety Tips */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Safety Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Meet in a safe, public location</li>
                      <li>• Inspect the item before purchase</li>
                      <li>• Pay only after receiving the item</li>
                      <li>• Never share financial information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}