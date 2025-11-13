// API utility functions for fetching data

const API_BASE_URL = 'http://localhost:3001'

export interface ApiListing {
  id: string
  title: string
  description: string
  price: number | string
  category: string
  condition: string
  images: string[]
  location: string
  contactNumber: string
  sellerId: string
  sellerName: string
  sellerType: 'individual' | 'dealer'
  postedAt: string
  views: number
  status: string
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

// Fetch all listings
export async function fetchListings(): Promise<ApiListing[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/listings`)
    if (!response.ok) throw new Error('Failed to fetch listings')
    return await response.json()
  } catch (error) {
    console.error('Error fetching listings:', error)
    return []
  }
}

// Fetch listings by category
export async function fetchListingsByCategory(category: string): Promise<ApiListing[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/listings?category=${encodeURIComponent(category)}`)
    if (!response.ok) throw new Error('Failed to fetch listings')
    return await response.json()
  } catch (error) {
    console.error('Error fetching listings by category:', error)
    return []
  }
}

// Fetch single listing by ID
export async function fetchListingById(id: string): Promise<ApiListing | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`)
    if (!response.ok) throw new Error('Failed to fetch listing')
    return await response.json()
  } catch (error) {
    console.error('Error fetching listing:', error)
    return null
  }
}

// Get category counts
export async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const listings = await fetchListings()
    const counts: Record<string, number> = {}
    
    listings.forEach(listing => {
      counts[listing.category] = (counts[listing.category] || 0) + 1
    })
    
    return counts
  } catch (error) {
    console.error('Error getting category counts:', error)
    return {}
  }
}

// Helper function to transform time ago
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  if (diffInDays === 1) return '1 day ago'
  if (diffInDays < 7) return `${diffInDays} days ago`
  return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`
}

// Helper to format price
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/[^\d]/g, '')) : price
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numPrice)
}
