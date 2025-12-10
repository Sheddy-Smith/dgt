'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ListingCard, ListingCardSkeleton } from '@/components/listings/listing-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Filter, Search as SearchIcon, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [category, setCategory] = useState('all')
  const [city, setCity] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [sortBy, setSortBy] = useState('recent')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    performSearch()
  }, [query, category, city, priceRange, sortBy, verifiedOnly])

  const performSearch = async () => {
    setLoading(true)
    try {
      // Mock search - replace with actual API
      const mockResults = [
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
          title: 'Samsung Galaxy S23 Ultra 512GB',
          price: 110000,
          location: 'Mumbai',
          image: '/api/placeholder/400/300',
          postedAt: '2025-12-08T15:30:00Z',
          isBoosted: false,
          isVerified: true,
          category: 'Mobiles'
        }
      ]
      
      setListings(mockResults)
      setLoading(false)
    } catch (error) {
      console.error('Search failed:', error)
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setCategory('all')
    setCity('all')
    setPriceRange([0, 1000000])
    setSortBy('recent')
    setVerifiedOnly(false)
  }

  const activeFiltersCount = [
    category !== 'all',
    city !== 'all',
    priceRange[0] > 0 || priceRange[1] < 1000000,
    verifiedOnly
  ].filter(Boolean).length

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Search Header */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for products, brands and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle>Filters</SheetTitle>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="mobiles">Mobiles</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="jobs">Jobs</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label>Price Range</Label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">
                    ₹{priceRange[0].toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">—</span>
                  <span className="text-sm font-medium">
                    ₹{priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  min={0}
                  max={1000000}
                  step={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>

              {/* Verified Sellers Only */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={verifiedOnly}
                  onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
                />
                <Label htmlFor="verified" className="text-sm font-normal">
                  Verified Sellers Only
                </Label>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full" onClick={() => setShowFilters(false)}>
                Show Results
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Searching...' : `${listings.length} results found`}
        </p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
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

      {/* Active Filters Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {category}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setCategory('all')} />
            </Badge>
          )}
          {city !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              {city}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setCity('all')} />
            </Badge>
          )}
          {verifiedOnly && (
            <Badge variant="secondary" className="gap-1">
              Verified Only
              <X className="h-3 w-3 cursor-pointer" onClick={() => setVerifiedOnly(false)} />
            </Badge>
          )}
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search query
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  )
}
