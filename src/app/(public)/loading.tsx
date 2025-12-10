import { ListingCardSkeleton } from '@/components/listings/listing-card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-4 space-y-6">
      {/* Banner Skeleton */}
      <Skeleton className="w-full h-48 rounded-lg" />
      
      {/* Categories Skeleton */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="w-12 h-3" />
          </div>
        ))}
      </div>
      
      {/* Tabs Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="w-24 h-10" />
        <Skeleton className="w-24 h-10" />
        <Skeleton className="w-24 h-10" />
      </div>
      
      {/* Listings Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
